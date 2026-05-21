import React, { useState } from 'react';

const mockProducts = [
  { id: 1, sku: 'FIL-FRA-001', name: 'Filtro de Óleo Fram', category: 'Filtros', brand: 'Fram', price: 35.00, stock: 50, motos: 'CG 160, CB 250F' },
  { id: 2, sku: 'FRE-COB-001', name: 'Pastilha de Freio Cobreq', category: 'Freios', brand: 'Cobreq', price: 55.00, stock: 30, motos: 'CB 500, XRE 300' },
  { id: 3, sku: 'TRA-DID-001', name: 'Kit Relação DID com Retentor', category: 'Transmissão', brand: 'DID', price: 250.00, stock: 15, motos: 'FZ25, MT-03' },
  { id: 4, sku: 'ELE-MOU-001', name: 'Bateria Moura 12V 5Ah', category: 'Elétrica', brand: 'Moura', price: 280.00, stock: 20, motos: 'Universal' },
  { id: 5, sku: 'OLE-MOB-001', name: 'Óleo Mobil Super Moto 20W50', category: 'Lubrificantes', brand: 'Mobil', price: 30.00, stock: 145, motos: 'Universal' },
  { id: 6, sku: 'VEL-NGK-001', name: 'Vela de Ignição Iridium NGK', category: 'Elétrica', brand: 'NGK', price: 75.00, stock: 40, motos: 'Ninja 400, Z400' },
];

const mockCustomers = [
  { id: 1, name: 'Carlos Silva', phone: '(11) 97777-1111' },
  { id: 2, name: 'Maria Oliveira', phone: '(11) 97777-2222' },
  { id: 3, name: 'Pedro Santos', phone: '(11) 97777-3333' },
];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [discount, setDiscount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.motos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQtd = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQtd };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const finishSale = () => {
    if (cart.length === 0) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setCart([]);
      setSearchTerm('');
      setDiscount(0);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-outline-variant animate-fade-in max-w-[1400px] mx-auto p-8">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-md">
          <span className="material-symbols-outlined text-[48px] text-emerald-600">check_circle</span>
        </div>
        <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Venda Finalizada!</h2>
        <p className="text-on-surface-variant font-medium text-lg text-center max-w-sm">
          A transação foi registrada e o comprovante fiscal foi gerado com sucesso.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto pb-4 font-sans">
      
      {/* Left side: Products catalog */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        
        {/* Search header area */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Buscar por nome de peça, SKU ou compatibilidade de moto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-outline shadow-inner font-medium text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto bg-surface-container-high px-4 py-2.5 rounded-2xl border border-outline-variant text-xs font-bold text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">inventory</span>
            <span>Catálogo Ativo</span>
          </div>
        </div>
        
        {/* Products Grid list */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface/10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white border border-outline-variant rounded-2xl p-5 hover:border-primary hover:shadow-md cursor-pointer transition-all duration-300 group flex flex-col justify-between h-64"
                onClick={() => addToCart(product)}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-lg uppercase tracking-wider font-mono">{product.sku}</span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">Qtd: {product.stock}</span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors text-base line-clamp-2 leading-snug">{product.name}</h3>
                  
                  <div className="flex items-center text-xs text-on-surface-variant mt-2 font-medium">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-outline">motorcycle</span>
                    <span className="truncate">{product.motos}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                  <div className="flex flex-col">
                    <span className="text-xxs font-bold text-outline uppercase tracking-wider">Preço</span>
                    <span className="text-xl font-black text-on-surface font-mono">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Shopping Cart & Checkout panel */}
      <div className="w-full lg:w-[420px] flex flex-col bg-white rounded-3xl shadow-sm border border-outline-variant overflow-hidden flex-shrink-0">
        
        {/* Cart header */}
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <h2 className="text-lg font-extrabold text-on-surface flex items-center tracking-tight">
            <span className="material-symbols-outlined mr-2.5 text-primary text-[24px]">shopping_cart</span>
            Carrinho
          </h2>
          <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} itens
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-outline py-20">
              <div className="w-20 h-20 bg-surface-container-low rounded-2xl flex items-center justify-center mb-4 border border-outline-variant">
                <span className="material-symbols-outlined text-[36px] text-outline">shopping_basket</span>
              </div>
              <p className="font-bold text-sm">O carrinho está vazio</p>
              <p className="text-xs text-on-surface-variant mt-1 text-center max-w-[200px]">Selecione produtos no catálogo ao lado para começar.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-bold text-sm text-on-surface truncate leading-tight">{item.name}</h4>
                  <div className="text-primary font-black mt-1.5 text-sm font-mono">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-surface-container-low rounded-xl border border-outline-variant shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-l-xl transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="w-8 text-center text-xs font-black text-on-surface font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-r-xl transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-2 text-error hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Billing details panel */}
        <div className="p-6 border-t border-outline-variant bg-surface-container-low space-y-5">
          <div className="space-y-4">
            
            {/* Customer select */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Cliente (Opcional)</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-outline-variant text-on-surface text-sm font-semibold rounded-xl focus:ring-primary focus:border-primary block p-3 pr-10 shadow-sm transition-shadow appearance-none"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Consumidor Final</option>
                  {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-outline pointer-events-none">unfold_more</span>
              </div>
            </div>

            {/* Payment method & Discount */}
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Pagamento</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white border border-outline-variant text-on-surface text-sm font-semibold rounded-xl focus:ring-primary focus:border-primary block p-3 pr-10 shadow-sm transition-shadow appearance-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="pix">PIX</option>
                    <option value="cc">Cartão Crédito</option>
                    <option value="cd">Cartão Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-outline pointer-events-none">unfold_more</span>
                </div>
              </div>
              <div className="w-1/3">
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Desconto (R$)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="0,00"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-outline-variant text-on-surface text-sm font-semibold rounded-xl focus:ring-primary focus:border-primary block p-3 shadow-sm transition-shadow font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="pt-4 border-t border-outline-variant space-y-2.5">
            <div className="flex justify-between text-sm text-on-surface-variant font-semibold">
              <span>Subtotal</span>
              <span className="font-mono">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-error font-extrabold">
                <span>Desconto</span>
                <span className="font-mono">- R$ {discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between items-end pt-2">
              <span className="text-on-surface font-extrabold text-[15px]">Total Geral</span>
              <span className="text-3xl font-black text-primary font-mono tracking-tight">R$ {Math.max(0, total).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button 
            onClick={finishSale}
            disabled={cart.length === 0}
            className="w-full mt-2 bg-primary hover:bg-primary-dark text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 hover:shadow-lg active:scale-98 text-sm tracking-wider uppercase"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">check_circle</span>
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
