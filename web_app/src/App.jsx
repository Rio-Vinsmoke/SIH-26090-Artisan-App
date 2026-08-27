import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { WelcomePage } from "./pages/WelcomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddProductPage } from "./pages/AddProductPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { MarketLinkagePage } from "./pages/MarketLinkagePage";
import { HelpPage } from "./pages/HelpPage";
import "./App.css";

const MainContentRouter = () => {
  const { currentScreen, hasCompletedOnboarding } = useApp();

  // If artisan hasn't completed onboarding or screen is explicitly 'welcome'
  if (!hasCompletedOnboarding || currentScreen === "welcome") {
    return <WelcomePage />;
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
  return (
    <AppProvider>
      <MainContentRouter />
      <ToastNotification />
    </AppProvider>
  );
}

export default App;
