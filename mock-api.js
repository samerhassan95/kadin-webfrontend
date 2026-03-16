// Mock API data for development
const mockData = {
  settings: {
    title: "Kadin Marketplace",
    logo: "/img/logo.png",
    currency: "USD",
    language: "en"
  },
  translations: {
    welcome: "Welcome to Kadin Marketplace",
    home: "Home",
    products: "Products",
    categories: "Categories"
  }
};

// Mock API server
if (typeof window !== 'undefined') {
  window.mockAPI = mockData;
}

module.exports = mockData;