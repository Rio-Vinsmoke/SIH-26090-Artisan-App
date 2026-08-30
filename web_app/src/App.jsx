import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddProductPage } from "./pages/AddProductPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { MarketLinkagePage } from "./pages/MarketLinkagePage";
import { HelpPage } from "./pages/HelpPage";
import { PublicProductShowcasePage } from "./pages/PublicProductShowcasePage";
import { SplashScreen } from "./components/common/SplashScreen";
import "./App.css";

const MainContentRouter = () => {
  const { currentScreen, isAuthenticated } = useApp();
  const [publicItemId, setPublicItemId] = useState(null);

  useEffect(() => {
    // Check if the current URL path or search query is a public QR scan link
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (pathname.startsWith("/item/")) {
      const id = pathname.replace("/item/", "").split("/")[0];
      if (id) setPublicItemId(id);
    } else if (searchParams.get("item")) {
      setPublicItemId(searchParams.get("item"));
    } else if (searchParams.get("view") === "item" && searchParams.get("id")) {
      setPublicItemId(searchParams.get("id"));
    }
  }, []);

  // If viewing a public QR showcase link, render showcase directly without authentication requirement
  if (publicItemId) {
    return (
      <PublicProductShowcasePage
        productId={publicItemId}
        onBackToApp={() => {
          window.history.pushState({}, "", "/");
          setPublicItemId(null);
        }}
      />
    );
  }

  // If user is not authenticated or explicitly on login screen, show LoginPage
  if (!isAuthenticated || currentScreen === "login") {
    return <LoginPage />;
  }

  return (
    <div className="app-root">
      <Header />
      <div className="app-main-layout">
        <Sidebar />
        <main className="app-content-area">
          {currentScreen === "dashboard" && <DashboardPage />}
          {currentScreen === "add_product" && <AddProductPage />}
          {currentScreen === "catalog" && <CatalogPage />}
          {currentScreen === "product_details" && <ProductDetailsPage />}
          {currentScreen === "market_linkage" && <MarketLinkagePage />}
          {currentScreen === "help" && <HelpPage />}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="app-toast">{toast}</div>;
};

export function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem("hasSeenSplash");
    } catch {
      return false;
    }
  });

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem("hasSeenSplash", "true");
    } catch {
      // ignore storage error if cookies disabled
    }
    setShowSplash(false);
  };

  return (
    <AppProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={3000} />}
      <MainContentRouter />
      <ToastNotification />
    </AppProvider>
  );
}

export default App;
