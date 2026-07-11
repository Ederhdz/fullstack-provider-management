import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type DashboardLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
          <div className="header-actions">
            <button className="secondary" type="button" onClick={toggleTheme}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="secondary" type="button" onClick={logout}>
              Salir
            </button>
          </div>
        </header>

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
