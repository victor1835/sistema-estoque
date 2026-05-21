const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/customers - List all customers with pagination and search
router.get('/', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = `WHERE c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.cpf LIKE ? OR c.whatsapp LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM customers c ${whereClause}`).get(...params);

    const customers = db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM customer_vehicles WHERE customer_id = c.id) as vehicle_count,
        (SELECT COUNT(*) FROM sales WHERE customer_id = c.id AND status = 'concluida') as purchase_count,
        (SELECT COALESCE(SUM(total), 0) FROM sales WHERE customer_id = c.id AND status = 'concluida') as total_spent
      FROM customers c
      ${whereClause}
      ORDER BY c.name ASC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/customers/:id - Get customer with vehicles and purchase history
router.get('/:id', authenticate, (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const vehicles = db.prepare('SELECT * FROM customer_vehicles WHERE customer_id = ?').all(req.params.id);

    const purchases = db.prepare(`
      SELECT s.*, u.name as seller_name,
        (SELECT json_group_array(json_object(
          'id', si.id, 'product_name', p.name, 'quantity', si.quantity,
          'unit_price', si.unit_price, 'subtotal', si.subtotal
        ))
        FROM sale_items si
        JOIN products p ON p.id = si.product_id
        WHERE si.sale_id = s.id) as items
      FROM sales s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.customer_id = ?
      ORDER BY s.created_at DESC
      LIMIT 20
    `).all(req.params.id);

    const reminders = db.prepare(`
      SELECT mr.*, cv.brand as vehicle_brand, cv.model as vehicle_model, cv.year as vehicle_year
      FROM maintenance_reminders mr
      LEFT JOIN customer_vehicles cv ON cv.id = mr.vehicle_id
      WHERE mr.customer_id = ?
      ORDER BY mr.due_date ASC
    `).all(req.params.id);

    res.json({ customer, vehicles, purchases, reminders });
  } catch (err) {
    console.error('Erro ao buscar cliente:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/customers - Create customer
router.post('/', authenticate, (req, res) => {
  try {
    const { name, email, phone, whatsapp, cpf, address, city, state, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    if (cpf) {
      const existing = db.prepare('SELECT id FROM customers WHERE cpf = ?').get(cpf);
      if (existing) {
        return res.status(409).json({ error: 'CPF já cadastrado' });
      }
    }

    const result = db.prepare(`
      INSERT INTO customers (name, email, phone, whatsapp, cpf, address, city, state, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email || null, phone || null, whatsapp || null, cpf || null, address || null, city || null, state || null, notes || null);

    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(customer);
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const { name, email, phone, whatsapp, cpf, address, city, state, notes } = req.body;

    if (cpf && cpf !== existing.cpf) {
      const cpfExists = db.prepare('SELECT id FROM customers WHERE cpf = ? AND id != ?').get(cpf, req.params.id);
      if (cpfExists) {
        return res.status(409).json({ error: 'CPF já cadastrado para outro cliente' });
      }
    }

    db.prepare(`
      UPDATE customers SET
        name = COALESCE(?, name),
        email = ?,
        phone = ?,
        whatsapp = ?,
        cpf = ?,
        address = ?,
        city = ?,
        state = ?,
        notes = ?,
        updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(
      name || existing.name,
      email !== undefined ? email : existing.email,
      phone !== undefined ? phone : existing.phone,
      whatsapp !== undefined ? whatsapp : existing.whatsapp,
      cpf !== undefined ? cpf : existing.cpf,
      address !== undefined ? address : existing.address,
      city !== undefined ? city : existing.city,
      state !== undefined ? state : existing.state,
      notes !== undefined ? notes : existing.notes,
      req.params.id
    );

    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    res.json(customer);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const salesCount = db.prepare('SELECT COUNT(*) as count FROM sales WHERE customer_id = ?').get(req.params.id);
    if (salesCount.count > 0) {
      return res.status(409).json({ error: 'Não é possível excluir cliente com vendas registradas. Considere desativá-lo.' });
    }

    db.prepare('DELETE FROM maintenance_reminders WHERE customer_id = ?').run(req.params.id);
    db.prepare('DELETE FROM customer_vehicles WHERE customer_id = ?').run(req.params.id);
    db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);

    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir cliente:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/customers/:id/vehicles - Add vehicle to customer
router.post('/:id/vehicles', authenticate, (req, res) => {
  try {
    const customer = db.prepare('SELECT id FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const { brand, model, year, plate, color, engine_cc, notes } = req.body;

    if (!brand || !model) {
      return res.status(400).json({ error: 'Marca e modelo são obrigatórios' });
    }

    const result = db.prepare(`
      INSERT INTO customer_vehicles (customer_id, brand, model, year, plate, color, engine_cc, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.params.id, brand, model, year || null, plate || null, color || null, engine_cc || null, notes || null);

    const vehicle = db.prepare('SELECT * FROM customer_vehicles WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Erro ao adicionar veículo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/customers/vehicles/:id - Update vehicle
router.put('/vehicles/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM customer_vehicles WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const { brand, model, year, plate, color, engine_cc, notes } = req.body;

    db.prepare(`
      UPDATE customer_vehicles SET
        brand = COALESCE(?, brand),
        model = COALESCE(?, model),
        year = ?,
        plate = ?,
        color = ?,
        engine_cc = ?,
        notes = ?
      WHERE id = ?
    `).run(
      brand || existing.brand,
      model || existing.model,
      year !== undefined ? year : existing.year,
      plate !== undefined ? plate : existing.plate,
      color !== undefined ? color : existing.color,
      engine_cc !== undefined ? engine_cc : existing.engine_cc,
      notes !== undefined ? notes : existing.notes,
      req.params.id
    );

    const vehicle = db.prepare('SELECT * FROM customer_vehicles WHERE id = ?').get(req.params.id);
    res.json(vehicle);
  } catch (err) {
    console.error('Erro ao atualizar veículo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/customers/vehicles/:id - Delete vehicle
router.delete('/vehicles/:id', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM customer_vehicles WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    db.prepare('DELETE FROM maintenance_reminders WHERE vehicle_id = ?').run(req.params.id);
    db.prepare('DELETE FROM customer_vehicles WHERE id = ?').run(req.params.id);

    res.json({ message: 'Veículo excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir veículo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/customers/:id/history - Purchase history
router.get('/:id/history', authenticate, (req, res) => {
  try {
    const customer = db.prepare('SELECT id, name FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = db.prepare('SELECT COUNT(*) as total FROM sales WHERE customer_id = ?').get(req.params.id);

    const sales = db.prepare(`
      SELECT s.*, u.name as seller_name
      FROM sales s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.customer_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `).all(req.params.id, parseInt(limit), offset);

    for (const sale of sales) {
      sale.items = db.prepare(`
        SELECT si.*, p.name as product_name, p.sku
        FROM sale_items si
        JOIN products p ON p.id = si.product_id
        WHERE si.sale_id = ?
      `).all(sale.id);
    }

    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_purchases,
        COALESCE(SUM(total), 0) as total_spent,
        COALESCE(AVG(total), 0) as avg_ticket,
        MAX(created_at) as last_purchase
      FROM sales 
      WHERE customer_id = ? AND status = 'concluida'
    `).get(req.params.id);

    res.json({
      customer,
      sales,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
