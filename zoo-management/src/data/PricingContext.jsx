import { createContext, useContext, useState, useEffect } from "react";

const PricingContext = createContext(undefined);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function PricingProvider({ children }) {
  const [ticketPrices, setTicketPrices] = useState({
    adult: 29.99,
    child: 14.99,
    senior: 24.99,
    student: 19.99,
  });

  const [membershipPrice, setMembershipPrice] = useState(149.99);
  const [isLoading, setIsLoading] = useState(true);

  // Load pricing from database on mount
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/pricing`);
        if (response.ok) {
          const data = await response.json();
          setTicketPrices(data.ticketPrices);
          setMembershipPrice(data.membershipPrice);
        }
      } catch (error) {
        console.error("Error loading pricing:", error);
        // Keep default prices if API fails
      } finally {
        setIsLoading(false);
      }
    };

    loadPricing();
  }, []);

  const updateTicketPrices = (prices) => {
    setTicketPrices(prices);
  };

  const updateMembershipPrice = (price) => {
    setMembershipPrice(price);
  };

  return (
    <PricingContext.Provider
      value={{
        ticketPrices,
        membershipPrice,
        updateTicketPrices,
        updateMembershipPrice,
        isLoading,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
