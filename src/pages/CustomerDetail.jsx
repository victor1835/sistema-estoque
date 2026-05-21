import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const mockCustomers = [
  { id: 1, name: 'Carlos Silva', phone: '(11) 97777-1111', email: 'carlos.silva@gmail.com', bikeModel: 'Honda CG 160 Titan', bikeYear: '2022', plate: 'XYZ-9876', lastVisit: '15/05/2026', totalSpent: 'R$ 450,00' },
  { id: 2, name: 'Maria Oliveira', phone: '(11) 97777-2222', email: 'maria.oliveira@outlook.com', bikeModel: 'Yamaha Fazer FZ25', bikeYear: '2023', plate: 'ABC-1234', lastVisit: '20/05/2026', totalSpent: 'R$ 1.280,00' },
  { id: 3, name: 'Pedro Santos', phone: '(11) 97777-3333', email: 'pedro.santos@yahoo.com.br', bikeModel: 'Honda XRE 300', bikeYear: '2021', plate: 'KJH-4567', lastVisit: '10/05/2026', totalSpent: 'R$ 380,00' },
  { id: 4, name: 'Juliana Costa', phone: '(21) 98888-4444', email: 'juliana.costa@gmail.com', bikeModel: 'Scooter Honda Biz 125', bikeYear: '2024', plate: 'MNO-5555', lastVisit: '22/05/2026', totalSpent: 'R$ 180,00' },
  { id: 5, name: 'Marcos Souza', phone: '(31) 99999-5555', email: 'marcos.souza@hotmail.com', bikeModel: 'Suzuki V-Strom 650', bikeYear: '2020', plate: 'PQR-8899', lastVisit: '02/05/2026', totalSpent: 'R$ 2.450,00' },
];

const mockOrders = [
  { id: 101, customerId: 1, date: '15/05/2026', items: 'Filtro de Óleo Fram x2, Óleo Mobil x2', total: 'R$ 130,00', payment: 'PIX' },
  { id: 102, customerId: 1, date: '10/04/2026', items: 'Kit Relação DID x1', total: 'R$ 320,00', payment: 'Cartão de Crédito' },
  { id: 103, customerId: 2, date: '20/05/2026', items: 'Bateria Moura 12V x1, Pastilha Cobreq x2', total: 'R$ 390,00', payment: 'Dinheiro' },
  { id: 104, customerId: 2, date: '18/02/2026', items: 'Pneu Dianteiro Pirelli x1, Óleo Mobil x3', total: 'R$ 890,00', payment: 'Cartão de Crédito' },
  { id: 105, customerId: 3, date: '10/05/2026', items: 'Kit Relação DID x1, Vela Iridium x1', total: 'R$ 380,00', payment: 'PIX' },
];

const CustomerDetail = () => {
  const { id } = useParams();
  const customer = mockCustomers.find(c => c.id === parseInt(id)) || mockCustomers[0];
  const [notes, setNotes] = useState([
    'Cliente prefere pastilhas de freio Cobreq macias.',
    'Sempre realiza troca de óleo a cada 1.500km rodados.'
  ]);
  const [newNote, setNewNote] = useState('');

  const customerOrders = mockOrders.filter(o => o.customerId === customer.id);
  const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote) return;
    setNotes([...notes, newNote]);
    setNewNote('');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans">
      
      {/* Back button and page title */}
      <div className="flex items-center gap-3">
        <Link 
          to="/clientes" 
          className="w-10 h-10 rounded-full bg-white hover:bg-surface-container border border-outline-variant transition-all flex items-center justify-center text-on-surface shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Ficha do Cliente</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">Histórico completo, motocicletas associadas e anotações internas.</p>
        </div>
      </div>

      {/* Main Grid: Info card and purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General Profile Info */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
            
            <div className="w-20 h-20 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-extrabold text-2xl border border-primary/20 shadow-inner mt-4 mb-4">
              {initials}
            </div>
            
            <h3 className="text-xl font-extrabold text-on-surface leading-tight">{customer.name}</h3>
            <p className="text-xs text-outline font-semibold uppercase tracking-wider mt-1">Cliente Ativo</p>
            
            <div className="border-t border-outline-variant w-full my-6"></div>
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">phone</span>
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">Telefone</p>
                  <p className="text-sm font-bold text-on-surface font-mono">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">E-mail</p>
                  <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">calendar_today</span>
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">Última Visita</p>
                  <p className="text-sm font-bold text-on-surface">{customer.lastVisit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">payments</span>
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">Total Gasto</p>
                  <p className="text-sm font-extrabold text-emerald-800 font-mono">{customer.totalSpent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Motorcycle details */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">motorcycle</span>
              Motocicleta Associada
            </h3>
            
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
              <h4 className="font-extrabold text-on-surface text-base">{customer.bikeModel}</h4>
              
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-outline-variant/60">
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">Ano Modelo</p>
                  <p className="text-sm font-bold text-on-surface font-mono">{customer.bikeYear}</p>
                </div>
                <div>
                  <p className="text-xxs font-bold text-outline uppercase">Placa</p>
                  <p className="text-sm font-bold text-on-surface font-mono uppercase">{customer.plate}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Order history and internal notes (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order history */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Histórico de Vendas (PDV)
            </h3>
            
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="p-8 text-center text-outline border border-outline-variant border-dashed rounded-2xl">
                  <span className="material-symbols-outlined text-[36px] text-outline mb-2">shopping_bag</span>
                  <p className="font-bold">Nenhuma compra registrada</p>
                  <p className="text-xs text-on-surface-variant">Este cliente ainda não realizou transações no ponto de vendas.</p>
                </div>
              ) : (
                customerOrders.map(order => (
                  <div key={order.id} className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">Pedido #{order.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                        <span className="text-xs text-on-surface-variant font-bold">{order.date}</span>
                      </div>
                      <p className="text-sm text-on-surface font-bold mt-1">{order.items}</p>
                    </div>
                    <div className="flex flex-col sm:items-end justify-center self-start sm:self-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant w-full sm:w-auto">
                      <span className="text-lg font-black text-on-surface font-mono">{order.total}</span>
                      <span className="text-xxs font-bold text-outline uppercase mt-0.5">{order.payment}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Internal CRM notes */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sticky_note_2</span>
              Anotações Internas (CRM)
            </h3>
            
            <div className="space-y-3 mb-6">
              {notes.map((note, index) => (
                <div key={index} className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-start gap-3 shadow-inner">
                  <span className="material-symbols-outlined text-amber-500 mt-0.5">bookmark</span>
                  <p className="text-xs text-amber-950 font-semibold leading-relaxed">{note}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Escreva uma nova anotação interna sobre o cliente..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 p-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface"
              />
              <button 
                type="submit"
                className="px-5 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Adicionar
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomerDetail;
