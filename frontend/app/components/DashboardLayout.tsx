import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";

type DashboardLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Provider Management</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/providers">Providers</NavLink>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{title}</h1>
            <p>
              {user?.name} - {user?.role}
            </p>
          </div>
          <button className="secondary" type="button" onClick={logout}>
            Salir
          </button>
        </header>

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
