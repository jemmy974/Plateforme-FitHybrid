import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../../superadmin/SuperAdminSidebar.jsx';
import SuperAdminHeader from '../../superadmin/SuperAdminHeader.jsx';

const SuperAdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden">
      <SuperAdminSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
