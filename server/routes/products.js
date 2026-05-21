const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/products/low-stock - Products below min_stock (must be before /:id)
router.get('/low-stock', authenticate, (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1 AND p.quantity <= p.min_stock
      ORDER BY (p.quantity * 1.0 / p.min_stock) ASC
    `).all();

    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos com estoque baixo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products/stagnant - Products not sold in 30+ days
router.get('/stagnant', authenticate, (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name,
        (SELECT MAX(s.created_at) FROM sales s
         JOIN sale_items si ON si.sale_id = s.id
         WHERE si.product_id = p.id AND s.status = 'concluida') as last_sale_date
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1 AND p.quantity > 0
        AND (
          p.id NOT IN (
            SELECT DISTINCT si.product_id FROM sale_items si
            JOIN sales s ON s.id = si.sale_id
            WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-30 days')
          )
        )
      ORDER BY p.quantity DESC
    `).all();

    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos parados:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products/search/:query - Smart search
router.get('/search/:query', authenticate, (req, res) => {
  try {
    const searchTerm = `%${req.params.query}%`;

    const products = db.prepare(`
      SELECT DISTINCT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_compatibility pc ON pc.product_id = p.id
      WHERE p.active = 1 AND (
        p.name LIKE ? OR
        p.sku LIKE ? OR
        p.description LIKE ? OR
        p.brand LIKE ? OR
        p.barcode LIKE ? OR
        (pc.moto_brand || ' ' || pc.moto_model) LIKE ?
      )
      ORDER BY p.name ASC
      LIMIT 50
    `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);

    res.json(products);
  } catch (err) {
    console.error('Erro na busca:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products - List with pagination, search, category filter, stock filter
router.get('/', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '', stock = '', brand = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = ['p.active = 1'];
    let params = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (category) {
      conditions.push('p.category_id = ?');
      params.push(parseInt(category));
    }

    if (brand) {
      conditions.push('p.brand LIKE ?');
      params.push(`%${brand}%`);
    }

    if (stock === 'low') {
      conditions.push('p.quantity <= p.min_stock');
    } else if (stock === 'out') {
      conditions.push('p.quantity = 0');
    } else if (stock === 'ok') {
      conditions.push('p.quantity > p.min_stock');
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM products p ${whereClause}`).get(...params);

    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ORDER BY p.name ASC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();

    res.json({
      products,
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products/:id - Get product with compatibility
router.get('/:id', authenticate, (req, res) => {
  try {
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const compatibility = db.prepare(
      'SELECT * FROM product_compatibility WHERE product_id = ?'
    ).all(req.params.id);

    const recentMovements = db.prepare(`
      SELECT sm.*, u.name as user_name
      FROM stock_movements sm
      LEFT JOIN users u ON u.id = sm.user_id
      WHERE sm.product_id = ?
      ORDER BY sm.created_at DESC
      LIMIT 20
    `).all(req.params.id);

    const salesStats = db.prepare(`
      SELECT 
        COALESCE(SUM(si.quantity), 0) as total_sold,
        COALESCE(SUM(si.subtotal), 0) as total_revenue,
        COUNT(DISTINCT si.sale_id) as sale_count
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE si.product_id = ? AND s.status = 'concluida'
    `).get(req.params.id);

    res.json({ product, compatibility, recentMovements, salesStats });
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/products - Create product
router.post('/', authenticate, (req, res) => {
  try {
    const {
      sku, name, description, category_id, brand, cost_price, sale_price,
      quantity, min_stock, max_stock, location, barcode, weight, unit
    } = req.body;

    if (!sku || !name) {
      return res.status(400).json({ error: 'SKU e nome são obrigatórios' });
    }

    const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);
    if (existing) {
      return res.status(409).json({ error: 'SKU já cadastrado' });
    }

    const result = db.prepare(`
      INSERT INTO products (sku, name, description, category_id, brand, cost_price, sale_price,
        quantity, min_stock, max_stock, location, barcode, weight, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sku, name, description || null, category_id || null, brand || null,
      cost_price || 0, sale_price || 0, quantity || 0,
      min_stock || 5, max_stock || 100, location || null,
      barcode || null, weight || null, unit || 'un'
    );

    if (quantity && quantity > 0) {
      db.prepare(`
        INSERT INTO stock_movements (product_id, type, quantity, reason, user_id)
        VALUES (?, 'entrada', ?, 'Estoque inicial', ?)
      `).run(result.lastInsertRowid, quantity, req.user.id);
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const {
      sku, name, description, category_id, brand, cost_price, sale_price,
      quantity, min_stock, max_stock, location, barcode, weight, unit, active
    } = req.body;

    if (sku && sku !== existing.sku) {
      const skuExists = db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(sku, req.params.id);
      if (skuExists) {
        return res.status(409).json({ error: 'SKU já cadastrado para outro produto' });
      }
    }

    db.prepare(`
      UPDATE products SET
        sku = COALESCE(?, sku),
        name = COALESCE(?, name),
        description = ?,
        category_id = ?,
        brand = ?,
        cost_price = COALESCE(?, cost_price),
        sale_price = COALESCE(?, sale_price),
        quantity = COALESCE(?, quantity),
        min_stock = COALESCE(?, min_stock),
        max_stock = COALESCE(?, max_stock),
        location = ?,
        barcode = ?,
        weight = ?,
        unit = COALESCE(?, unit),
        active = COALESCE(?, active),
        updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(
      sku || null, name || null,
      description !== undefined ? description : existing.description,
      category_id !== undefined ? category_id : existing.category_id,
      brand !== undefined ? brand : existing.brand,
      cost_price || null, sale_price || null, quantity !== undefined ? quantity : null,
      min_stock || null, max_stock || null,
      location !== undefined ? location : existing.location,
      barcode !== undefined ? barcode : existing.barcode,
      weight !== undefined ? weight : existing.weight,
      unit || null, active !== undefined ? active : null,
      req.params.id
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/products/:id - Delete (deactivate) product
router.delete('/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    db.prepare('UPDATE products SET active = 0, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?').run(req.params.id);

    res.json({ message: 'Produto desativado com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/products/:id/compatibility - Add compatibility
router.post('/:id/compatibility', authenticate, (req, res) => {
  try {
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const { moto_brand, moto_model, year_start, year_end } = req.body;

    if (!moto_brand || !moto_model) {
      return res.status(400).json({ error: 'Marca e modelo da moto são obrigatórios' });
    }

    const result = db.prepare(`
      INSERT INTO product_compatibility (product_id, moto_brand, moto_model, year_start, year_end)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.params.id, moto_brand, moto_model, year_start || null, year_end || null);

    const compat = db.prepare('SELECT * FROM product_compatibility WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(compat);
  } catch (err) {
    console.error('Erro ao adicionar compatibilidade:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
