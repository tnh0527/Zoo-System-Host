import { useState } from "react";

// Components
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

// Pages
import { HomePage } from "./pages/HomePage";
import { AnimalsPage } from "./pages/AnimalsPage";
import { AttractionsPage } from "./pages/AttractionsPage";
import { ShopPage } from "./pages/ShopPage";
import { FoodPage } from "./pages/FoodPage";
import { TicketsPage } from "./pages/TicketsPage";
import { CartPage } from "./pages/CartPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";

// Staff Portals
import { VeterinarianPortal } from "./pages/staff/VeterinarianPortal";
import { ZookeeperPortal } from "./pages/staff/ZookeeperPortal";
import { GiftShopPortal } from "./pages/staff/GiftShopPortal";
import { ConcessionPortal } from "./pages/staff/ConcessionPortal";
import { ManagerPortal } from "./pages/staff/ManagerPortal";
import { AdminPortal } from "./pages/AdminPortal";

// Login
import { LoginPage } from "./pages/LoginPage";

import { currentUser, currentUserType, setCurrentUser, type Employee, type Customer, getEmployeeRole, isAdmin } from "./data/mockData";
import { Toaster } from "./components/ui/sonner";
import { DataProvider } from "./data/DataContext";
import { PricingProvider } from "./data/PricingContext";

export type Page = 
  | 'home' 
  | 'animals' 
  | 'attractions' 
  | 'shop' 
  | 'food' 
  | 'tickets'
  | 'customer-dashboard'
  | 'cart'
  | 'order-history'
  | 'staff-portal'
  | 'admin-portal'
  | 'login';

export type UserType = 'employee' | 'customer' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<Employee | Customer | null>(currentUser);
  const [userType, setUserType] = useState<UserType>(currentUserType);
  
  // Cart state
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number; type: 'item' | 'food' }>>([]);

  const handleLogin = (loggedInUser: Employee | Customer, type: UserType) => {
    setCurrentUser(loggedInUser, type);
    setUser(loggedInUser);
    setUserType(type);
    
    // Navigate based on type and role
    if (type === 'employee') {
      const employee = loggedInUser as Employee;
      if (isAdmin(employee)) {
        setCurrentPage('admin-portal');
      } else {
        setCurrentPage('staff-portal');
      }
    } else if (type === 'customer') {
      setCurrentPage('customer-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null, null);
    setUser(null);
    setUserType(null);
    setCurrentPage('home');
    setCart([]); // Clear cart on logout
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const addToCart = (item: { id: number; name: string; price: number; type: 'item' | 'food' }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id && i.type === item.type);
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };
  
  const removeFromCart = (id: number, type: 'item' | 'food') => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.type === type)));
  };
  
  const updateCartQuantity = (id: number, type: 'item' | 'food', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const renderPage = () => {
    // Staff Portal - route to appropriate staff page based on job title
    if (currentPage === 'staff-portal' && user && userType === 'employee') {
      const employee = user as Employee;
      const role = getEmployeeRole(employee);
      
      switch (role) {
        case 'Veterinarian':
          return <VeterinarianPortal user={employee} onLogout={handleLogout} />;
        case 'Zookeeper':
          return <ZookeeperPortal user={employee} onLogout={handleLogout} />;
        case 'Gift Shop Worker':
          return <GiftShopPortal user={employee} onLogout={handleLogout} onNavigate={handleNavigate} />;
        case 'Concession Worker':
          return <ConcessionPortal user={employee} onLogout={handleLogout} onNavigate={handleNavigate} />;
        case 'Supervisor':
          return <ManagerPortal user={employee} onLogout={handleLogout} />;
        default:
          return <HomePage onNavigate={handleNavigate} />;
      }
    }

    // Admin Portal
    if (currentPage === 'admin-portal' && user && userType === 'employee') {
      return <AdminPortal user={user as Employee} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }

    // Login Page
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('home')} />;
    }

    // Public and Customer Pages
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'animals':
        return <AnimalsPage />;
      case 'attractions':
        return <AttractionsPage />;
      case 'shop':
        return <ShopPage onNavigate={handleNavigate} addToCart={addToCart} />;
      case 'food':
        return <FoodPage addToCart={addToCart} />;
      case 'tickets':
        return <TicketsPage onNavigate={handleNavigate} addToCart={addToCart} />;
      case 'customer-dashboard':
        return (user && userType === 'customer') ? <CustomerDashboard user={user as Customer} onNavigate={handleNavigate} /> : <HomePage onNavigate={handleNavigate} />;
      case 'cart':
        return <CartPage cart={cart} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} onNavigate={handleNavigate} />;
      case 'order-history':
        return (user && userType === 'customer') ? <OrderHistoryPage user={user as Customer} /> : <HomePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Don't show nav/footer for staff and admin portals
  const showNavAndFooter = currentPage !== 'staff-portal' && currentPage !== 'admin-portal' && currentPage !== 'login';
  
  // Calculate total cart items
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PricingProvider>
      <DataProvider>
        <div className="min-h-screen">
        {showNavAndFooter && (
          <Navigation 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
            user={user}
            userType={userType}
            onLogout={handleLogout}
            cartCount={cartCount}
          />
        )}
        {renderPage()}
        {showNavAndFooter && <Footer />}
        <Toaster />
        </div>
      </DataProvider>
    </PricingProvider>
  );
}