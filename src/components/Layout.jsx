import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/vendas', icon: 'point_of_sale', label: 'Vendas (PDV)' },
    { path: '/estoque', icon: 'inventory_2', label: 'Estoque' },
    { path: '/clientes', icon: 'group', label: 'Clientes' },
    { path: '/relatorios', icon: 'analytics', label: 'Relatórios' },
  ];

  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden font-sans">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-container-lowest border-r border-outline-variant transform transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center text-primary font-extrabold text-xl tracking-tight">
            <span className="material-symbols-outlined mr-2 text-[28px] text-primary">motorcycle</span>
            <span>MotoPeças Pro</span>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col justify-between">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-full transition-all duration-200 font-semibold text-[15px] relative group ${
                      isActive 
                        ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full"></div>
                      )}
                      <span className={`material-symbols-outlined mr-3 text-[22px] transition-colors ${
                        isActive ? 'text-on-primary-fixed-variant' : 'text-outline group-hover:text-on-surface'
                      }`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom Actions */}
          <div className="px-4">
            <div className="border-t border-outline-variant my-4"></div>
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 font-semibold text-[15px] group">
                  <span className="material-symbols-outlined mr-3 text-[22px] text-outline group-hover:text-on-surface">help</span>
                  <span>Ajuda</span>
                </button>
              </li>
              <li>
                <NavLink
                  to="/configuracoes"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-full transition-all duration-200 font-semibold text-[15px] group ${
                      isActive 
                        ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="material-symbols-outlined mr-3 text-[22px] text-outline group-hover:text-on-surface">settings</span>
                  <span>Configurações</span>
                </NavLink>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center px-4 py-3 rounded-full text-error hover:bg-red-50 hover:text-on-error-container transition-all duration-200 font-semibold text-[15px] group"
                >
                  <span className="material-symbols-outlined mr-3 text-[22px] text-error group-hover:text-on-error-container">logout</span>
                  <span>Sair</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface">
        {/* Header */}
        <header className="h-20 flex-shrink-0 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 z-30">
          <div className="flex items-center">
            <button
              className="p-2 mr-4 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface rounded-full lg:hidden transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <h2 className="text-xl font-extrabold text-on-surface hidden sm:block tracking-tight">MotoPeças Pro</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Buscar clientes, peças..." 
                className="pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all text-on-surface placeholder-outline font-medium"
              />
            </div>
            
            {/* Icons */}
            <div className="flex items-center space-x-3 text-on-surface-variant">
              <button className="p-2.5 hover:bg-surface-container-low hover:text-on-surface rounded-full transition-colors md:hidden">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
              <button className="p-2.5 hover:bg-surface-container-low hover:text-on-surface rounded-full transition-colors relative">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>

            <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>

            {/* Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{user?.name || 'Administrador'}</p>
                <p className="text-xs text-outline font-semibold capitalize">{user?.role === 'admin' ? 'Gerente' : 'Vendedor'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed border border-outline-variant shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-on-primary-fixed-variant">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="material-symbols-outlined text-outline text-[18px] hidden sm:block group-hover:text-on-surface transition-colors">keyboard_arrow_down</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <div className="max-w-7xl mx-auto h-full animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* FAB for Quick Scan (Mobile Intent) */}
        <button 
          onClick={() => setScanning(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 hover:bg-primary-dark shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[28px]">barcode_scanner</span>
        </button>
      </div>

      {/* Scanner Simulation Modal */}
      {scanning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 relative shadow-2xl border border-outline-variant flex flex-col items-center">
            <button 
              onClick={() => setScanning(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-fixed hover:text-primary transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            
            <div className="w-14 h-14 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[30px] animate-pulse">barcode_scanner</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-on-surface text-center mb-2">Simular Leitura</h3>
            <p className="text-xs text-on-surface-variant text-center mb-6 leading-relaxed">
              Posicione o código de barras da peça frente à câmera ou simule uma leitura automática.
            </p>
            
            {/* Animated Laser line scanner */}
            <div className="w-full h-44 bg-neutral-900 border border-outline-variant rounded-2xl relative overflow-hidden flex items-center justify-center mb-6">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-[scan_2s_ease-in-out_infinite]"></div>
              <span className="material-symbols-outlined text-[64px] text-white/10">qr_code_scanner</span>
            </div>
            
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={() => {
                  setScanning(false);
                  alert('Código de barras detectado: FIL-FRA-001 (Filtro de Óleo Fram)');
                }}
                className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all text-xs tracking-wider uppercase shadow-md"
              >
                Simular Leitura
              </button>
              <button 
                onClick={() => setScanning(false)}
                className="w-full py-3 border border-outline hover:bg-surface-container-low transition-all text-on-surface font-bold rounded-full text-xs tracking-wider uppercase"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
