import { useApp } from "../../context/AppContext";
import {
  HomeIcon,
  PlusCircleIcon,
  GridIcon,
  TrendingUpIcon,
  HelpCircleIcon,
  ShieldCheckIcon
} from "../common/Icons";

export const Sidebar = () => {
  const { currentScreen, navigateTo, t, products } = useApp();

  const navItems = [
    {
      id: "dashboard",
      label: t.dashboard,
      labelHindi: "डैशबोर्ड",
      icon: <HomeIcon size={22} />
    },
    {
      id: "add_product",
      label: t.addProduct,
      labelHindi: "नया उत्पाद",
      icon: <PlusCircleIcon size={22} />,
      highlight: true
    },
    {
      id: "catalog",
      label: t.myCatalog,
      labelHindi: "मेरा कैटलॉग",
      icon: <GridIcon size={22} />,
      count: products.length
    },
    {
      id: "market_linkage",
      label: t.marketLinkage,
      labelHindi: "बाज़ार लिंकेज",
      icon: <TrendingUpIcon size={22} />
    },
    {
      id: "help",
      label: t.help,
      labelHindi: "सहायता",
      icon: <HelpCircleIcon size={22} />
    }
  ];

  const readyCount = products.filter((p) => p.status === "Ready" || p.status === "Shared").length;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section-title">MAIN MENU</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.id === "catalog" && currentScreen === "product_details");
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
          <span className="sidebar-artisan-card__title">GI & ONDC Ready</span>
        </div>
        <p className="sidebar-artisan-card__desc">
          <strong>{readyCount} of {products.length}</strong> crafts ready for digital marketplace buyer orders.
        </p>
        <button
          type="button"
          className="sidebar-card-btn"
          onClick={() => navigateTo("market_linkage")}
        >
          View Channels &rarr;
        </button>
      </div>
    </aside>
  );
};

