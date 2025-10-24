import {
  purchases,
  tickets,
  memberships,
  purchaseItems,
  items,
  getCustomerMembership,
  getCustomerPurchaseNumber,
} from "../data/mockData";
import {
  ShoppingCart,
  Ticket,
  ShoppingBag,
  Calendar,
  Receipt,
  Eye,
  EyeOff,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Crown } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Helper function to format numbers with commas
const formatNumber = (num) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function CustomerDashboard({ user, onNavigate }) {
  const customerPurchases = purchases
    .filter((p) => p.Customer_ID === user.Customer_ID)
    .sort(
      (a, b) =>
        new Date(b.Purchase_Date).getTime() -
        new Date(a.Purchase_Date).getTime()
    );
  const recentPurchases = customerPurchases.slice(0, 3);
  const membership = getCustomerMembership(user.Customer_ID);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.First_Name,
    lastName: user.Last_Name,
    email: user.Email,
    phone: user.Phone,
  });

  // Password State
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Order History Dialog State
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);

  // Purchase Detail Dialog State
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleSaveProfile = () => {
    // In a real app, this would update the database
    user.First_Name = profileData.firstName;
    user.Last_Name = profileData.lastName;
    user.Email = profileData.email;
    user.Phone = profileData.phone;

    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    // In a real app, this would verify current password and update in database
    toast.success("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
  };

  const handleRenewMembership = () => {
    // Navigate to tickets page membership section
    if (onNavigate) {
      onNavigate("tickets");
      // Scroll to memberships section after navigation
      setTimeout(() => {
        const membershipsSection = document.getElementById("memberships");
        if (membershipsSection) {
          membershipsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  // Check if membership is expired
  const isMembershipExpired = membership
    ? new Date(membership.End_Date) < new Date()
    : false;
  const membershipStatus = membership
    ? isMembershipExpired
      ? "Expired"
      : "Active"
    : "No Membership";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-2">
            Welcome, {user.First_Name}!
          </h1>

          {/* Membership Status and Renewal */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-100">Membership Status:</span>
              {membership ? (
                <Badge
                  className={`${
                    isMembershipExpired
                      ? "bg-red-500"
                      : "bg-white text-green-700"
                  }`}
                >
                  {membershipStatus}
                </Badge>
              ) : (
                <Badge className="bg-gray-400 text-white">No Membership</Badge>
              )}
            </div>

            {membership && (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-green-100">Valid Until:</span>
                  <span
                    className={`font-medium ${
                      isMembershipExpired ? "text-red-200" : "text-white"
                    }`}
                  >
                    {new Date(membership.End_Date).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  onClick={handleRenewMembership}
                  className="bg-white text-green-700 hover:bg-green-50 mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isMembershipExpired
                    ? "Renew Membership"
                    : "Extend Membership"}
                </Button>
              </>
            )}

            {!membership && (
              <p className="text-green-100 text-sm">
                Become a member to enjoy exclusive benefits!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onNavigate && onNavigate("tickets")}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <Ticket className="h-8 w-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="mb-2">Buy Tickets</h3>
                <p className="text-sm text-gray-600">
                  Purchase day passes or special event tickets
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onNavigate && onNavigate("shop")}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <ShoppingBag className="h-8 w-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="mb-2">Gift Shop</h3>
                <p className="text-sm text-gray-600">
                  Browse our merchandise and souvenirs
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2">Membership</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {membership
                    ? isMembershipExpired
                      ? "Your membership has expired"
                      : "You are a valued member"
                    : "Join to get exclusive perks and discounts"}
                </p>
                <Button
                  onClick={handleRenewMembership}
                  className="bg-green-600 hover:bg-green-700 w-full cursor-pointer"
                >
                  {membership
                    ? isMembershipExpired
                      ? "Renew"
                      : "Extend"
                    : "Become a Member"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Purchases */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Recent Orders</h2>
            <Dialog open={orderHistoryOpen} onOpenChange={setOrderHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  View All Orders
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Order History</DialogTitle>
                  <DialogDescription>
                    View all your past purchases and orders
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="space-y-4">
                    {customerPurchases.map((purchase) => {
                      const purchaseTickets = tickets.filter(
                        (t) => t.Purchase_ID === purchase.Purchase_ID
                      );
                      const purchaseGiftItems = purchaseItems.filter(
                        (pi) => pi.Purchase_ID === purchase.Purchase_ID
                      );

                      return (
                        <Card
                          key={purchase.Purchase_ID}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedPurchase(purchase);
                            setOrderHistoryOpen(false);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Order #
                                  {getCustomerPurchaseNumber(
                                    user.Customer_ID,
                                    purchase.Purchase_ID
                                  )}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    purchase.Purchase_Date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-semibold text-green-600">
                                  ${purchase.Total_Amount.toFixed(2)}
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                  {purchase.Payment_Method}
                                </Badge>
                              </div>
                            </div>

                            {/* Items in this purchase */}
                            <div className="space-y-2">
                              {purchaseTickets.length > 0 && (
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Tickets:</span>{" "}
                                  {purchaseTickets
                                    .map(
                                      (t) => `${t.Quantity}x ${t.Ticket_Type}`
                                    )
                                    .join(", ")}
                                </div>
                              )}
                              {purchaseGiftItems.length > 0 && (
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Items:</span>{" "}
                                  {purchaseGiftItems
                                    .map((pi) => {
                                      const item = items.find(
                                        (i) => i.Item_ID === pi.Item_ID
                                      );
                                      return `${pi.Quantity}x ${item?.Item_Name}`;
                                    })
                                    .join(", ")}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPurchases.map((purchase) => {
              const purchaseTickets = tickets.filter(
                (t) => t.Purchase_ID === purchase.Purchase_ID
              );
              const purchaseGiftItems = purchaseItems.filter(
                (pi) => pi.Purchase_ID === purchase.Purchase_ID
              );

              return (
                <Card
                  key={purchase.Purchase_ID}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPurchase(purchase)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Order #
                          {getCustomerPurchaseNumber(
                            user.Customer_ID,
                            purchase.Purchase_ID
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            purchase.Purchase_Date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Receipt className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-2 mb-4">
                      {purchaseTickets.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tickets</span>
                          <Badge variant="secondary">
                            {purchaseTickets.reduce(
                              (sum, t) => sum + t.Quantity,
                              0
                            )}
                          </Badge>
                        </div>
                      )}
                      {purchaseGiftItems.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gift Items</span>
                          <Badge variant="secondary">
                            {purchaseGiftItems.reduce(
                              (sum, pi) => sum + pi.Quantity,
                              0
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-semibold text-green-600">
                          ${purchase.Total_Amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {recentPurchases.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent purchases</p>
            </div>
          )}
        </div>
      </section>

      {/* Account Settings */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl mb-6">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <p className="font-medium">
                        {user.First_Name} {user.Last_Name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email</Label>
                      <p className="font-medium">{user.Email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone</Label>
                      <p className="font-medium">
                        {user.Phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Customer ID</Label>
                      <p className="font-medium">#{user.Customer_ID}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-green-600 hover:bg-green-700 w-full cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            firstName: user.First_Name,
                            lastName: user.Last_Name,
                            email: user.Email,
                            phone: user.Phone,
                          });
                        }}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                {!isChangingPassword ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600">Password</Label>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {showPassword ? "password123" : "••••••••"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-green-600 hover:bg-green-700 w-full cursor-pointer"
                    >
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleChangePassword}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      >
                        Update Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Purchase Detail Dialog */}
      <Dialog
        open={selectedPurchase !== null}
        onOpenChange={() => setSelectedPurchase(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #
              {selectedPurchase &&
                getCustomerPurchaseNumber(
                  user.Customer_ID,
                  selectedPurchase.Purchase_ID
                )}{" "}
              -{" "}
              {selectedPurchase &&
                new Date(selectedPurchase.Purchase_Date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            {selectedPurchase && (
              <div className="space-y-6">
                {/* Purchase Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">
                          #
                          {getCustomerPurchaseNumber(
                            user.Customer_ID,
                            selectedPurchase.Purchase_ID
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(
                            selectedPurchase.Purchase_Date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <Badge variant="secondary">
                          {selectedPurchase.Payment_Method}
                        </Badge>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-2xl font-semibold text-green-600">
                            ${selectedPurchase.Total_Amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tickets included in this purchase */}
                {(() => {
                  const purchaseTickets = tickets.filter(
                    (t) => t.Purchase_ID === selectedPurchase.Purchase_ID
                  );
                  return (
                    purchaseTickets.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Tickets</h3>
                        <div className="space-y-2">
                          {purchaseTickets.map((ticket) => (
                            <Card key={ticket.Ticket_ID}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">
                                      {ticket.Ticket_Type} Ticket
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {ticket.Quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Ticket ID: #{ticket.Ticket_ID}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-green-600">
                                      $
                                      {(ticket.Price * ticket.Quantity).toFixed(
                                        2
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })()}

                {/* Gift Shop Items included in this purchase */}
                {(() => {
                  const purchaseGiftItems = purchaseItems.filter(
                    (pi) => pi.Purchase_ID === selectedPurchase.Purchase_ID
                  );
                  return (
                    purchaseGiftItems.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Gift Shop Items</h3>
                        <div className="space-y-2">
                          {purchaseGiftItems.map((purchaseItem) => {
                            const item = items.find(
                              (i) => i.Item_ID === purchaseItem.Item_ID
                            );
                            return (
                              <Card key={purchaseItem.Item_ID}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">
                                        {item?.Item_Name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Quantity: {purchaseItem.Quantity}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Item ID: #{item?.Item_ID}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-green-600">
                                        $
                                        {(
                                          purchaseItem.Unit_Price *
                                          purchaseItem.Quantity
                                        ).toFixed(2)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        ${purchaseItem.Unit_Price.toFixed(2)}{" "}
                                        each
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )
                  );
                })()}

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-3">Customer Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer ID:</span>
                          <span className="font-medium">
                            #{selectedPurchase.Customer_ID}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {user.First_Name} {user.Last_Name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user.Email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
