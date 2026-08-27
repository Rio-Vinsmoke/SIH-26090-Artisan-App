/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { initialProducts } from "../data/initialProducts";
import { translations } from "../data/translations";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("kalasetu_onboarded") === "true";
  });
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("kalasetu_lang") || "en";
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("kalasetu_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);
  const [activeStep, setActiveStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("kalasetu_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("kalasetu_lang", language);
  }, [language]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    showToast(`🌐 Language switched to ${lang === "hi" ? "हिन्दी (Hindi)" : lang === "te" ? "తెలుగు (Telugu)" : "English"}`);
  };

  const navigateTo = (screen, product = null, step = 1) => {
    if (product) {
      setSelectedProduct(product);
    }
    if (screen === "add_product") {
      setActiveStep(step);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem("kalasetu_onboarded", "true");
    setCurrentScreen("dashboard");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      buyerChannel: "ONDC Crafts / State Emporium",
      marketLink: `https://kalasetu.artisan.in/item/craft-${Date.now()}`
    };
    setProducts((prev) => [productWithId, ...prev]);
    showToast(translations[language].mockSavedSuccess || "Product saved to catalog!");
    navigateTo("catalog");
  };

  const updateProductStatus = (productId, newStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to "${newStatus}"`);
  };

  const toggleAudioGuide = () => {
    const nextState = !isAudioGuideActive;
    setIsAudioGuideActive(nextState);
    if (nextState) {
      showToast("🔊 Audio Assistant enabled: Voice instructions ready.");
    } else {
      showToast("🔇 Audio Assistant muted.");
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
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
        hasCompletedOnboarding,
        finishOnboarding,
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

