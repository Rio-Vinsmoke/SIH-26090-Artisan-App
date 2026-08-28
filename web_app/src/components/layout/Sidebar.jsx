import { useApp } from "../../context/AppContext";
import {
  HomeIcon,
  PlusCircleIcon,
  GridIcon,
  TrendingUpIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  LogOutIcon
} from "../common/Icons";

export const Sidebar = () => {
  const { currentScreen, navigateTo, t, products, logout } = useApp();

  const navItems = [
    {
      id: "dashboard",
      label: t.dashboard,
      icon: <HomeIcon size={22} />
    },
    {
      id: "catalog",
      label: t.myCatalog,
      icon: <GridIcon size={22} />,
      count: products.length
    },
    {
      id: "add_product",
      label: t.addProduct,
      icon: <PlusCircleIcon size={22} />,
      highlight: true
    },
    {
      id: "market_linkage",
      label: t.marketLinkage,
      icon: <TrendingUpIcon size={22} />
    },
    {
      id: "help",
      label: t.help,
      icon: <HelpCircleIcon size={22} />
    }
  ];

  const readyCount = products.filter((p) => p.status === "Ready" || p.status === "Shared").length;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section-title">MAIN MENU</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.id === "catalog" && currentScreen === "product_details");
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""} ${
                item.highlight ? "sidebar-nav__item--highlight" : ""
              }`}
              onClick={() => navigateTo(item.id)}
            >
              <span className="sidebar-nav__icon">{item.icon}</span>
              <div className="sidebar-nav__text-wrap">
                <span className="sidebar-nav__label">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className="sidebar-nav__badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Artisan Readiness Quick Card */}
      <div className="sidebar-artisan-card">
        <div className="sidebar-artisan-card__header">
          <ShieldCheckIcon size={20} className="shield-icon" />
          <span className="sidebar-artisan-card__title">ONDC & Market Ready</span>
        </div>
        <p className="sidebar-artisan-card__desc">
          <strong>{readyCount} of {products.length}</strong> creations verified for digital buyer orders.
        </p>
        <button
          type="button"
          className="sidebar-card-btn"
          onClick={() => navigateTo("market_linkage")}
        >
          View Channels &rarr;
        </button>
      </div>

      {/* Logout Action */}
      <div className="sidebar-logout-wrapper">
        <button
          type="button"
          className="sidebar-nav__item sidebar-nav__item--logout"
          onClick={logout}
        >
          <span className="sidebar-nav__icon"><LogOutIcon size={20} /></span>
          <span className="sidebar-nav__label">{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};
