const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/dashboard/stats - Today's sales, revenue, customers, low stock count
router.get('/stats', authenticate, (req, res) => {
  try {
    const todaySales = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE date(created_at) = date('now', 'localtime') AND status = 'concluida'
    `).get();

    const yesterdaySales = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE date(created_at) = date('now', 'localtime', '-1 day') AND status = 'concluida'
    `).get();

    const monthSales = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime') AND status = 'concluida'
    `).get();

    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get();

    const newCustomersToday = db.prepare(`
      SELECT COUNT(*) as count FROM customers
      WHERE date(created_at) = date('now', 'localtime')
    `).get();

    const lowStockCount = db.prepare(`
      SELECT COUNT(*) as count FROM products
      WHERE active = 1 AND quantity <= min_stock
    `).get();

    const outOfStockCount = db.prepare(`
      SELECT COUNT(*) as count FROM products
      WHERE active = 1 AND quantity = 0
    `).get();

    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE active = 1').get();

    const pendingReminders = db.prepare(`
      SELECT COUNT(*) as count FROM maintenance_reminders
      WHERE status = 'pendente' AND date(due_date) <= date('now', 'localtime', '+7 days')
    `).get();

    res.json({
      today: {
        sales: todaySales.count,
        revenue: todaySales.revenue,
        revenueChange: yesterdaySales.revenue > 0
          ? (((todaySales.revenue - yesterdaySales.revenue) / yesterdaySales.revenue) * 100).toFixed(1)
          : 0
      },
      month: {
        sales: monthSales.count,
        revenue: monthSales.revenue
      },
      customers: {
        total: totalCustomers.count,
        newToday: newCustomersToday.count
      },
      inventory: {
        totalProducts: totalProducts.count,
        lowStock: lowStockCount.count,
        outOfStock: outOfStockCount.count
      },
      pendingReminders: pendingReminders.count
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/top-products - Top 10 most sold products
router.get('/top-products', authenticate, (req, res) => {
  try {
    const { period = '30' } = req.query;

    const products = db.prepare(`
      SELECT p.id, p.name, p.sku, p.brand, p.sale_price, p.quantity as current_stock,
        SUM(si.quantity) as total_sold,
        SUM(si.subtotal) as total_revenue,
        COUNT(DISTINCT si.sale_id) as sale_count
      FROM sale_items si
      JOIN products p ON p.id = si.product_id
      JOIN sales s ON s.id = si.sale_id
      WHERE s.status = 'concluida'
        AND s.created_at >= datetime('now', '-${parseInt(period)} days')
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 10
    `).all();

    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar top produtos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/sales-chart - Last 7 days sales data for chart
router.get('/sales-chart', authenticate, (req, res) => {
  try {
    const { days = 7 } = req.query;

    const data = db.prepare(`
      WITH RECURSIVE dates(date) AS (
        SELECT date('now', 'localtime', '-${parseInt(days) - 1} days')
        UNION ALL
        SELECT date(date, '+1 day')
        FROM dates
        WHERE date < date('now', 'localtime')
      )
      SELECT
        d.date,
        COALESCE(COUNT(s.id), 0) as sales_count,
        COALESCE(SUM(s.total), 0) as revenue
      FROM dates d
      LEFT JOIN sales s ON date(s.created_at) = d.date AND s.status = 'concluida'
      GROUP BY d.date
      ORDER BY d.date ASC
    `).all();

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/revenue-chart - Last 7 days revenue for chart
router.get('/revenue-chart', authenticate, (req, res) => {
  try {
    const { days = 7 } = req.query;

    const data = db.prepare(`
      WITH RECURSIVE dates(date) AS (
        SELECT date('now', 'localtime', '-${parseInt(days) - 1} days')
        UNION ALL
        SELECT date(date, '+1 day')
        FROM dates
        WHERE date < date('now', 'localtime')
      )
      SELECT
        d.date,
        COALESCE(SUM(s.total), 0) as revenue,
        COALESCE(SUM(s.discount), 0) as discounts,
        COALESCE(COUNT(s.id), 0) as sales_count
      FROM dates d
      LEFT JOIN sales s ON date(s.created_at) = d.date AND s.status = 'concluida'
      GROUP BY d.date
      ORDER BY d.date ASC
    `).all();

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar dados de receita:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/stock-alerts - Low stock and stagnant products
router.get('/stock-alerts', authenticate, (req, res) => {
  try {
    const lowStock = db.prepare(`
      SELECT p.id, p.name, p.sku, p.brand, p.quantity, p.min_stock, p.sale_price,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1 AND p.quantity <= p.min_stock AND p.quantity > 0
      ORDER BY (p.quantity * 1.0 / p.min_stock) ASC
      LIMIT 20
    `).all();

    const outOfStock = db.prepare(`
      SELECT p.id, p.name, p.sku, p.brand, p.min_stock, p.sale_price,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1 AND p.quantity = 0
      ORDER BY p.name ASC
    `).all();

    const stagnant = db.prepare(`
      SELECT p.id, p.name, p.sku, p.brand, p.quantity, p.sale_price,
        c.name as category_name,
        (SELECT MAX(s.created_at) FROM sales s
         JOIN sale_items si ON si.sale_id = s.id
         WHERE si.product_id = p.id AND s.status = 'concluida') as last_sale
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1 AND p.quantity > 0
        AND p.id NOT IN (
          SELECT DISTINCT si.product_id FROM sale_items si
          JOIN sales s ON s.id = si.sale_id
          WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-30 days')
        )
      ORDER BY p.quantity * p.sale_price DESC
      LIMIT 20
    `).all();

    res.json({ lowStock, outOfStock, stagnant });
  } catch (err) {
    console.error('Erro ao buscar alertas de estoque:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/seller-performance - Seller performance stats
router.get('/seller-performance', authenticate, (req, res) => {
  try {
    const { period = '30' } = req.query;

    const sellers = db.prepare(`
      SELECT
        u.id, u.name, u.email,
        COUNT(s.id) as total_sales,
        COALESCE(SUM(s.total), 0) as total_revenue,
        COALESCE(AVG(s.total), 0) as avg_ticket,
        COUNT(DISTINCT s.customer_id) as unique_customers,
        COALESCE(SUM(s.discount), 0) as total_discounts
      FROM users u
      LEFT JOIN sales s ON s.user_id = u.id
        AND s.status = 'concluida'
        AND s.created_at >= datetime('now', '-${parseInt(period)} days')
      WHERE u.active = 1
      GROUP BY u.id
      ORDER BY total_revenue DESC
    `).all();

    // Daily breakdown per seller for the last 7 days
    const dailyBreakdown = db.prepare(`
      SELECT
        u.id as user_id, u.name,
        date(s.created_at) as date,
        COUNT(s.id) as sales,
        COALESCE(SUM(s.total), 0) as revenue
      FROM users u
      LEFT JOIN sales s ON s.user_id = u.id
        AND s.status = 'concluida'
        AND s.created_at >= datetime('now', '-7 days')
      WHERE u.active = 1
      GROUP BY u.id, date(s.created_at)
      ORDER BY u.id, date(s.created_at)
    `).all();

    res.json({ sellers, dailyBreakdown });
  } catch (err) {
    console.error('Erro ao buscar performance:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/dashboard/ai-insights - AI-like insights
router.get('/ai-insights', authenticate, (req, res) => {
  try {
    const insights = [];

    // 1. Demand forecast - products trending up
    const trendingUp = db.prepare(`
      SELECT p.name, p.sku,
        (SELECT COALESCE(SUM(si.quantity), 0) FROM sale_items si
         JOIN sales s ON s.id = si.sale_id
         WHERE si.product_id = p.id AND s.status = 'concluida'
         AND s.created_at >= datetime('now', '-7 days')) as last_week,
        (SELECT COALESCE(SUM(si.quantity), 0) FROM sale_items si
         JOIN sales s ON s.id = si.sale_id
         WHERE si.product_id = p.id AND s.status = 'concluida'
         AND s.created_at >= datetime('now', '-14 days')
         AND s.created_at < datetime('now', '-7 days')) as prev_week
      FROM products p
      WHERE p.active = 1
      HAVING last_week > prev_week AND last_week > 0
      ORDER BY (last_week - prev_week) DESC
      LIMIT 5
    `).all();

    if (trendingUp.length > 0) {
      insights.push({
        type: 'trending',
        icon: '📈',
        title: 'Produtos em alta',
        description: `${trendingUp.map(p => p.name).join(', ')} estão com demanda crescente esta semana.`,
        priority: 'info',
        data: trendingUp
      });
    }

    // 2. Purchase suggestions - products that need restocking
    const needRestock = db.prepare(`
      SELECT p.name, p.sku, p.quantity, p.min_stock, p.cost_price,
        (p.min_stock - p.quantity) as qty_needed,
        (p.min_stock - p.quantity) * p.cost_price as investment_needed
      FROM products p
      WHERE p.active = 1 AND p.quantity <= p.min_stock
      ORDER BY qty_needed DESC
      LIMIT 10
    `).all();

    if (needRestock.length > 0) {
      const totalInvestment = needRestock.reduce((sum, p) => sum + p.investment_needed, 0);
      insights.push({
        type: 'restock',
        icon: '🛒',
        title: 'Sugestão de compra',
        description: `${needRestock.length} produtos precisam de reposição. Investimento estimado: R$ ${totalInvestment.toFixed(2)}`,
        priority: 'warning',
        data: needRestock
      });
    }

    // 3. Revenue prediction
    const last7Days = db.prepare(`
      SELECT COALESCE(AVG(daily_revenue), 0) as avg_daily
      FROM (
        SELECT date(created_at) as day, SUM(total) as daily_revenue
        FROM sales
        WHERE status = 'concluida' AND created_at >= datetime('now', '-7 days')
        GROUP BY date(created_at)
      )
    `).get();

    if (last7Days.avg_daily > 0) {
      const monthProjection = last7Days.avg_daily * 30;
      insights.push({
        type: 'forecast',
        icon: '🔮',
        title: 'Previsão de faturamento',
        description: `Com base na média dos últimos 7 dias (R$ ${last7Days.avg_daily.toFixed(2)}/dia), a projeção mensal é de R$ ${monthProjection.toFixed(2)}.`,
        priority: 'info',
        data: { avgDaily: last7Days.avg_daily, monthProjection }
      });
    }

    // 4. Best day of week
    const bestDay = db.prepare(`
      SELECT 
        CASE CAST(strftime('%w', created_at) AS INTEGER)
          WHEN 0 THEN 'Domingo'
          WHEN 1 THEN 'Segunda-feira'
          WHEN 2 THEN 'Terça-feira'
          WHEN 3 THEN 'Quarta-feira'
          WHEN 4 THEN 'Quinta-feira'
          WHEN 5 THEN 'Sexta-feira'
          WHEN 6 THEN 'Sábado'
        END as day_name,
        COUNT(*) as total_sales,
        SUM(total) as total_revenue
      FROM sales
      WHERE status = 'concluida' AND created_at >= datetime('now', '-30 days')
      GROUP BY strftime('%w', created_at)
      ORDER BY total_revenue DESC
      LIMIT 1
    `).get();

    if (bestDay) {
      insights.push({
        type: 'pattern',
        icon: '📊',
        title: 'Melhor dia de vendas',
        description: `${bestDay.day_name} é o melhor dia da semana com R$ ${bestDay.total_revenue.toFixed(2)} de faturamento médio nos últimos 30 dias.`,
        priority: 'info',
        data: bestDay
      });
    }

    // 5. Customer retention alert
    const inactiveCustomers = db.prepare(`
      SELECT COUNT(*) as count
      FROM customers c
      WHERE c.id IN (SELECT DISTINCT customer_id FROM sales WHERE customer_id IS NOT NULL)
        AND c.id NOT IN (
          SELECT DISTINCT customer_id FROM sales
          WHERE customer_id IS NOT NULL
          AND created_at >= datetime('now', '-30 days')
        )
    `).get();

    if (inactiveCustomers.count > 0) {
      insights.push({
        type: 'retention',
        icon: '⚠️',
        title: 'Clientes inativos',
        description: `${inactiveCustomers.count} clientes não compram há mais de 30 dias. Considere enviar promoções via WhatsApp.`,
        priority: 'warning',
        data: inactiveCustomers
      });
    }

    // 6. Popular payment method
    const paymentStats = db.prepare(`
      SELECT payment_method, COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales WHERE status = 'concluida'), 1) as percentage
      FROM sales
      WHERE status = 'concluida' AND created_at >= datetime('now', '-30 days')
      GROUP BY payment_method
      ORDER BY count DESC
    `).all();

    if (paymentStats.length > 0) {
      insights.push({
        type: 'payment',
        icon: '💳',
        title: 'Formas de pagamento',
        description: `${paymentStats[0].payment_method} é a forma de pagamento mais usada (${paymentStats[0].percentage}% das vendas).`,
        priority: 'info',
        data: paymentStats
      });
    }

    // 7. Margin analysis
    const marginAnalysis = db.prepare(`
      SELECT
        COALESCE(AVG((p.sale_price - p.cost_price) / p.sale_price * 100), 0) as avg_margin
      FROM sale_items si
      JOIN products p ON p.id = si.product_id
      JOIN sales s ON s.id = si.sale_id
      WHERE s.status = 'concluida' AND s.created_at >= datetime('now', '-30 days')
        AND p.sale_price > 0
    `).get();

    if (marginAnalysis.avg_margin > 0) {
      insights.push({
        type: 'margin',
        icon: '💰',
        title: 'Margem média',
        description: `A margem média das vendas dos últimos 30 dias é de ${marginAnalysis.avg_margin.toFixed(1)}%.`,
        priority: marginAnalysis.avg_margin < 20 ? 'warning' : 'info',
        data: marginAnalysis
      });
    }

    res.json(insights);
  } catch (err) {
    console.error('Erro ao gerar insights:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
