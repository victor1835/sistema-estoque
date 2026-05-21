import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const stats = [
  { 
    title: "Vendas Hoje", 
    value: "R$ 4.250,00", 
    change: "+12%", 
    isUp: true, 
    icon: "trending_up", 
    color: "text-primary", 
    bg: "bg-primary-fixed" 
  },
  { 
    title: "Clientes Ativos", 
    value: "342", 
    change: "+5", 
    isUp: true, 
    icon: "group", 
    color: "text-primary", 
    bg: "bg-primary-fixed" 
  },
  { 
    title: "Estoque Crítico", 
    value: "12", 
    change: "-2", 
    isUp: true, 
    icon: "inventory_2", 
    color: "text-error", 
    bg: "bg-surface-container-high" 
  },
  { 
    title: "Ticket Médio", 
    value: "R$ 185,00", 
    change: "+3%", 
    isUp: true, 
    icon: "payments", 
    color: "text-primary", 
    bg: "bg-primary-fixed" 
  }
];

const salesData = [
  { name: 'Seg', vendas: 2400 },
  { name: 'Ter', vendas: 1398 },
  { name: 'Qua', vendas: 3800 },
  { name: 'Qui', vendas: 3908 },
  { name: 'Sex', vendas: 4800 },
  { name: 'Sáb', vendas: 3800 },
  { name: 'Dom', vendas: 1200 },
];

