import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { ShoppingCart, Trash2, Plus, Minus, Crown, CheckCircle2 } from "lucide-react";
import { currentUser, memberships, purchases } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner@2.0.3";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'item' | 'food';
}

interface CartPageProps {
  cart: CartItem[];
  addToCart?: (item: { id: number; name: string; price: number; type: 'item' | 'food' }) => void;
  removeFromCart: (id: number, type: 'item' | 'food') => void;
  updateCartQuantity: (id: number, type: 'item' | 'food', quantity: number) => void;
  clearCart: () => void;
  onNavigate?: (page: 'shop') => void;
}

export function CartPage({ cart, removeFromCart, updateCartQuantity, clearCart, onNavigate }: CartPageProps) {
  const [itemToRemove, setItemToRemove] = useState<{ id: number; type: 'item' | 'food'; name: string } | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  // Check if current user has an active membership
  const hasMembership = currentUser && 'Customer_ID' in currentUser && 
    memberships.some(m => m.Customer_ID === currentUser.Customer_ID && m.Membership_Status);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Apply 10% member discount to items and food (not tickets or memberships)
  const memberDiscount = hasMembership 
    ? cart.filter(item => item.id < 9000).reduce((sum, item) => sum + (item.price * item.quantity * 0.10), 0)
    : 0;
  
  const discountedSubtotal = subtotal - memberDiscount;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  const handleIncreaseQuantity = (item: CartItem) => {
    updateCartQuantity(item.id, item.type, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.id, item.type, item.quantity - 1);
    } else {
      setItemToRemove({ id: item.id, type: item.type, name: item.name });
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    setItemToRemove({ id: item.id, type: item.type, name: item.name });
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id, itemToRemove.type);
      setItemToRemove(null);
    }
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  const handleCheckout = () => {
    setShowCheckoutDialog(true);
  };

  const confirmCheckout = () => {
    if (!currentUser || !('Customer_ID' in currentUser)) {
      toast.error('Please log in to complete your purchase');
      setShowCheckoutDialog(false);
      return;
    }

    // Check if membership is in cart (ID 9000)
    const hasMembershipInCart = cart.some(item => item.id === 9000);

    // Create new purchase record
    const newPurchaseId = Math.max(...purchases.map(p => p.Purchase_ID), 0) + 1;
    
    // Get customer-specific purchase number (incremental per customer)
    const customerPurchases = purchases.filter(p => p.Customer_ID === currentUser.Customer_ID);
    const customerPurchaseNumber = customerPurchases.length + 1;

    const newPurchase = {
      Purchase_ID: newPurchaseId,
      Total_Amount: total,
      Payment_Method: 'Card' as 'Card' | 'Cash',
      Purchase_Date: new Date().toISOString().replace('T', ' ').split('.')[0],
      Customer_ID: currentUser.Customer_ID,
      Membership_ID: null
    };

    // Add to purchases array
    purchases.push(newPurchase);

    // Handle membership purchase
    if (hasMembershipInCart) {
      const existingMembership = memberships.find(m => m.Customer_ID === currentUser.Customer_ID);
      
      if (existingMembership) {
        // Extend membership by 1 year (365 days)
        const currentEndDate = new Date(existingMembership.End_Date);
        const today = new Date();
        
        // If membership is expired, extend from today; otherwise extend from current end date
        const baseDate = currentEndDate < today ? today : currentEndDate;
        const newEndDate = new Date(baseDate);
        newEndDate.setDate(newEndDate.getDate() + 365);
        
        existingMembership.End_Date = newEndDate.toISOString().split('T')[0];
        existingMembership.Membership_Status = true;
        existingMembership.Last_Renewal_Date = new Date().toISOString().split('T')[0];
        existingMembership.Total_Renewals += 1;
        
        const action = currentEndDate < today ? 'renewed' : 'extended';
        toast.success(`Membership ${action}! New expiration: ${newEndDate.toLocaleDateString()}`);
      } else {
        // Create new membership
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 365);
        
        const newMembership = {
          Customer_ID: currentUser.Customer_ID,
          Price: cart.find(item => item.id === 9000)?.price || 149.99,
          Start_Date: startDate.toISOString().split('T')[0],
          End_Date: endDate.toISOString().split('T')[0],
          Membership_Status: true,
          Last_Renewal_Date: startDate.toISOString().split('T')[0],
          Total_Renewals: 0
        };
        
        memberships.push(newMembership);
        toast.success('Welcome to WildWood Zoo Membership!');
      }
    }

    // Clear cart and show success
    clearCart();
    setShowCheckoutDialog(false);
    toast.success(`Purchase confirmed! Order #${customerPurchaseNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-4">Shopping Cart</h1>
          <p className="text-xl text-green-100">
            Review your items and proceed to checkout
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cart Items ({cart.length})</CardTitle>
                    {cart.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowClearDialog(true)}
                        className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Clear Cart
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {cart.length > 0 ? (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        // Safety check for undefined values
                        if (!item || item.price === undefined || item.quantity === undefined) {
                          return null;
                        }
                        
                        return (
                        <div 
                          key={`${item.type}-${item.id}`}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.type === 'item' ? 'Gift Shop Item' : 'Food Item'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 px-2 py-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDecreaseQuantity(item)}
                                className="h-6 w-6 p-0 cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleIncreaseQuantity(item)}
                                className="h-6 w-6 p-0 cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Price */}
                            <span className="text-lg text-green-600 font-semibold min-w-[80px] text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            
                            {/* Delete Button */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveItem(item)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )})}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Your cart is empty</p>
                      <Button className="bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => onNavigate?.('shop')}>
                        Continue Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {hasMembership && memberDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span>Member Discount (10%):</span>
                        </div>
                        <span>-${memberDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>

                    {hasMembership && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <Crown className="h-4 w-4" />
                          <span>Member discount applied!</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 mt-6 cursor-pointer"
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Remove Item Confirmation Dialog */}
      <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToRemove?.name}" from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all items from your cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearCart}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Checkout Confirmation Dialog */}
      <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Review your order details and confirm your purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {hasMembership && memberDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Member Discount (10%):</span>
                  <span>-${memberDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-sm text-blue-700">Payment will be processed via card.</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCheckout}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}