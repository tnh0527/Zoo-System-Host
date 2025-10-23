import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import type { Customer } from "../data/mockData";
import { purchases, tickets, purchaseItems, items, getCustomerMembership, memberships, getCustomerPurchaseNumber } from "../data/mockData";
import { Download, Receipt } from "lucide-react";

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface OrderHistoryPageProps {
  user: Customer;
}

export function OrderHistoryPage({ user }: OrderHistoryPageProps) {
  const customerPurchases = purchases
    .filter(p => p.Customer_ID === user.Customer_ID)
    .sort((a, b) => new Date(b.Purchase_Date).getTime() - new Date(a.Purchase_Date).getTime());
  const customerTickets = tickets.filter(t => 
    customerPurchases.some(p => p.Purchase_ID === t.Purchase_ID)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-4">Order History</h1>
          <p className="text-xl text-green-100">
            View all your past purchases and download receipts
          </p>
        </div>
      </section>

      {/* Order History */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {customerPurchases.length > 0 ? (
                  <div className="space-y-6">
                    {customerPurchases.map((purchase) => {
                      const purchaseTickets = tickets.filter(t => t.Purchase_ID === purchase.Purchase_ID);
                      const purchaseItemsList = purchaseItems.filter(pi => pi.Purchase_ID === purchase.Purchase_ID);
                      
                      return (
                        <div 
                          key={purchase.Purchase_ID}
                          className="border-b last:border-0 pb-6 last:pb-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge variant="secondary">{purchase.Payment_Method}</Badge>
                                <span className="text-sm text-gray-600">Order #{getCustomerPurchaseNumber(user.Customer_ID, purchase.Purchase_ID)}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(purchase.Purchase_Date).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl text-green-600 font-semibold">
                                ${purchase.Total_Amount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                            {purchaseTickets.length > 0 && (
                              <>
                                {purchaseTickets.map((ticket) => (
                                  <p key={ticket.Ticket_ID} className="text-sm text-gray-600">
                                    • {ticket.Ticket_Type} Ticket (x{ticket.Quantity}) - ${(ticket.Price * ticket.Quantity).toFixed(2)}
                                  </p>
                                ))}
                              </>
                            )}
                            {(() => {
                              const purchaseGiftItems = purchaseItems.filter(pi => pi.Purchase_ID === purchase.Purchase_ID);
                              return purchaseGiftItems.length > 0 && purchaseGiftItems.map((purchaseItem) => {
                                const item = items.find(i => i.Item_ID === purchaseItem.Item_ID);
                                return item && (
                                  <p key={purchaseItem.Item_ID} className="text-sm text-gray-600">
                                    • {item.Item_Name} (x{purchaseItem.Quantity}) - ${(purchaseItem.Unit_Price * purchaseItem.Quantity).toFixed(2)}
                                  </p>
                                );
                              });
                            })()}
                            {purchaseTickets.length === 0 && 
                             purchaseItems.filter(pi => pi.Purchase_ID === purchase.Purchase_ID).length === 0 && (
                              <p className="text-sm text-gray-600">• Purchase completed</p>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4 mr-2" />
                              View Receipt
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No order history found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl text-green-600 mb-2">
                    {customerPurchases.length}
                  </div>
                  <p className="text-gray-700">Total Orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl text-green-600 mb-2">
                    ${formatNumber(customerPurchases.reduce((sum, p) => sum + p.Total_Amount, 0))}
                  </div>
                  <p className="text-gray-700">Total Spent</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl text-green-600 mb-2">
                    {customerTickets.length}
                  </div>
                  <p className="text-gray-700">Tickets Purchased</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}