const Dashboard = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 shadow-lg relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-fixed-dim/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        <div className="flex items-center mb-6 md:mb-0 z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-md border border-white/20 shadow-inner">
            <span className="material-symbols-outlined text-[36px] text-white">sports_motorsports</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Bem-vindo ao MotoPeças Pro!</h2>
            <p className="text-primary-fixed/80 text-sm mt-1.5 font-medium max-w-xl">
              Seu centro integrado de operações está pronto. Controle estoque de peças, acompanhe suas metas e gerencie o CRM de clientes de forma inteligente.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
          <button 
            onClick={() => setShowTutorial(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3.5 bg-white/10 hover:bg-white/20 rounded-full text-[14px] font-bold tracking-wide transition-all border border-white/20 shadow-sm"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
            Ver Tutorial
          </button>
          <Link 
            to="/vendas" 
            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3.5 bg-white text-primary hover:bg-primary-fixed rounded-full text-[14px] font-bold tracking-wide transition-all shadow-md active:scale-95"
          >
            Realizar Venda 
            <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column (span 2 on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Bento Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Action 1 */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">Registrar Venda</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Abra o ponto de vendas para adicionar produtos, aplicar descontos e finalizar compras instantaneamente.
                </p>
              </div>
              <Link 
                to="/vendas" 
                className="mt-6 flex items-center justify-center w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all text-xs tracking-wider uppercase"
              >
                Nova Venda
                <span className="material-symbols-outlined ml-1.5 text-[18px]">add</span>
              </Link>
            </div>

            {/* Quick Action 2 */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">person_add</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">Novo Cliente</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Cadastre novos motociclistas, telefones e modelos de motos para estreitar o relacionamento e enviar promoções.
                </p>
              </div>
              <Link 
                to="/clientes" 
                className="mt-6 flex items-center justify-center w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all text-xs tracking-wider uppercase"
              >
                Cadastrar
                <span className="material-symbols-outlined ml-1.5 text-[18px]">person_add</span>
              </Link>
            </div>

            {/* Quick Action 3 */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">Verificar Estoque</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Acompanhe os níveis de peças, faça reposições, altere SKUs e configure o estoque crítico com IA.
                </p>
              </div>
              <Link 
                to="/estoque" 
                className="mt-6 flex items-center justify-center w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all text-xs tracking-wider uppercase"
              >
                Ver Estoque
                <span className="material-symbols-outlined ml-1.5 text-[18px]">chevron_right</span>
              </Link>
            </div>

          </div>

          {/* Chart area */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Faturamento Semanal</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Visão geral do faturamento bruto nos últimos 7 dias</p>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant text-[13px] font-bold text-primary">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>Esta Semana</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3edf7" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#79747e" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 13, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                    dy={12} 
                  />
                  <YAxis 
                    stroke="#79747e" 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `R$ ${value}`} 
                    tick={{ fontSize: 13, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                    dx={-10} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#c4c7c7', 
                      borderRadius: '1rem', 
                      color: '#1c1b1f', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      fontFamily: "Hanken Grotesk"
                    }}
                    itemStyle={{ color: '#6750A4', fontWeight: 'bold' }}
                    formatter={(value) => [`R$ ${value.toFixed(2).replace('.', ',')}`, 'Faturamento']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#6750A4" 
                    strokeWidth={4.5} 
                    dot={{ fill: '#6750A4', r: 5, strokeWidth: 0 }} 
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#5a00c6' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (span 1) */}
        <div className="space-y-6">
          
          {/* Warehouse Image Card (Unidade Centro em Operação) */}
          <div className="relative rounded-3xl h-64 overflow-hidden group shadow-sm border border-outline-variant">
            <img 
              alt="Warehouse Interior" 
              className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSUV2St5Ds38tUu8GZ0KPQxb7eeZgpjYRBPQ7PCiNGBcvAV08vlN7D6p6JS3EI0njRFwyJnF8UJ7aTAHNLL_K4INb6htiEU8OFZblLTqCecCigCJwcAm5Jp3EQeNya97_mFHbQ8cPa6wuHUWre3EZELl4J9mGDQEKLH3qTAiEa8dZP3vkOvjnnkc5hlV96hI0Nr4h-v2IFi9L3N_8ccfTAzZxOzKA4Hri89_z0XdrHujf3IX83yC1N_ICp13PkgysaSB5IRDtl4E0"
            />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute"></span>
              <span className="ml-1">Online</span>
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <h4 className="text-white text-xl font-extrabold tracking-tight">Unidade Centro em Operação</h4>
              <p className="text-white/80 text-sm mt-1.5 font-medium">Sincronização em tempo real ativa • 4 terminais conectados</p>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-fixed text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Insights IA</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">Previsões inteligentes do sistema</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors">
                  <div className="flex items-start">
                    <span className="material-symbols-outlined text-amber-500 mt-0.5 mr-3">lightbulb</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-on-surface">Previsão de Demanda</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Aumento previsto de <strong className="text-primary">15%</strong> nas vendas de kits relação DID na próxima semana devido ao feriado.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 hover:bg-red-50 transition-colors">
                  <div className="flex items-start">
                    <span className="material-symbols-outlined text-error mt-0.5 mr-3">warning</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-red-950">Alerta de Ruptura</h4>
                      <p className="text-xs text-red-900 mt-1 leading-relaxed">
                        Pastilhas de freio Cobreq esgotarão em <strong className="text-error font-bold">3 dias</strong> na taxa de venda atual. Recomendamos reabastecer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 border border-outline text-primary hover:bg-primary-fixed hover:border-primary transition-all rounded-full text-xs font-bold uppercase tracking-wider">
              Ver Todos Insights
            </button>
          </div>

        </div>

      </div>

      {/* Stats Cards (Now aligned inside Bento) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center text-xs">
              <span className={`font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 ${stat.isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                <span className="material-symbols-outlined text-[14px]">{stat.isUp ? 'trending_up' : 'trending_down'}</span>
                {stat.change}
              </span>
              <span className="text-on-surface-variant font-medium ml-2">vs. ontem</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tutorial Video Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl border border-outline-variant">
            <button 
              onClick={() => setShowTutorial(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-fixed hover:text-primary transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-fixed text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">sports_motorsports</span>
              </div>
              <h3 className="text-xl font-extrabold text-on-surface">Tutorial MotoPeças Pro</h3>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-outline-variant flex flex-col items-center justify-center text-white mb-6">
              <span className="material-symbols-outlined text-[72px] text-primary animate-pulse">play_circle</span>
              <p className="mt-4 font-bold text-lg text-white/90">Vídeo Demonstrativo do Sistema</p>
              <p className="text-xs text-white/60 mt-1 max-w-sm text-center">Neste vídeo você aprenderá a cadastrar peças, fazer vendas PDV rápidas e acompanhar insights de IA.</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowTutorial(false)}
                className="px-6 py-3 bg-primary text-white hover:bg-primary-dark rounded-full text-sm font-bold tracking-wide shadow-md transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
