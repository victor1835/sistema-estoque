import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialCustomers = [
  { id: 1, name: 'Carlos Silva', phone: '(11) 97777-1111', email: 'carlos.silva@gmail.com', bikeModel: 'Honda CG 160 Titan', bikeYear: '2022', plate: 'XYZ-9876', lastVisit: '15/05/2026', totalSpent: 'R$ 450,00' },
  { id: 2, name: 'Maria Oliveira', phone: '(11) 97777-2222', email: 'maria.oliveira@outlook.com', bikeModel: 'Yamaha Fazer FZ25', bikeYear: '2023', plate: 'ABC-1234', lastVisit: '20/05/2026', totalSpent: 'R$ 1.280,00' },
  { id: 3, name: 'Pedro Santos', phone: '(11) 97777-3333', email: 'pedro.santos@yahoo.com.br', bikeModel: 'Honda XRE 300', bikeYear: '2021', plate: 'KJH-4567', lastVisit: '10/05/2026', totalSpent: 'R$ 380,00' },
  { id: 4, name: 'Juliana Costa', phone: '(21) 98888-4444', email: 'juliana.costa@gmail.com', bikeModel: 'Scooter Honda Biz 125', bikeYear: '2024', plate: 'MNO-5555', lastVisit: '22/05/2026', totalSpent: 'R$ 180,00' },
  { id: 5, name: 'Marcos Souza', phone: '(31) 99999-5555', email: 'marcos.souza@hotmail.com', bikeModel: 'Suzuki V-Strom 650', bikeYear: '2020', plate: 'PQR-8899', lastVisit: '02/10/2025', totalSpent: 'R$ 2.450,00' },
];

const mockCrmPredictions = [
  {
    id: 1,
    customerName: 'Carlos Silva',
    phone: '(11) 97777-1111',
    bike: 'Honda CG 160 Titan',
    partName: 'Filtro de Óleo Fram',
    sku: 'FIL-FRA-001',
    category: 'Filtros',
    lastPurchaseDate: '15/12/2025',
    daysAgo: 158,
    intervalMonths: 6,
    status: 'vencido', // vencido, atencao, ok
    statusText: 'Vencido (Trocar Já!)',
    statusDesc: 'Ultrapassou 5 meses de uso recomendado.',
    whatsappMessage: 'Olá Carlos! Notamos que a última troca do Filtro de Óleo Fram da sua Honda CG 160 Titan foi realizada em 15/12/2025. Como o recomendado é a troca a cada 6 meses (ou 1.500km) para garantir a saúde do motor, o que acha de agendarmos uma rápida revisão na nossa oficina esta semana?'
  },
  {
    id: 2,
    customerName: 'Marcos Souza',
    phone: '(31) 99999-5555',
    bike: 'Suzuki V-Strom 650',
    partName: 'Pastilha de Freio Cobreq',
    sku: 'FRE-COB-001',
    category: 'Freios',
    lastPurchaseDate: '02/10/2025',
    daysAgo: 232,
    intervalMonths: 8,
    status: 'atencao',
    statusText: 'Atenção (Trocar em breve)',
    statusDesc: 'Falta menos de 10 dias para o prazo estimado.',
    whatsappMessage: 'Olá Marcos! A pastilha de freio Cobreq instalada na sua Suzuki V-Strom 650 está completando 8 meses de uso. Estimamos que a vida útil esteja próxima do limite seguro. Que tal passar aqui na filial para uma avaliação gratuita e preventiva do seu sistema de frenagem?'
  },
  {
    id: 3,
    customerName: 'Maria Oliveira',
    phone: '(11) 97777-2222',
    bike: 'Yamaha Fazer FZ25',
    partName: 'Bateria Moura 12V 5Ah',
    sku: 'ELE-MOU-001',
    category: 'Elétrica',
    lastPurchaseDate: '20/05/2025',
    daysAgo: 367,
    intervalMonths: 12,
    status: 'atencao',
    statusText: 'Atenção (Trocar em breve)',
    statusDesc: 'Chegando ao prazo de 1 ano recomendado para revisão.',
    whatsappMessage: 'Olá Maria! Tudo bem? Faz cerca de 1 ano que você instalou a Bateria Moura na sua Yamaha Fazer FZ25. Para evitar surpresas indesejáveis na hora da partida, recomendamos uma checagem rápida de carga e alternador na nossa loja. Podemos agendar para hoje?'
  },
  {
    id: 4,
    customerName: 'Pedro Santos',
    phone: '(11) 97777-3333',
    bike: 'Honda XRE 300',
    partName: 'Kit Relação DID com Retentor',
    sku: 'TRA-DID-001',
    category: 'Transmissão',
    lastPurchaseDate: '10/05/2026',
    daysAgo: 12,
    intervalMonths: 18,
    status: 'ok',
    statusText: 'Em Dia (Ok)',
    statusDesc: 'Peça instalada recentemente, em excelentes condições.',
    whatsappMessage: 'Olá Pedro! Apenas passando para saber se está tudo ok com o Kit Relação DID instalado recentemente na sua Honda XRE 300. Se precisar de uma lubrificação da corrente ou ajuste de folga gratuito, estamos sempre prontos para atendê-lo.'
  }
];

