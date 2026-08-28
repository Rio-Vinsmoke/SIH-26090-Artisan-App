import { useApp } from "../../context/AppContext";
import {
  HomeIcon,
  PlusCircleIcon,
  GridIcon,
  TrendingUpIcon,
  HelpCircleIcon
} from "../common/Icons";

export const MobileBottomNav = () => {
  const { currentScreen, navigateTo, t } = useApp();

  const navItems = [
    {
      id: "dashboard",
      label: t.dashboard,
      icon: <HomeIcon size={22} />
    },
    {
      id: "catalog",
      label: t.myCatalog,
      icon: <GridIcon size={22} />
    },
    {
      id: "add_product",
      label: "Add",
      icon: <PlusCircleIcon size={26} />,
      isCenterAction: true
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

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const isActive =
          currentScreen === item.id ||
          (item.id === "catalog" && currentScreen === "product_details");

        if (item.isCenterAction) {
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav__center-btn ${isActive ? "mobile-nav__center-btn--active" : ""}`}
              onClick={() => navigateTo(item.id)}
              aria-label="Add New Creation"
            >
              <div className="center-btn-circle">
                {item.icon}
              </div>
              <span className="center-btn-label">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav__item ${isActive ? "mobile-nav__item--active" : ""}`}
            onClick={() => navigateTo(item.id)}
            aria-label={item.label}
          >
            <span className="mobile-nav__icon">{item.icon}</span>
            <span className="mobile-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
