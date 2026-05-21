import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const monthlyFaturamento = [
  { month: 'Jan', faturamento: 95000, margem: 36 },
  { month: 'Fev', faturamento: 110000, margem: 37 },
  { month: 'Mar', faturamento: 105000, margem: 38 },
  { month: 'Abr', faturamento: 118000, margem: 37 },
  { month: 'Mai', faturamento: 124500, margem: 38 },
];

const bestSellers = [
  { rank: 1, name: 'Kit Relação DID com Retentor', sku: 'TRA-DID-001', category: 'Transmissão', sold: 48, revenue: 'R$ 12.000,00' },
  { rank: 2, name: 'Óleo Mobil Super Moto 20W50', sku: 'OLE-MOB-001', category: 'Lubrificantes', sold: 132, revenue: 'R$ 3.960,00' },
  { rank: 3, name: 'Pastilha de Freio Cobreq', sku: 'FRE-COB-001', category: 'Freios', sold: 68, revenue: 'R$ 3.740,00' },
  { rank: 4, name: 'Bateria Moura 12V 5Ah', sku: 'ELE-MOU-001', category: 'Elétrica', sold: 12, revenue: 'R$ 3.360,00' },
  { rank: 5, name: 'Vela de Ignição Iridium NGK', sku: 'VEL-NGK-001', category: 'Elétrica', sold: 28, revenue: 'R$ 2.100,00' },
];

const sellersPerformance = [
  { name: 'John Doe (Você)', role: 'Gerente', sales: 180, total: 'R$ 48.500,00' },
  { name: 'Ricardo Almeida', role: 'Vendedor', sales: 142, total: 'R$ 36.200,00' },
  { name: 'Ana Beatriz', role: 'Vendedora', sales: 128, total: 'R$ 31.800,00' },
];

const Reports = () => {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 font-sans animate-fade-in">
      
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Relatórios & Analíticos</h2>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">Acompanhe métricas financeiras, performance da equipe e produtos mais vendidos.</p>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Faturamento Mensal</p>
              <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">R$ 124.500,00</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-800">
            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
            <span>+8,5%</span>
            <span className="text-on-surface-variant font-medium ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Margem Média</p>
              <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">38,2%</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">percent</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-800">
            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
            <span>+1,2%</span>
            <span className="text-on-surface-variant font-medium ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Vendas Concluídas</p>
              <h3 className="text-2xl font-black text-on-surface mt-2 font-mono tracking-tight">450</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-800">
            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
            <span>+4,0%</span>
            <span className="text-on-surface-variant font-medium ml-2">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Gross revenue Area chart */}
        <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">stacked_line_chart</span>
            Crescimento do Faturamento
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFaturamento} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                <defs>
                  <linearGradient id="faturGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6750A4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6750A4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3edf7" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#79747e" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#79747e" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `R$ ${val/1000}k`}
                  tick={{ fontSize: 12, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                  dx={-10} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#c4c7c7', 
                    borderRadius: '1rem', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    fontFamily: "Hanken Grotesk"
                  }}
                  itemStyle={{ color: '#6750A4', fontWeight: 'bold' }}
                  formatter={(val) => [`R$ ${val.toLocaleString('pt-BR')},00`, 'Faturamento']}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#6750A4" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#faturGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Margin bar chart */}
        <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">percent</span>
            Evolução da Margem Média
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFaturamento} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3edf7" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#79747e" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#79747e" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 12, fontFamily: "Hanken Grotesk", fontWeight: 600 }} 
                  dx={-10} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#c4c7c7', 
                    borderRadius: '1rem', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    fontFamily: "Hanken Grotesk"
                  }}
                  itemStyle={{ color: '#6750A4', fontWeight: 'bold' }}
                  formatter={(val) => [`${val}%`, 'Margem Média']}
                />
                <Bar dataKey="margem" fill="#d2bbff" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid: Best sellers and team performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Best sellers (span 2) */}
        <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
            Produtos Mais Vendidos
          </h3>
          
          <div className="overflow-x-auto rounded-2xl border border-outline-variant">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-wider border-b border-outline-variant">
                  <th className="p-4 pl-6 text-center w-12">Pos</th>
                  <th className="p-4">Peça</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4 text-center">Itens</th>
                  <th className="p-4 text-right pr-6">Bruto Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm font-semibold text-on-surface bg-white">
                {bestSellers.map(p => (
                  <tr key={p.rank} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 pl-6 text-center font-bold">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        p.rank === 1 ? 'bg-amber-100 text-amber-800' :
                        p.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        p.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-surface-container text-outline'
                      }`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{p.name}</span>
                        <span className="text-[10px] text-outline font-mono mt-0.5">{p.sku}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold">{p.sold}</td>
                    <td className="p-4 text-right pr-6 font-mono font-black text-primary">{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salespeople performance */}
        <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              Performance da Equipe
            </h3>
            
            <div className="space-y-4">
              {sellersPerformance.map((seller, index) => (
                <div key={index} className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-black text-xs">
                      {seller.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface leading-tight">{seller.name}</h4>
                      <p className="text-[10px] text-outline uppercase font-bold tracking-wider mt-0.5">{seller.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-on-surface font-mono">{seller.total}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold font-mono">{seller.sales} vendas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 border border-outline text-primary hover:bg-primary-fixed hover:border-primary transition-all rounded-full text-xs font-bold uppercase tracking-wider">
            Exportar CSV Geral
          </button>
        </div>

      </div>

    </div>
  );
};

export default Reports;
