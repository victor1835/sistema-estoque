import bcrypt from 'bcryptjs';
import db from './db.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Users
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (usersCount === 0) {
      console.log('Seeding users...');
      const insertUser = db.prepare('INSERT INTO users (name, email, password, role, phone, active) VALUES (?, ?, ?, ?, ?, ?)');
      const adminHash = bcrypt.hashSync('admin123', 10);
      const sellerHash = bcrypt.hashSync('vendedor123', 10);
      
      insertUser.run('Admin', 'admin@motopecas.com', adminHash, 'admin', '(11) 99999-9999', 1);
      insertUser.run('João Vendedor', 'joao@motopecas.com', sellerHash, 'vendedor', '(11) 98888-8888', 1);
    }

    // Categories
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    if (categoriesCount === 0) {
      console.log('Seeding categories...');
      const insertCategory = db.prepare('INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)');
      const categories = [
        ['Filtros', 'Filtros de óleo, ar e combustível', 'filter'],
        ['Freios', 'Pastilhas, discos e fluidos', 'disc'],
        ['Transmissão', 'Kits relação, correntes, coroas', 'settings'],
        ['Elétrica', 'Baterias, lâmpadas, velas', 'zap'],
        ['Motor', 'Pistões, anéis, juntas', 'tool'],
        ['Suspensão', 'Retentores, molas, óleo', 'activity'],
        ['Escapamento', 'Ponteiras e curvas', 'wind'],
        ['Acessórios', 'Capacetes, luvas, baús', 'package']
      ];
      
      categories.forEach(c => insertCategory.run(c[0], c[1], c[2]));
    }

    // Customers
    const customersCount = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
    if (customersCount === 0) {
      console.log('Seeding customers...');
      const insertCustomer = db.prepare('INSERT INTO customers (name, email, phone, whatsapp, cpf, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      const customers = [
        ['Carlos Silva', 'carlos@email.com', '(11) 97777-1111', '(11) 97777-1111', '111.111.111-11', 'Rua A, 123', 'São Paulo', 'SP'],
        ['Maria Oliveira', 'maria@email.com', '(11) 97777-2222', '(11) 97777-2222', '222.222.222-22', 'Av B, 456', 'Osasco', 'SP'],
        ['Pedro Santos', 'pedro@email.com', '(11) 97777-3333', '(11) 97777-3333', '333.333.333-33', 'Rua C, 789', 'Guarulhos', 'SP']
      ];
      customers.forEach(c => insertCustomer.run(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]));
    }

    // Products
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    if (productsCount === 0) {
      console.log('Seeding products...');
      const insertProduct = db.prepare('INSERT INTO products (sku, name, description, category_id, brand, cost_price, sale_price, quantity, min_stock, max_stock, location, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      const products = [
        ['FIL-FRA-001', 'Filtro de Óleo Fram', 'Filtro de óleo padrão', 1, 'Fram', 15.00, 35.00, 50, 10, 100, 'A1', 1],
        ['FRE-COB-001', 'Pastilha de Freio Cobreq', 'Pastilha dianteira', 2, 'Cobreq', 25.00, 55.00, 30, 5, 50, 'B1', 1],
        ['TRA-DID-001', 'Kit Relação DID', 'Kit corrente, coroa e pinhão', 3, 'DID', 120.00, 250.00, 15, 3, 30, 'C1', 1],
        ['ELE-MOU-001', 'Bateria Moura', 'Bateria 12V 5Ah', 4, 'Moura', 150.00, 280.00, 20, 5, 40, 'D1', 1],
        ['MOT-ATH-001', 'Kit Pistão Athena', 'Kit pistão com anéis', 5, 'Athena', 180.00, 350.00, 10, 2, 20, 'E1', 1]
      ];
      products.forEach(p => insertProduct.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11]));
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
