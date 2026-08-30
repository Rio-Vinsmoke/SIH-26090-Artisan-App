import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  authService,
  DEMO_ARTISAN
} from "../services/authService";

import { productService } from "../services/productService";
import { translations } from "../data/translations";

// Create context
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  // ================= AUTHENTICATION STATE =================

  const [currentUser, setCurrentUser] = useState(() =>
    authService.getCurrentUser()
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );

  const [currentScreen, setCurrentScreen] = useState(() =>
    authService.isAuthenticated()
      ? "dashboard"
      : "login"
  );


  // ================= LANGUAGE =================

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("srishticonnect_lang") || "en";
  });


  // ================= PRODUCTS STATE =================

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


  // ================= ADD PRODUCT STATE =================

  const [activeStep, setActiveStep] = useState(1);


  // ================= UI STATE =================

  const [toast, setToast] = useState(null);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);


  // ================= TOAST =================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };


  // ================= GOOGLE CALLBACK =================
  // Runs once when the React application starts.
  // If Google redirects back with user data, save the user
  // and open their dashboard.

  useEffect(() => {

    const googleUser = authService.handleGoogleCallback();

    if (googleUser) {
      setCurrentUser(googleUser);
      setIsAuthenticated(true);
      setCurrentScreen("dashboard");
    }

  }, []);


  // ================= LOAD PRODUCTS =================

  useEffect(() => {

    const loadData = async () => {

      // User is logged out
      if (!isAuthenticated) {
        setProducts([]);
        setSelectedProduct(null);
        return;
      }

      try {

        const items = await productService.getProducts();

        setProducts(items);

        if (items && items.length > 0) {
          setSelectedProduct(items[0]);
        } else {
          setSelectedProduct(null);
        }

      } catch (error) {

        console.error(
          "Failed to load products:",
          error
        );

        // If authentication/token problem occurs,
        // log the user out.
        if (
          error.message?.toLowerCase().includes("session") ||
          error.message?.toLowerCase().includes("logged in") ||
          error.message?.toLowerCase().includes("unauthorized") ||
          error.message?.toLowerCase().includes("401")
        ) {

          await authService.logout();

          setCurrentUser(null);
          setIsAuthenticated(false);
          setCurrentScreen("login");

          showToast(
            "⚠️ Your session has expired. Please log in again."
          );

        } else {

          showToast(
            error.message ||
            "Unable to load your products."
          );

        }
      }
    };

    loadData();

  }, [isAuthenticated]);


  // ================= SAVE LANGUAGE =================

  useEffect(() => {

    localStorage.setItem(
      "srishticonnect_lang",
      language
    );

  }, [language]);


  // ================= CHANGE LANGUAGE =================

  const setLanguage = (lang) => {

    setLanguageState(lang);

    showToast(
      `🌐 Language switched to ${
        lang === "hi"
          ? "हिन्दी (Hindi)"
          : lang === "te"
          ? "తెలుగు (Telugu)"
          : "English"
      }`
    );
  };


  // ================= NORMAL LOGIN =================

  const login = async (
    identifier,
    password,
    rememberMe = true
  ) => {

    const user = await authService.login(
      identifier,
      password,
      rememberMe
    );

    // Save logged-in user in React state
    setCurrentUser(user);

    // Mark user as authenticated
    setIsAuthenticated(true);

    // Open that user's dashboard
    setCurrentScreen("dashboard");

    return user;
  };


  // ================= REGISTER =================

  const register = async (userData) => {

    return await authService.register(userData);

  };


  // ================= GOOGLE LOGIN =================

  const loginWithGoogle = () => {

    authService.loginWithGoogle();

  };


  // ================= LOGOUT =================

  const logout = async () => {

    await authService.logout();

    // Clear authentication state
    setCurrentUser(null);
    setIsAuthenticated(false);

    // Clear user-specific data
    setProducts([]);
    setSelectedProduct(null);

    // Return to login page
    setCurrentScreen("login");

    showToast(
      "👋 You have been logged out safely."
    );
  };


  // ================= NAVIGATION =================

  const navigateTo = (
    screen,
    product = null,
    step = 1
  ) => {

    // Prevent unauthenticated users from accessing
    // protected application screens.
    if (
      !isAuthenticated &&
      screen !== "login"
    ) {

      setCurrentScreen("login");
      return;
    }


    // Set selected product when provided
    if (product) {
      setSelectedProduct(product);
    }


    // Set step for Add Product screen
    if (screen === "add_product") {
      setActiveStep(step);
    }


    // Navigate to requested screen
    setCurrentScreen(screen);


    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ================= ADD PRODUCT =================

  const addProduct = async (
    newProductData
  ) => {

    const created =
      await productService.addProduct(
        newProductData
      );

    // Add newly created product at the beginning
    setProducts((prev) => [
      created,
      ...prev
    ]);

    setSelectedProduct(created);

    showToast(
      translations[language]?.mockSavedSuccess ||
      "Creation saved to your products!"
    );

    return created;
  };


  // ================= UPDATE PRODUCT STATUS =================

  const updateProductStatus = async (
    productId,
    newStatus
  ) => {

    const updated =
      await productService.updateStatus(
        productId,
        newStatus
      );


    // Update products list
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...updated,
              status: newStatus
            }
          : product
      )
    );


    // Update selected product if needed
    if (
      selectedProduct &&
      selectedProduct.id === productId
    ) {

      setSelectedProduct(updated);

    }


    showToast(
      `Status updated to "${newStatus}"`
    );

    return updated;
  };


  // ================= DELETE PRODUCT =================

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(null);
      }

      showToast("🗑️ Product deleted successfully from catalog.");
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast(`⚠️ ${error.message || "Failed to delete product"}`);
      throw error;
    }
  };


  // ================= AUDIO GUIDE =================

  const toggleAudioGuide = () => {

    const nextState =
      !isAudioGuideActive;

    setIsAudioGuideActive(nextState);


    if (nextState) {

      showToast(
        "🔊 Voice Assistant enabled: Voice instructions active."
      );

    } else {

      showToast(
        "🔇 Voice Assistant muted."
      );

    }
  };


  // ================= TRANSLATIONS =================

  const t =
    translations[language] ||
    translations.en;


  // ================= PROVIDER =================

  return (

    <AppContext.Provider
      value={{

        // Authentication
        currentUser:
          currentUser || DEMO_ARTISAN,

        isAuthenticated,

        login,
        register,
        loginWithGoogle,
        logout,


        // Navigation
        currentScreen,
        setCurrentScreen,
        navigateTo,


        // Language
        language,
        setLanguage,
        t,


        // Products
        products,
        setProducts,

        addProduct,
        updateProductStatus,
        deleteProduct,

        selectedProduct,
        setSelectedProduct,


        // Add product steps
        activeStep,
        setActiveStep,


        // Toast
        toast,
        showToast,


        // Audio guide
        isAudioGuideActive,
        toggleAudioGuide
      }}
    >

      {children}

    </AppContext.Provider>

  );
};


// =====================================================
// CUSTOM HOOK
// IMPORTANT: This is what fixes your "useApp" error.
// Components such as Header.jsx and LoginPage.jsx use:
//
// import { useApp } from "../context/AppContext";
// =====================================================

export const useApp = () => {

  const context =
    useContext(AppContext);


  if (!context) {

    throw new Error(
      "useApp must be used within an AppProvider"
    );

  }


  return context;
};