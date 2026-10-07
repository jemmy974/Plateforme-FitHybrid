import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../admin/Sidebar.jsx';
import AdminHeader from '../../admin/AdminHeader.jsx';
import Footer from '../../admin/Footer.jsx';

const AdminLayouts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader sidebarCollapsed={sidebarCollapsed} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#D4AF37]/30">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayouts;