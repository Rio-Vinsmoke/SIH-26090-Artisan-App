/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { authService, DEMO_ARTISAN } from "../services/authService";
import { productService } from "../services/productService";
import { translations } from "../data/translations";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  // Screen navigation state (defaults to 'dashboard' if logged in, else 'login')
  const [currentScreen, setCurrentScreen] = useState(() => {
    return authService.isAuthenticated() ? "dashboard" : "login";
  });

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("srishticonnect_lang") || "en";
  });

  // Products state (hydrated through productService)
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);

  // Load products on mount
  useEffect(() => {
    const loadData = async () => {
      const items = await productService.getProducts();
      setProducts(items);
      if (items.length > 0) {
        setSelectedProduct(items[0]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("srishticonnect_lang", language);
  }, [language]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
    showToast(
      `🌐 Language switched to ${
        lang === "hi" ? "हिन्दी (Hindi)" : lang === "te" ? "తెలుగు (Telugu)" : "English"
      }`
    );
  };

  const login = async (identifier, password, rememberMe) => {
    const user = await authService.login(identifier, password, rememberMe);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
    return user;
  };

  const demoLogin = async () => {
    const user = await authService.demoLogin();
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentScreen("login");
    showToast("👋 You have been logged out safely.");
  };

  const navigateTo = (screen, product = null, step = 1) => {
    if (!isAuthenticated && screen !== "login") {
      setCurrentScreen("login");
      return;
    }
    if (product) {
      setSelectedProduct(product);
    }
    if (screen === "add_product") {
      setActiveStep(step);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addProduct = async (newProductData) => {
    const created = await productService.addProduct(newProductData);
    setProducts((prev) => [created, ...prev]);
    setSelectedProduct(created);
    showToast(translations[language]?.mockSavedSuccess || "Creation saved to your products!");
    navigateTo("dashboard");
    return created;
  };

  const updateProductStatus = async (productId, newStatus) => {
    const updated = await productService.updateStatus(productId, newStatus);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(updated);
    }
    showToast(`Status updated to "${newStatus}"`);
  };

  const toggleAudioGuide = () => {
    const nextState = !isAudioGuideActive;
    setIsAudioGuideActive(nextState);
    if (nextState) {
      showToast("🔊 Voice Assistant enabled: Voice instructions active.");
    } else {
      showToast("🔇 Voice Assistant muted.");
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        currentUser: currentUser || DEMO_ARTISAN,
        isAuthenticated,
        login,
        demoLogin,
        logout,
        currentScreen,
        setCurrentScreen,
        navigateTo,
        language,
        setLanguage,
        t,
        products,
        addProduct,
        updateProductStatus,
        selectedProduct,
        setSelectedProduct,
        activeStep,
        setActiveStep,
        toast,
        showToast,
        isAudioGuideActive,
        toggleAudioGuide
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
