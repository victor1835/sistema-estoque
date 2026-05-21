const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/inventory/movements - Stock movement history
router.get('/movements', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 30, type = '', product_id = '', startDate, endDate } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (type) {
      conditions.push('sm.type = ?');
      params.push(type);
    }

    if (product_id) {
      conditions.push('sm.product_id = ?');
      params.push(parseInt(product_id));
    }

    if (startDate) {
      conditions.push('date(sm.created_at) >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('date(sm.created_at) <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM stock_movements sm ${whereClause}`).get(...params);

    const movements = db.prepare(`
      SELECT sm.*, p.name as product_name, p.sku, u.name as user_name
      FROM stock_movements sm
      JOIN products p ON p.id = sm.product_id
      LEFT JOIN users u ON u.id = sm.user_id
      ${whereClause}
      ORDER BY sm.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erro ao listar movimentações:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/inventory/entry - Manual stock entry
router.post('/entry', authenticate, (req, res) => {
  try {
    const { product_id, quantity, reason } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Produto e quantidade válida são obrigatórios' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ? AND active = 1').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const doEntry = db.transaction(() => {
      // Create movement
      db.prepare(`
        INSERT INTO stock_movements (product_id, type, quantity, reason, user_id)
        VALUES (?, 'entrada', ?, ?, ?)
      `).run(product_id, quantity, reason || 'Entrada manual de estoque', req.user.id);

      // Update stock
      db.prepare('UPDATE products SET quantity = quantity + ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?')
        .run(quantity, product_id);
    });

    doEntry();

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);

    res.status(201).json({
      message: 'Entrada de estoque registrada com sucesso',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Erro na entrada de estoque:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/inventory/adjustment - Stock adjustment
router.post('/adjustment', authenticate, (req, res) => {
  try {
    const { product_id, new_quantity, reason } = req.body;

    if (!product_id || new_quantity === undefined || new_quantity < 0) {
      return res.status(400).json({ error: 'Produto e nova quantidade são obrigatórios' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ? AND active = 1').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const diff = new_quantity - product.quantity;

    if (diff === 0) {
      return res.json({ message: 'Nenhuma alteração necessária', product });
    }

    const doAdjustment = db.transaction(() => {
      const type = diff > 0 ? 'entrada' : 'saida';
      const absQty = Math.abs(diff);

      db.prepare(`
        INSERT INTO stock_movements (product_id, type, quantity, reason, user_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(product_id, type, absQty, reason || `Ajuste de estoque (${product.quantity} → ${new_quantity})`, req.user.id);

      db.prepare('UPDATE products SET quantity = ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?')
        .run(new_quantity, product_id);
    });

    doAdjustment();

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);

    res.json({
      message: 'Ajuste de estoque realizado com sucesso',
      previousQuantity: product.quantity,
      newQuantity: new_quantity,
      difference: diff,
      product: updatedProduct
    });
  } catch (err) {
    console.error('Erro no ajuste de estoque:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/inventory/turnover - Stock turnover analysis
router.get('/turnover', authenticate, (req, res) => {
  try {
    const { period = '30' } = req.query;

    const turnover = db.prepare(`
      SELECT
        p.id, p.name, p.sku, p.brand, p.quantity, p.cost_price, p.sale_price,
        c.name as category_name,
        COALESCE(sold.total_sold, 0) as total_sold,
        CASE
          WHEN p.quantity > 0 AND COALESCE(sold.total_sold, 0) > 0
          THEN ROUND(COALESCE(sold.total_sold, 0) * 1.0 / ((p.quantity + COALESCE(sold.total_sold, 0)) / 2.0), 2)
          ELSE 0
        END as turnover_rate,
        CASE
          WHEN COALESCE(sold.total_sold, 0) > 0
          THEN ROUND(p.quantity * 1.0 / (COALESCE(sold.total_sold, 0) * 1.0 / ${parseInt(period)}), 0)
          ELSE 999
        END as days_of_stock,
        p.quantity * p.cost_price as stock_value
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN (
        SELECT si.product_id, SUM(si.quantity) as total_sold
        FROM sale_items si
        JOIN sales s ON s.id = si.sale_id
        WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-${parseInt(period)} days')
        GROUP BY si.product_id
      ) sold ON sold.product_id = p.id
      WHERE p.active = 1
      ORDER BY turnover_rate DESC
    `).all();

    const summary = {
      totalProducts: turnover.length,
      totalStockValue: turnover.reduce((sum, p) => sum + p.stock_value, 0),
      avgTurnover: turnover.length > 0
        ? turnover.reduce((sum, p) => sum + p.turnover_rate, 0) / turnover.length
        : 0,
      highTurnover: turnover.filter(p => p.turnover_rate >= 2).length,
      lowTurnover: turnover.filter(p => p.turnover_rate < 0.5 && p.turnover_rate > 0).length,
      noSales: turnover.filter(p => p.total_sold === 0).length
    };

    res.json({ turnover, summary });
  } catch (err) {
    console.error('Erro na análise de giro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/inventory/forecast - Demand forecast based on sales history
router.get('/forecast', authenticate, (req, res) => {
  try {
    const forecast = db.prepare(`
      SELECT
        p.id, p.name, p.sku, p.brand, p.quantity, p.min_stock, p.cost_price,
        c.name as category_name,
        COALESCE(w1.sold, 0) as sold_last_7d,
        COALESCE(w2.sold, 0) as sold_prev_7d,
        COALESCE(m1.sold, 0) as sold_last_30d,
        CASE
          WHEN COALESCE(m1.sold, 0) > 0
          THEN ROUND(COALESCE(m1.sold, 0) / 30.0, 2)
          ELSE 0
        END as avg_daily_demand,
        CASE
          WHEN COALESCE(m1.sold, 0) > 0
          THEN ROUND(p.quantity / (COALESCE(m1.sold, 0) / 30.0), 0)
          ELSE 999
        END as days_until_stockout,
        CASE
          WHEN COALESCE(w1.sold, 0) > COALESCE(w2.sold, 0) THEN 'crescente'
          WHEN COALESCE(w1.sold, 0) < COALESCE(w2.sold, 0) THEN 'decrescente'
          ELSE 'estável'
        END as demand_trend,
        CASE
          WHEN COALESCE(m1.sold, 0) > 0 AND p.quantity / (COALESCE(m1.sold, 0) / 30.0) < 14
          THEN ROUND((COALESCE(m1.sold, 0) / 30.0) * 30 - p.quantity + p.min_stock, 0)
          ELSE 0
        END as suggested_order_qty
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN (
        SELECT si.product_id, SUM(si.quantity) as sold
        FROM sale_items si JOIN sales s ON s.id = si.sale_id
        WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-7 days')
        GROUP BY si.product_id
      ) w1 ON w1.product_id = p.id
      LEFT JOIN (
        SELECT si.product_id, SUM(si.quantity) as sold
        FROM sale_items si JOIN sales s ON s.id = si.sale_id
        WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-14 days')
          AND s.created_at < datetime('now', '-7 days')
        GROUP BY si.product_id
      ) w2 ON w2.product_id = p.id
      LEFT JOIN (
        SELECT si.product_id, SUM(si.quantity) as sold
        FROM sale_items si JOIN sales s ON s.id = si.sale_id
        WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-30 days')
        GROUP BY si.product_id
      ) m1 ON m1.product_id = p.id
      WHERE p.active = 1
      ORDER BY days_until_stockout ASC
    `).all();

    const urgentRestock = forecast.filter(p => p.days_until_stockout < 14 && p.days_until_stockout > 0);
    const totalOrderCost = urgentRestock.reduce((sum, p) => sum + (p.suggested_order_qty * p.cost_price), 0);

    res.json({
      forecast,
      summary: {
        urgentRestock: urgentRestock.length,
        totalOrderCost: totalOrderCost,
        trendingUp: forecast.filter(p => p.demand_trend === 'crescente').length,
        trendingDown: forecast.filter(p => p.demand_trend === 'decrescente').length,
        stable: forecast.filter(p => p.demand_trend === 'estável').length
      }
    });
  } catch (err) {
    console.error('Erro na previsão de demanda:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
