import { NavLink } from 'react-router-dom';
import { CalendarDays, CreditCard, LayoutDashboard, Users, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/billing', label: 'Billing', icon: CreditCard }
];

function SidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
        <div>
          <h1 className="text-lg font-bold text-blue-700">HMS</h1>
          <p className="text-xs text-gray-500">Hospital System</p>
        </div>
        <button onClick={onClose} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-950/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-64">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
