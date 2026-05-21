const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/sales/today - Today's sales summary (must be before /:id)
router.get('/today', authenticate, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const summary = db.prepare(`
      SELECT
        COUNT(*) as total_sales,
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(AVG(total), 0) as avg_ticket,
        COALESCE(SUM(discount), 0) as total_discounts
      FROM sales
      WHERE date(created_at) = date('now', 'localtime') AND status = 'concluida'
    `).get();

    const sales = db.prepare(`
      SELECT s.*, c.name as customer_name, u.name as seller_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE date(s.created_at) = date('now', 'localtime')
      ORDER BY s.created_at DESC
    `).all();

    const paymentBreakdown = db.prepare(`
      SELECT payment_method, COUNT(*) as count, COALESCE(SUM(total), 0) as total
      FROM sales
      WHERE date(created_at) = date('now', 'localtime') AND status = 'concluida'
      GROUP BY payment_method
    `).all();

    res.json({ summary, sales, paymentBreakdown });
  } catch (err) {
    console.error('Erro ao buscar vendas do dia:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/sales/by-seller - Sales grouped by seller
router.get('/by-seller', authenticate, (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND date(s.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else {
      dateFilter = "AND date(s.created_at) >= date('now', '-30 days')";
    }

    const sellers = db.prepare(`
      SELECT
        u.id, u.name,
        COUNT(s.id) as total_sales,
        COALESCE(SUM(s.total), 0) as total_revenue,
        COALESCE(AVG(s.total), 0) as avg_ticket,
        COALESCE(SUM(s.discount), 0) as total_discounts
      FROM users u
      LEFT JOIN sales s ON s.user_id = u.id AND s.status = 'concluida' ${dateFilter}
      WHERE u.active = 1
      GROUP BY u.id
      ORDER BY total_revenue DESC
    `).all(...params);

    res.json(sellers);
  } catch (err) {
    console.error('Erro ao buscar vendas por vendedor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/sales - List sales with pagination and filters
router.get('/', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '', payment = '', startDate, endDate, seller } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (search) {
      conditions.push('(c.name LIKE ? OR CAST(s.id AS TEXT) LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s);
    }

    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }

    if (payment) {
      conditions.push('s.payment_method = ?');
      params.push(payment);
    }

    if (startDate) {
      conditions.push('date(s.created_at) >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('date(s.created_at) <= ?');
      params.push(endDate);
    }

    if (seller) {
      conditions.push('s.user_id = ?');
      params.push(parseInt(seller));
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = db.prepare(`
      SELECT COUNT(*) as total
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      ${whereClause}
    `).get(...params);

    const sales = db.prepare(`
      SELECT s.*, c.name as customer_name, u.name as seller_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      LEFT JOIN users u ON u.id = s.user_id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totals = db.prepare(`
      SELECT
        COALESCE(SUM(s.total), 0) as total_revenue,
        COUNT(*) as total_count
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      ${whereClause.replace('WHERE', 'WHERE s.status = \'concluida\' AND')}
    `).get(...params);

    res.json({
      sales,
      totals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erro ao listar vendas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/sales/:id - Get sale details
router.get('/:id', authenticate, (req, res) => {
  try {
    const sale = db.prepare(`
      SELECT s.*, c.name as customer_name, c.phone as customer_phone,
             c.whatsapp as customer_whatsapp, u.name as seller_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `).get(req.params.id);

    if (!sale) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    const items = db.prepare(`
      SELECT si.*, p.name as product_name, p.sku, p.brand as product_brand
      FROM sale_items si
      JOIN products p ON p.id = si.product_id
      WHERE si.sale_id = ?
    `).all(req.params.id);

    res.json({ sale, items });
  } catch (err) {
    console.error('Erro ao buscar venda:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/sales - Create sale (deduct stock, create movements)
router.post('/', authenticate, (req, res) => {
  try {
    const { customer_id, items, discount = 0, payment_method = 'dinheiro', notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'A venda deve ter pelo menos um item' });
    }

    // Validate all items have stock
    for (const item of items) {
      const product = db.prepare('SELECT id, name, quantity, sale_price FROM products WHERE id = ? AND active = 1').get(item.product_id);
      if (!product) {
        return res.status(400).json({ error: `Produto ID ${item.product_id} não encontrado ou inativo` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Estoque insuficiente para "${product.name}". Disponível: ${product.quantity}, Solicitado: ${item.quantity}`
        });
      }
    }

    // Use a transaction for atomicity
    const createSale = db.transaction(() => {
      let total = 0;

      // Calculate total
      for (const item of items) {
        const product = db.prepare('SELECT sale_price FROM products WHERE id = ?').get(item.product_id);
        const unitPrice = item.unit_price || product.sale_price;
        total += unitPrice * item.quantity;
      }

      total -= discount;
      if (total < 0) total = 0;

      // Create sale
      const saleResult = db.prepare(`
        INSERT INTO sales (customer_id, user_id, total, discount, payment_method, status, notes)
        VALUES (?, ?, ?, ?, ?, 'concluida', ?)
      `).run(customer_id || null, req.user.id, total, discount, payment_method, notes || null);

      const saleId = saleResult.lastInsertRowid;

      // Create sale items, deduct stock, create movements
      for (const item of items) {
        const product = db.prepare('SELECT sale_price FROM products WHERE id = ?').get(item.product_id);
        const unitPrice = item.unit_price || product.sale_price;
        const subtotal = unitPrice * item.quantity;

        // Create sale item
        db.prepare(`
          INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `).run(saleId, item.product_id, item.quantity, unitPrice, subtotal);

        // Deduct stock
        db.prepare('UPDATE products SET quantity = quantity - ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?')
          .run(item.quantity, item.product_id);

        // Create stock movement
        db.prepare(`
          INSERT INTO stock_movements (product_id, type, quantity, reason, reference_id, user_id)
          VALUES (?, 'saida', ?, 'Venda', ?, ?)
        `).run(item.product_id, item.quantity, saleId, req.user.id);
      }

      return saleId;
    });

    const saleId = createSale();

    const sale = db.prepare(`
      SELECT s.*, c.name as customer_name, u.name as seller_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `).get(saleId);

    const saleItems = db.prepare(`
      SELECT si.*, p.name as product_name, p.sku
      FROM sale_items si
      JOIN products p ON p.id = si.product_id
      WHERE si.sale_id = ?
    `).all(saleId);

    res.status(201).json({ sale, items: saleItems });
  } catch (err) {
    console.error('Erro ao criar venda:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
