import React, { useState } from 'react';

const initialInventory = [
  { id: 1, sku: 'FIL-FRA-001', name: 'Filtro de Óleo Fram', category: 'Filtros', brand: 'Fram', price: 35.00, stock: 50, criticalMin: 15, motos: 'CG 160, CB 250F' },
  { id: 2, sku: 'FRE-COB-001', name: 'Pastilha de Freio Cobreq', category: 'Freios', brand: 'Cobreq', price: 55.00, stock: 3, criticalMin: 10, motos: 'CB 500, XRE 300' },
  { id: 3, sku: 'TRA-DID-001', name: 'Kit Relação DID com Retentor', category: 'Transmissão', brand: 'DID', price: 250.00, stock: 15, criticalMin: 5, motos: 'FZ25, MT-03' },
  { id: 4, sku: 'ELE-MOU-001', name: 'Bateria Moura 12V 5Ah', category: 'Elétrica', brand: 'Moura', price: 280.00, stock: 2, criticalMin: 6, motos: 'Universal' },
  { id: 5, sku: 'OLE-MOB-001', name: 'Óleo Mobil Super Moto 20W50', category: 'Lubrificantes', brand: 'Mobil', price: 30.00, stock: 145, criticalMin: 20, motos: 'Universal' },
  { id: 6, sku: 'VEL-NGK-001', name: 'Vela de Ignição Iridium NGK', category: 'Elétrica', brand: 'NGK', price: 75.00, stock: 40, criticalMin: 12, motos: 'Ninja 400, Z400' },
];

const Inventory = () => {
  const [items, setItems] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Filtros');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCritical, setNewCritical] = useState('');
  const [newMotos, setNewMotos] = useState('');

  const categories = ['Todos', 'Filtros', 'Freios', 'Transmissão', 'Elétrica', 'Lubrificantes'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.motos.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newName || !newSku || !newPrice || !newStock) return;

    const newItem = {
      id: items.length + 1,
      sku: newSku,
      name: newName,
      category: newCategory,
      brand: newBrand || 'Genérico',
      price: parseFloat(newPrice),
      stock: parseInt(newStock),
      criticalMin: parseInt(newCritical) || 5,
      motos: newMotos || 'Universal'
    };

    setItems([...items, newItem]);
    setShowAddForm(false);
    
    // Clear form
    setNewSku('');
    setNewName('');
    setNewBrand('');
    setNewPrice('');
    setNewStock('');
    setNewCritical('');
    setNewMotos('');
  };

  const deleteItem = (id) => {
    if (window.confirm('Deseja realmente remover esta peça do estoque?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Estoque de Peças</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-0.5">Gerencie o catálogo de produtos, níveis de estoque e SKUs.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Adicionar Peça
        </button>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total de Itens</p>
            <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">{items.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estoque Crítico</p>
            <h3 className="text-2xl font-black text-error mt-2 font-mono tracking-tight">
              {items.filter(item => item.stock <= item.criticalMin).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Valor em Estoque</p>
            <h3 className="text-2xl font-black text-emerald-800 mt-2 font-mono tracking-tight">
              R$ {items.reduce((acc, item) => acc + (item.price * item.stock), 0).toFixed(2).replace('.', ',')}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Buscar por nome da peça, SKU, marca ou moto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-outline font-medium text-sm transition-all"
            />
          </div>

          {/* Categories select chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm border border-primary/20' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory list table */}
        <div className="overflow-x-auto rounded-2xl border border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-wider border-b border-outline-variant">
                <th className="p-4 pl-6">SKU / Marca</th>
                <th className="p-4">Peça</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Compatibilidade</th>
                <th className="p-4 text-right">Preço</th>
                <th className="p-4 text-center">Estoque</th>
                <th className="p-4 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm font-semibold text-on-surface bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[48px] text-outline mb-2">inventory</span>
                    <p className="font-bold">Nenhuma peça encontrada</p>
                    <p className="text-xs text-on-surface-variant mt-1">Tente ajustar seus termos de busca ou filtros de categorias.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isCritical = item.stock <= item.criticalMin;
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-primary">{item.sku}</span>
                          <span className="text-xxs text-outline uppercase tracking-wider font-bold mt-0.5">{item.brand}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-on-surface text-[14px]">{item.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        <div className="flex items-center text-xs text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-[16px] mr-1 text-outline">motorcycle</span>
                          <span className="truncate">{item.motos}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-[14px]">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                            isCritical ? 'bg-red-100 text-error' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.stock} / {item.criticalMin}
                          </span>
                          {isCritical && (
                            <span className="text-[10px] text-error font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">warning</span> Crítico
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex justify-end items-center gap-2">
                          <button className="p-2 hover:bg-primary-fixed hover:text-primary rounded-xl text-outline transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2 hover:bg-red-50 hover:text-error rounded-xl text-outline transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Slide Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative shadow-2xl border border-outline-variant">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-fixed hover:text-primary transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-fixed text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <h3 className="text-xl font-extrabold text-on-surface">Adicionar Nova Peça</h3>
            </div>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Código SKU *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: VEL-NGK-002"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Marca *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: NGK"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Nome da Peça *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Vela de Ignição Especial"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Categoria</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                  >
                    <option value="Filtros">Filtros</option>
                    <option value="Freios">Freios</option>
                    <option value="Transmissão">Transmissão</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Lubrificantes">Lubrificantes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Preço Venda *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Estoque Atual *</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Limite Crítico</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 5"
                    value={newCritical}
                    onChange={(e) => setNewCritical(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Motos Compatíveis</label>
                  <input 
                    type="text" 
                    placeholder="Ex: CG 160, FZ25"
                    value={newMotos}
                    onChange={(e) => setNewMotos(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-outline hover:bg-surface-container-low transition-all text-on-surface font-bold rounded-full text-xs uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  Salvar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