const Customers = () => {
  const [activeTab, setActiveTab] = useState('list'); // list, crm
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // WhatsApp Simulator Modal states
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBike, setNewBike] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newPlate, setNewPlate] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.bikeModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCrmAlerts = mockCrmPredictions.filter(a =>
    a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.bike.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCust = {
      id: customers.length + 1,
      name: newName,
      phone: newPhone,
      email: newEmail || 'N/A',
      bikeModel: newBike || 'Não Cadastrada',
      bikeYear: newYear || 'N/A',
      plate: newPlate || 'N/A',
      lastVisit: 'Hoje',
      totalSpent: 'R$ 0,00'
    };

    setCustomers([...customers, newCust]);
    setShowAddForm(false);

    // Clear form
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewBike('');
    setNewYear('');
    setNewPlate('');
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateWhatsappSend = (name) => {
    alert(`Enviando mensagem para ${name} via WhatsApp Web!`);
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">CRM - Clientes & Fidelização</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-0.5">Gerencie seus motociclistas, acompanhe prazos de desgaste de peças e envie alertas proativos.</p>
        </div>
        {activeTab === 'list' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Novo Cliente
          </button>
        )}
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-outline-variant gap-6">
        <button
          onClick={() => {
            setActiveTab('list');
            setSearchTerm('');
          }}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'list' 
              ? 'text-primary' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">groups</span>
          <span>Lista de Clientes</span>
          {activeTab === 'list' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fade-in"></div>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('crm');
            setSearchTerm('');
          }}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'crm' 
              ? 'text-primary' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">psychology</span>
          <span>CRM Inteligente (Previsões de Troca)</span>
          <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">2 Alertas</span>
          {activeTab === 'crm' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fade-in"></div>
          )}
        </button>
      </div>

      {/* Conditional Rendering Tab 1: List */}
      {activeTab === 'list' && (
        <>
          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Clientes Cadastrados</p>
                <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">{customers.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">group</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Visitas este mês</p>
                <h3 className="text-2xl font-black text-primary mt-2 font-mono tracking-tight">28</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">calendar_today</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ticket Médio CRM</p>
                <h3 className="text-2xl font-black text-emerald-800 mt-2 font-mono tracking-tight">R$ 948,00</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
            </div>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Buscar cliente por nome, telefone ou modelo da moto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-outline font-medium text-sm transition-all"
              />
            </div>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-12 border border-outline-variant text-center text-outline shadow-sm">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">person_off</span>
                <p className="font-bold">Nenhum cliente encontrado</p>
                <p className="text-xs text-on-surface-variant mt-1">Tente ajustar seus termos de busca.</p>
              </div>
            ) : (
              filteredCustomers.map(c => {
                const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <div 
                    key={c.id} 
                    className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-extrabold text-base border border-primary/20 shadow-inner">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-on-surface text-base leading-tight hover:text-primary transition-colors">
                            <Link to={`/clientes/${c.id}`}>{c.name}</Link>
                          </h4>
                          <p className="text-xs text-on-surface-variant font-semibold mt-1 font-mono">{c.phone}</p>
                        </div>
                      </div>

                      <div className="border-t border-outline-variant my-4"></div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-outline uppercase">Motocicleta</span>
                          <span className="text-on-surface font-bold truncate max-w-[150px]">{c.bikeModel}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-outline uppercase">Ano / Placa</span>
                          <span className="text-on-surface-variant font-mono">{c.bikeYear} • {c.plate}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-outline uppercase">Última Visita</span>
                          <span className="text-on-surface-variant">{c.lastVisit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedAlert({
                          customerName: c.name,
                          phone: c.phone,
                          whatsappMessage: `Olá ${c.name}! Tudo bem? Apenas passando para agradecer sua última visita no MotoPeças Pro com a sua ${c.bikeModel}. Se precisar de peças ou serviços, estamos com ofertas especiais esta semana!`,
                          partName: 'Revisão Geral',
                          statusText: 'Contato Manual'
                        })}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        WhatsApp
                      </button>
                      <Link 
                        to={`/clientes/${c.id}`} 
                        className="flex-1 py-3 border border-outline hover:bg-surface-container-low text-on-surface rounded-full text-xs font-bold uppercase tracking-wider text-center transition-all shadow-inner"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Conditional Rendering Tab 2: Intelligent CRM */}
      {activeTab === 'crm' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Explanation Banner */}
          <div className="bg-primary-fixed/30 border border-primary-fixed-dim/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[28px]">psychology</span>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-on-surface">Sugestões de Troca de Peças Inteligentes</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-4xl">
                  Esta inteligência estima o desgaste natural das peças compradas pelos clientes. Cruzando a <strong>peça comprada</strong>, o <strong>modelo da motocicleta</strong> e o <strong>intervalo de desgaste padrão</strong> da categoria, calculamos a data ideal de substituição preventiva. Envie lembretes imediatos e aumente a conversão da sua loja.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-outline-variant text-[11px] font-bold text-primary uppercase tracking-wider flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary absolute"></span>
              <span className="ml-1">IA Ativa</span>
            </div>
          </div>

          {/* CRM Search box */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Filtrar por nome de cliente, peça comprada ou motocicleta..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-outline font-medium text-sm transition-all"
              />
            </div>
          </div>

          {/* CRM Alerts Table */}
          <div className="overflow-x-auto rounded-3xl border border-outline-variant bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-wider border-b border-outline-variant">
                  <th className="p-4 pl-6">Cliente & Moto</th>
                  <th className="p-4">Peça Instalada</th>
                  <th className="p-4 text-center">Data Instalação</th>
                  <th className="p-4 text-center">Prazo Sugerido</th>
                  <th className="p-4">Status Sugestão</th>
                  <th className="p-4 text-right pr-6">Ação de CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm font-semibold text-on-surface bg-white">
                {filteredCrmAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-outline">
                      <span className="material-symbols-outlined text-[48px] text-outline mb-2">notifications_off</span>
                      <p className="font-bold">Nenhum alerta de CRM gerado</p>
                      <p className="text-xs text-on-surface-variant mt-1">Ajuste os filtros ou selecione outros critérios de busca.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCrmAlerts.map(alertItem => (
                    <tr key={alertItem.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{alertItem.customerName}</span>
                          <span className="text-xxs text-on-surface-variant font-semibold flex items-center gap-0.5 mt-0.5">
                            <span className="material-symbols-outlined text-[12px] text-outline">motorcycle</span>
                            {alertItem.bike}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{alertItem.partName}</span>
                          <span className="text-[10px] text-outline font-mono mt-0.5">{alertItem.sku} • {alertItem.category}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono">
                        <div className="flex flex-col">
                          <span className="font-bold">{alertItem.lastPurchaseDate}</span>
                          <span className="text-[10px] text-outline font-bold uppercase mt-0.5">Há {alertItem.daysAgo} dias</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-bold text-xs">
                          {alertItem.intervalMonths} meses
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                            alertItem.status === 'vencido' ? 'bg-red-100 text-error' :
                            alertItem.status === 'atencao' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {alertItem.statusText}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-medium mt-1 max-w-[200px] leading-tight block">
                            {alertItem.statusDesc}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => setSelectedAlert(alertItem)}
                          className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 w-full sm:w-auto shadow-sm active:scale-95 ${
                            alertItem.status === 'vencido' ? 'bg-error text-white hover:bg-red-700 shadow-red-200' :
                            alertItem.status === 'atencao' ? 'bg-primary text-white hover:bg-primary-dark' :
                            'bg-surface-container text-on-surface-variant border border-outline hover:bg-surface-container-high'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Lembrete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WhatsApp Message Simulator Modal Drawer */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative shadow-2xl border border-outline-variant">
            <button 
              onClick={() => setSelectedAlert(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-fixed hover:text-primary transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">Lembrete de Peças via WhatsApp</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Template automatizado de CRM com a sugestão inteligente.</p>
              </div>
            </div>

            {/* Simulated Smartphone Chat Screen */}
            <div className="bg-neutral-100 rounded-2xl border border-outline-variant overflow-hidden mb-6">
              
              {/* Smartphone Chat Header */}
              <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-black text-xs">
                    {selectedAlert.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{selectedAlert.customerName}</h4>
                    <p className="text-[9px] text-emerald-300 font-semibold font-mono">{selectedAlert.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </div>
              </div>

              {/* Smartphone Chat Area */}
              <div className="p-4 space-y-4 h-56 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-center">
                
                {/* Chat Bubble Info Alert */}
                <div className="p-2.5 mx-auto bg-yellow-100 border border-yellow-200 text-yellow-900 rounded-xl text-[10px] font-bold text-center max-w-[280px]">
                  🔒 Lembrete preventivo com sugestão inteligente de troca baseado na última compra ({selectedAlert.partName}).
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="p-4 bg-white border border-outline-variant shadow-sm rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-xs font-semibold text-neutral-800 relative">
                  <p className="leading-relaxed">{selectedAlert.whatsappMessage}</p>
                  <div className="text-right text-[9px] text-outline font-mono mt-2">22:06 ✓✓</div>
                  <div className="absolute right-0 top-0 transform translate-x-1.5 -translate-y-1.5 w-3 h-3 bg-white border-r border-t border-outline-variant rotate-45 hidden"></div>
                </div>

              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(selectedAlert.whatsappMessage)}
                  className="flex-1 py-3 border border-outline text-primary hover:bg-primary-fixed hover:border-primary transition-all font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                  {copied ? 'Copiado!' : 'Copiar Texto'}
                </button>
                <button
                  onClick={() => simulateWhatsappSend(selectedAlert.customerName)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  Abrir WhatsApp
                </button>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
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
                <span className="material-symbols-outlined text-[22px]">person_add</span>
              </div>
              <h3 className="text-xl font-extrabold text-on-surface">Cadastrar Novo Cliente</h3>
            </div>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Nome Completo *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Carlos Silva"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Telefone / WhatsApp *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: (11) 97777-1111"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">E-mail</label>
                <input 
                  type="email" 
                  placeholder="Ex: carlos.silva@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="border-t border-outline-variant my-4 pt-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-3">Dados da Motocicleta</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Modelo da Moto</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Honda CG 160 Fan"
                      value={newBike}
                      onChange={(e) => setNewBike(e.target.value)}
                      className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Ano</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 2022"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Placa da Moto</label>
                  <input 
                    type="text" 
                    placeholder="Ex: XYZ-1234"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold font-mono uppercase"
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
