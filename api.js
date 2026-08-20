/* =========================================================
   LUXE STORE - API & DATABASE HANDLER (api.js)
   Connects HTML Frontend to MongoDB Atlas / Backend APIs
   ========================================================= */

// Configuration: Apni Google Cloud / MongoDB Atlas API Base URL yahan dalein
const API_CONFIG = {
  BASE_URL: "https://your-backend-api-domain.com/api", // Apne API server ya Atlas Data API ka URL dalein
  API_KEY: "YOUR_MONGODB_ATLAS_API_KEY" // Agar direct Data API use kar rahe hain
};

/**
 * 1. GET ALL PRODUCTS
 * Database se sare products fetch karta hai (In Stock & Out of Stock)
 */
async function fetchProductsFromDB() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_CONFIG.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products from database");
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback: Agar API fail hoti hai toh localStorage se data read karega
    return JSON.parse(localStorage.getItem("products_db")) || [];
  }
}

/**
 * 2. ADD NEW PRODUCT (ADMIN)
 * Database me naya product insert karta hai
 */
async function addProductToDB(productData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/products/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_CONFIG.API_KEY
      },
      body: JSON.stringify(productData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding product to DB:", error);
    // Local fallback for offline testing
    let localDB = JSON.parse(localStorage.getItem("products_db")) || [];
    localDB.push(productData);
    localStorage.setItem("products_db", JSON.stringify(localDB));
    return { success: true, message: "Saved to local storage (Offline Mode)" };
  }
}

/**
 * 3. TOGGLE STOCK STATUS (IN STOCK / OUT OF STOCK)
 * Specific product ka stock status (isStock: true/false) update karta hai
 */
async function updateStockInDB(productId, isStockStatus) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/products/update-stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_CONFIG.API_KEY
      },
      body: JSON.stringify({
        id: productId,
        isStock: isStockStatus
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating stock status:", error);
    // Local fallback for offline testing
    let localDB = JSON.parse(localStorage.getItem("products_db")) || [];
    localDB = localDB.map(prod => {
      if (prod.id === productId) {
        return { ...prod, isStock: isStockStatus };
      }
      return prod;
    });
    localStorage.setItem("products_db", JSON.stringify(localDB));
    return { success: true, message: "Stock updated locally" };
  }
}

/**
 * 4. CREATE NEW ORDER (CHECKOUT)
 * Customer ka final order database me place karta hai
 */
async function createOrderInDB(orderData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_CONFIG.API_KEY
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error placing order:", error);
    // Local fallback
    let orders = JSON.parse(localStorage.getItem("orders_db")) || [];
    orders.push(orderData);
    localStorage.setItem("orders_db", JSON.stringify(orders));
    return { success: true, orderId: orderData.orderId || Date.now() };
  }
}

/**
 * 5. FETCH USER ORDER HISTORY
 * Customer ke pichle saare orders fetch karta hai
 */
async function fetchOrderHistoryFromDB(userEmail) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders?email=${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_CONFIG.API_KEY
      }
    });

    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching order history:", error);
    return JSON.parse(localStorage.getItem("orders_db")) || [];
  }
}