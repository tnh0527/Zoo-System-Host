import { createContext, useContext, useState } from "react";

const PricingContext = createContext(undefined);

export function PricingProvider({ children }) {
  const [ticketPrices, setTicketPrices] = useState({
    adult: 29.99,
    child: 14.99,
    senior: 24.99,
    student: 19.99,
  });

  const [membershipPrice, setMembershipPrice] = useState(149.99);

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
