import { createContext, useContext, useState, ReactNode } from 'react';

interface TicketPrices {
  Adult: number;
  Child: number;
  Senior: number;
  Student: number;
}

interface PricingContextType {
  ticketPrices: TicketPrices;
  membershipPrice: number;
  updateTicketPrices: (prices: TicketPrices) => void;
  updateMembershipPrice: (price: number) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [ticketPrices, setTicketPrices] = useState<TicketPrices>({
    Adult: 29.99,
    Child: 14.99,
    Senior: 24.99,
    Student: 19.99
  });

  const [membershipPrice, setMembershipPrice] = useState(149.99);

  const updateTicketPrices = (prices: TicketPrices) => {
    setTicketPrices(prices);
  };

  const updateMembershipPrice = (price: number) => {
    setMembershipPrice(price);
  };

  return (
    <PricingContext.Provider 
      value={{ 
        ticketPrices, 
        membershipPrice, 
        updateTicketPrices, 
        updateMembershipPrice 
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
