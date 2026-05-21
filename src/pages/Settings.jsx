import React, { useState } from 'react';

const Settings = () => {
  const [storeName, setStoreName] = useState('MotoPeças Pro - Filial Centro');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [phone, setPhone] = useState('(11) 3333-4444');
  
  // Feature toggles
  const [realtimeSync, setRealtimeSync] = useState(true);
  const [aiForecast, setAiForecast] = useState(true);
  const [whatsappApi, setWhatsappApi] = useState(false);
  const [ruptureAlert, setRuptureAlert] = useState(true);

  // Terminals list
  const terminals = [
    { name: 'Terminal 01 - Caixa Principal', status: 'Online', ip: '192.168.1.100', user: 'Ana Beatriz' },
    { name: 'Terminal 02 - Balcão Peças', status: 'Online', ip: '192.168.1.101', user: 'Ricardo Almeida' },
    { name: 'Terminal 03 - Gerência (Você)', status: 'Online', ip: '192.168.1.102', user: 'John Doe' },
    { name: 'Terminal 04 - Scanner Móvel', status: 'Online', ip: '192.168.1.105', user: 'Dispositivo Portátil' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans animate-fade-in">
      
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Configurações do Sistema</h2>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">Gerencie os dados da loja, integrações tecnológicas e controle de terminais ativos.</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Store settings (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Profile Settings */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">store</span>
              Dados Comerciais da Loja
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Nome Fantasia da Unidade *</label>
                  <input 
                    type="text" 
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full p-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">CNPJ Comercial *</label>
                  <input 
                    type="text" 
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full p-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Telefone de Atendimento</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface font-mono"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Integration options toggles */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">integration_instructions</span>
              Recursos de Integração & Inteligência Artificial
            </h3>
            
            <div className="space-y-6">
              
              {/* Toggle 1 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">sync</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Sincronização em tempo real</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Mantém o inventário sincronizado entre a Unidade Centro e o banco de dados principal de forma instantânea.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setRealtimeSync(!realtimeSync)}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0 flex items-center px-1 ${
                    realtimeSync ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start border border-outline'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md block"></span>
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Previsão de Demanda com Inteligência Artificial</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Aplica machine learning sobre o histórico de vendas para prever a necessidade de reposição e evitar falta de peças.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setAiForecast(!aiForecast)}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0 flex items-center px-1 ${
                    aiForecast ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start border border-outline'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md block"></span>
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Conector API do WhatsApp Business</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Permite enviar mensagens de CRM automáticas (lembrete de troca de óleo, revisão e promoções personalizadas).
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setWhatsappApi(!whatsappApi)}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0 flex items-center px-1 ${
                    whatsappApi ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start border border-outline'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md block"></span>
                </button>
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Alerta Automático de Ruptura</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Envia notificações na tela do gerente imediatamente quando um item do estoque atinge o limite crítico definido.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setRuptureAlert(!ruptureAlert)}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0 flex items-center px-1 ${
                    ruptureAlert ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start border border-outline'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md block"></span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Active terminals and connections */}
        <div className="space-y-6">
          
          {/* Terminals Connections card */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">devices</span>
              Terminais Conectados (4)
            </h3>
            
            <div className="space-y-4">
              {terminals.map((t, idx) => (
                <div key={idx} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-[22px]">laptop_mac</span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface leading-tight">{t.name}</h4>
                      <p className="text-[10px] text-outline font-mono mt-0.5">{t.ip} • {t.user}</p>
                    </div>
                  </div>
                  
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border border-outline text-primary hover:bg-primary-fixed hover:border-primary transition-all rounded-full text-xs font-bold uppercase tracking-wider">
              Gerenciar Terminais
            </button>
          </div>

          {/* Database Backup card */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">backup</span>
              Banco de Dados & Backup
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Backup local SQLite automatizado. Último backup gerado às <strong>02:00 do dia atual</strong>.
            </p>
            <button className="w-full mt-5 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Forçar Backup Completo
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;
