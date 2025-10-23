import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ScrollArea } from "../components/ui/scroll-area";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Employee, Location, Animal, Enclosure } from "../data/mockData";
import {employeeRecords, purchases, tickets, memberships, locations, jobTitles, enclosures } from "../data/mockData";
import { LogOut, DollarSign, Users, Package, Coffee, Ticket, Crown, UserPlus, Trash2, Calendar, Eye, Edit, Search, Save, Home, Plus, PawPrint } from "lucide-react";
import { useData } from "../data/DataContext";
import { toast } from "sonner@2.0.3";
import { ZooLogo } from "../components/ZooLogo";
import { usePricing } from "../data/PricingContext";

interface AdminPortalProps {
  user: Employee;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'admin-portal') => void;
}

export function AdminPortal({ user, onLogout, onNavigate }: AdminPortalProps) {
  const { animals: animalList, addAnimal, updateAnimal, deleteAnimal, items: giftShopItems, concessionItems: foodItems } = useData();
  const { ticketPrices, membershipPrice, updateTicketPrices, updateMembershipPrice } = usePricing();
  const [allEmployees, setAllEmployees] = useState(employeeRecords);
  const [allLocations, setAllLocations] = useState(locations);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isManageZoneOpen, setIsManageZoneOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Location | null>(null);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState<Employee | null>(null);
  const [revenueRange, setRevenueRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('all');
  const [viewZoneEmployees, setViewZoneEmployees] = useState<Location | null>(null);
  const [isSalaryManagementOpen, setIsSalaryManagementOpen] = useState(false);
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [deleteConfirmAnimal, setDeleteConfirmAnimal] = useState<Animal | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [lastUpdated] = useState(new Date());

  // Salary state for each job type (5 shared login roles)
  const [salaries, setSalaries] = useState({
    2: 72000, // Supervisor
    3: 72000, // Veterinarian
    4: 45000, // Zookeeper
    5: 32000, // Concession Worker
    6: 35000  // Gift Shop Worker
  });

  // Temporary salary state for editing
  const [tempSalaries, setTempSalaries] = useState({ ...salaries });

  // Pricing state for tickets and memberships
  const [isPricingManagementOpen, setIsPricingManagementOpen] = useState(false);
  const [tempTicketPrices, setTempTicketPrices] = useState({ ...ticketPrices });
  const [tempMembershipPrice, setTempMembershipPrice] = useState(membershipPrice);

  // Update supervisor salaries on mount and when locations change
  useEffect(() => {
    setAllEmployees(prevEmployees => prevEmployees.map(emp => {
      // Check if this employee is a supervisor of any zone
      const isSupervisor = allLocations.some(loc => loc.Supervisor_ID === emp.Employee_ID);
      
      if (isSupervisor) {
        // Employee is a supervisor, use supervisor salary
        return { ...emp, Salary: salaries[2] };
      }
      return emp;
    }));
  }, []); // Only run on mount

  // Helper function to filter data by date range
  const filterByDateRange = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (revenueRange) {
      case 'today':
        return daysDiff === 0;
      case 'week':
        return daysDiff >= 0 && daysDiff <= 7; // Include today and past 7 days
      case 'month':
        return daysDiff >= 0 && daysDiff <= 30; // Include today and past 30 days
      case 'year':
        return daysDiff >= 0 && daysDiff <= 365; // Include today and past 365 days
      case 'all':
      default:
        return true;
    }
  };

  // Helper function to format date as MM/DD/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Helper function to format last updated time
  const formatLastUpdated = () => {
    const hours = lastUpdated.getHours();
    const minutes = String(lastUpdated.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  // Helper function to get employee zone
  const getEmployeeZone = (emp: Employee): string => {
    // Check if employee is a supervisor of a zone
    const supervisedZone = allLocations.find(loc => loc.Supervisor_ID === emp.Employee_ID);
    if (supervisedZone) return `Zone ${supervisedZone.Zone} (Supervisor)`;
    
    // Otherwise, find zone by supervisor chain
    const supervisor = allEmployees.find(e => e.Employee_ID === emp.Supervisor_ID);
    if (supervisor) {
      const supZone = allLocations.find(loc => loc.Supervisor_ID === supervisor.Employee_ID);
      if (supZone) return `Zone ${supZone.Zone}`;
    }
    
    return 'Not Assigned';
  };

  // Sort employees alphabetically by last name
  const sortedEmployees = useMemo(() => {
    return [...allEmployees].sort((a, b) => 
      a.Last_Name.localeCompare(b.Last_Name)
    );
  }, [allEmployees]);

  // Calculate statistics from database with date filtering
  const filteredPurchases = purchases.filter(p => filterByDateRange(p.Purchase_Date));
  const filteredTickets = tickets.filter(t => {
    const purchase = purchases.find(p => p.Purchase_ID === t.Purchase_ID);
    return purchase && filterByDateRange(purchase.Purchase_Date);
  });
  const filteredMemberships = memberships.filter(m => filterByDateRange(m.Start_Date));
  
  const ticketRevenue = filteredTickets.reduce((sum, t) => sum + (t.Price * t.Quantity), 0);
  const membershipRevenue = filteredMemberships.reduce((sum, m) => sum + m.Price, 0);
  const giftShopRevenue = giftShopItems.reduce((sum, item) => sum + item.Price, 0) * 2.5;
  const foodRevenue = foodItems.reduce((sum, item) => sum + item.Price, 0) * 3.2;
  
  const totalRevenue = ticketRevenue + membershipRevenue + giftShopRevenue + foodRevenue;
  const totalAnimals = animalList.length;
  const totalEmployees = allEmployees.length;
  const activeMemb = memberships.filter(m => m.Membership_Status).length;

  // Revenue Breakdown
  const revenueBreakdown = [
    { category: 'Tickets', amount: ticketRevenue, color: 'bg-green-600', icon: Ticket },
    { category: 'Memberships', amount: membershipRevenue, color: 'bg-purple-600', icon: Crown },
    { category: 'Gift Shop', amount: giftShopRevenue, color: 'bg-blue-600', icon: Package },
    { category: 'Food & Beverages', amount: foodRevenue, color: 'bg-orange-600', icon: Coffee },
  ];

  // Ticket stats
  const ticketStats = [
    { type: 'Adult', sold: filteredTickets.filter(t => t.Ticket_Type === 'Adult').length },
    { type: 'Child', sold: filteredTickets.filter(t => t.Ticket_Type === 'Child').length },
    { type: 'Senior', sold: filteredTickets.filter(t => t.Ticket_Type === 'Senior').length },
    { type: 'Student', sold: filteredTickets.filter(t => t.Ticket_Type === 'Student').length },
  ];

  const handleDeleteEmployee = (emp: Employee) => {
    // Check if employee is a supervisor
    const supervisedZone = allLocations.find(loc => loc.Supervisor_ID === emp.Employee_ID);
    if (supervisedZone) {
      // Remove supervisor assignment
      setAllLocations(allLocations.map(loc => 
        loc.Supervisor_ID === emp.Employee_ID ? { ...loc, Supervisor_ID: null } : loc
      ));
    }
    
    setAllEmployees(allEmployees.filter(e => e.Employee_ID !== emp.Employee_ID));
    setDeleteConfirmEmployee(null);
  };

  const handleAddEmployee = (formData: any) => {
    const newEmployee: Employee = {
      Employee_ID: Math.max(...allEmployees.map(e => e.Employee_ID)) + 1,
      First_Name: formData.firstName,
      Last_Name: formData.lastName,
      Birthdate: formData.birthdate,
      Sex: formData.sex,
      Job_ID: parseInt(formData.jobId),
      Salary: salaries[parseInt(formData.jobId) as keyof typeof salaries],
      Email: formData.email,
      Password: 'password123',
      Address: formData.address,
      Supervisor_ID: null,
      Job_Title: jobTitles.find(j => j.Job_ID === parseInt(formData.jobId))
    };
    
    setAllEmployees([...allEmployees, newEmployee]);
    setIsAddEmployeeOpen(false);
  };

  const handleAssignSupervisor = (zoneId: number, supervisorId: number | null) => {
    // Update location with new supervisor
    setAllLocations(allLocations.map(loc => 
      loc.Location_ID === zoneId ? { 
        ...loc, 
        Supervisor_ID: supervisorId
      } : loc
    ));
    
    // Update employee salaries based on supervisor status
    setAllEmployees(allEmployees.map(emp => {
      const isSupervisor = supervisorId === emp.Employee_ID || 
                          allLocations.some(loc => loc.Location_ID !== zoneId && loc.Supervisor_ID === emp.Employee_ID);
      const wasSupervisorOfThisZone = selectedZone?.Supervisor_ID === emp.Employee_ID;
      
      if (supervisorId === emp.Employee_ID) {
        // This employee is being assigned as supervisor, give them supervisor salary
        return { ...emp, Salary: salaries[2] };
      } else if (wasSupervisorOfThisZone && !allLocations.some(loc => loc.Location_ID !== zoneId && loc.Supervisor_ID === emp.Employee_ID)) {
        // This employee was removed as supervisor and is not supervising other zones, revert to their job salary
        return { ...emp, Salary: salaries[emp.Job_ID as keyof typeof salaries] || emp.Salary };
      }
      return emp;
    }));
    
    setIsManageZoneOpen(false);
    setSelectedZone(null);
    setSupervisorSearch('');
  };

  const handleSalarySave = () => {
    // Update actual salary state
    setSalaries({ ...tempSalaries });
    
    // Update all employees with new salaries
    setAllEmployees(allEmployees.map(emp => {
      // Check if this employee is a supervisor of any zone
      const isSupervisor = allLocations.some(loc => loc.Supervisor_ID === emp.Employee_ID);
      
      if (isSupervisor) {
        // Employee is a supervisor, use supervisor salary
        return { ...emp, Salary: tempSalaries[2] };
      } else {
        // Use the salary for their job type
        return { ...emp, Salary: tempSalaries[emp.Job_ID as keyof typeof tempSalaries] || emp.Salary };
      }
    }));
    
    setIsSalaryManagementOpen(false);
    toast.success('Salaries updated successfully!');
  };

  const handleSalaryDialogOpen = (open: boolean) => {
    if (open) {
      // Reset temp salaries to current salaries when opening
      setTempSalaries({ ...salaries });
    }
    setIsSalaryManagementOpen(open);
  };

  const handlePricingDialogOpen = (open: boolean) => {
    if (open) {
      // Reset temp prices to current prices when opening
      setTempTicketPrices({ ...ticketPrices });
      setTempMembershipPrice(membershipPrice);
    }
    setIsPricingManagementOpen(open);
  };

  const handlePricingSave = () => {
    // Update actual pricing state using context
    updateTicketPrices(tempTicketPrices);
    updateMembershipPrice(tempMembershipPrice);
    
    setIsPricingManagementOpen(false);
    toast.success('Pricing updated successfully!');
  };

  const handleAddAnimal = (formData: any) => {
    const newAnimalId = Math.max(...animalList.map(a => a.Animal_ID)) + 1;
    const enclosureId = parseInt(formData.enclosureId);
    const enclosure = enclosures.find(e => e.Enclosure_ID === enclosureId);
    
    const newAnimal: Animal = {
      Animal_ID: newAnimalId,
      Animal_Name: formData.name,
      Species: formData.species,
      Gender: formData.gender,
      Weight: parseFloat(formData.weight),
      Birthday: formData.birthday,
      Health_Status: formData.healthStatus || 'Good',
      Is_Vaccinated: formData.isVaccinated || false,
      Enclosure_ID: enclosureId,
      Enclosure: enclosure
    };
    
    addAnimal(newAnimal);
    setIsAddAnimalOpen(false);
    toast.success(`Successfully added ${formData.name} to ${enclosure?.Enclosure_Name || 'the zoo'}!`);
  };

  const handleUpdateAnimal = (formData: any) => {
    if (!editingAnimal) return;
    
    const enclosureId = parseInt(formData.enclosureId);
    const enclosure = enclosures.find(e => e.Enclosure_ID === enclosureId);
    
    updateAnimal(editingAnimal.Animal_ID, {
      Animal_Name: formData.name,
      Species: formData.species,
      Gender: formData.gender,
      Weight: parseFloat(formData.weight),
      Birthday: formData.birthday,
      Health_Status: formData.healthStatus,
      Is_Vaccinated: formData.isVaccinated,
      Enclosure_ID: enclosureId,
      Enclosure: enclosure
    });
    setEditingAnimal(null);
    toast.success(`Successfully updated ${formData.name}'s information!`);
  };

  const handleDeleteAnimal = (animal: Animal) => {
    deleteAnimal(animal.Animal_ID);
    setDeleteConfirmAnimal(null);
    toast.success(`Successfully removed ${animal.Animal_Name} from the zoo.`);
  };

  const getRangeLabel = () => {
    switch (revenueRange) {
      case 'today': return 'Today';
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case 'year': return 'Past Year';
      case 'all': return 'All Time';
    }
  };

  // Get employees in a specific zone
  const getZoneEmployees = (location: Location) => {
    return allEmployees.filter(emp => {
      if (location.Supervisor_ID === emp.Employee_ID) return true;
      const supervisor = allEmployees.find(e => e.Employee_ID === emp.Supervisor_ID);
      if (supervisor && location.Supervisor_ID === supervisor.Employee_ID) return true;
      return false;
    });
  };

  // Filter employees for supervisor selection
  const filteredEmployeesForSupervisor = useMemo(() => {
    // Get all employee IDs that are currently supervisors
    const currentSupervisorIds = allLocations.map(loc => loc.Supervisor_ID).filter(id => id !== null);
    
    // Filter out employees who are already supervisors
    const availableEmployees = allEmployees.filter(emp => !currentSupervisorIds.includes(emp.Employee_ID));
    
    if (!supervisorSearch) return availableEmployees;
    const search = supervisorSearch.toLowerCase();
    return availableEmployees.filter(emp => 
      emp.First_Name.toLowerCase().includes(search) ||
      emp.Last_Name.toLowerCase().includes(search) ||
      emp.Employee_ID.toString().includes(search)
    );
  }, [allEmployees, allLocations, supervisorSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ZooLogo size={40} />
              <div>
                <h1 className="font-semibold text-xl">Admin Portal</h1>
                <p className="text-sm text-gray-600">WildWood Zoo Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Welcome, Administrator</p>
                <p className="text-sm text-gray-600">Full System Access</p>
              </div>
              <Button variant="outline" onClick={() => onNavigate('home')} className="border-teal-600 text-teal-600 cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                View Public Site
              </Button>
              <Button variant="outline" onClick={onLogout} className="border-green-600 text-green-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 space-y-8">
            {/* Revenue Range Filter */}
            <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">📊 Overview Statistics</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 italic">Last Updated: {formatLastUpdated()}</span>
              <Calendar className="h-5 w-5 text-gray-600" />
              <Select value={revenueRange} onValueChange={(value: any) => setRevenueRange(value)}>
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Showing revenue for: <Badge className="bg-green-600 text-white ml-1">{getRangeLabel()}</Badge>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-green-600">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold text-green-600">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-teal-600">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <PawPrint className="h-8 w-8 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Animals</p>
                    <p className="text-2xl font-semibold text-teal-600">{formatNumber(totalAnimals)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-600">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Staff</p>
                    <p className="text-2xl font-semibold text-yellow-600">{formatNumber(totalEmployees)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Memberships</p>
                    <p className="text-2xl font-semibold text-purple-600">{formatNumber(activeMemb)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section id="revenue">
          <h2 className="text-2xl mb-6">💰 Revenue Breakdown</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {revenueBreakdown.map((stat) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={stat.category} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center mb-3">
                        <IconComponent className={`h-10 w-10 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h3 className="font-medium text-center mb-2">{stat.category}</h3>
                      <p className="text-2xl font-semibold text-center text-green-600">${stat.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ticket Sales */}
        <section id="tickets">
          <h2 className="text-2xl mb-6">🎫 Ticket Sales</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ticketStats.map((stat) => (
                  <div key={stat.type} className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{stat.type}</p>
                    <p className="text-2xl font-semibold text-green-600">{formatNumber(stat.sold)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Management */}
        <section id="pricing">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">💳 Pricing Management</h2>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              onClick={() => handlePricingDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Prices
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ticket Prices */}
                <div>
                  <h3 className="font-semibold mb-3 text-green-700">Day Pass Tickets</h3>
                  <div className="space-y-2">
                    {Object.entries(ticketPrices).map(([type, price]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-gray-700">{type}</span>
                        <span className="font-semibold text-green-600">${price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Membership Price */}
                <div>
                  <h3 className="font-semibold mb-3 text-purple-700">Annual Membership</h3>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Annual Membership</span>
                      <span className="font-semibold text-purple-600 text-xl">${membershipPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Unlimited year-round access + benefits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Management Dialog */}
          <Dialog open={isPricingManagementOpen} onOpenChange={handlePricingDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Ticket & Membership Prices</DialogTitle>
                <DialogDescription>
                  Update pricing for tickets and memberships. Changes will be reflected immediately.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Ticket Prices */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-green-700">Day Pass Ticket Prices</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(tempTicketPrices).map(([type, price]) => (
                      <div key={type} className="space-y-2">
                        <Label htmlFor={`ticket-${type}`} className="text-gray-700">{type} Ticket</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">$</span>
                          <Input
                            id={`ticket-${type}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setTempTicketPrices(prev => ({ 
                              ...prev, 
                              [type]: parseFloat(e.target.value) || 0 
                            }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Membership Price */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-purple-700">Annual Membership Price</h3>
                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="membership-price" className="text-gray-700">Annual Membership</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">$</span>
                      <Input
                        id="membership-price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={tempMembershipPrice}
                        onChange={(e) => setTempMembershipPrice(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Unlimited year-round access + member benefits</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handlePricingSave}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Revenue Analytics Charts */}
        <section id="analytics">
          <h2 className="text-2xl mb-6">📈 Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Ticket Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ticketStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis allowDecimals={false} label={{ value: 'Amount', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sold" fill="#4CAF50" name="Tickets Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown.map(item => ({ name: item.category, value: item.amount }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4CAF50" />
                      <Cell fill="#9C27B0" />
                      <Cell fill="#2196F3" />
                      <Cell fill="#FF9800" />
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Zone Overview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">🗺️ Zone Overview</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allLocations.map((location) => {
                  const supervisor = allEmployees.find(e => e.Employee_ID === location.Supervisor_ID);
                  const zoneEmployees = getZoneEmployees(location);
                  return (
                    <div key={location.Zone} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Zone {location.Zone}</h3>
                        <Badge className="bg-teal-600">{location.Zone}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{location.Location_Description}</p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Supervisor:</span>{' '}
                        {supervisor ? `${supervisor.First_Name} ${supervisor.Last_Name}` : 'Unassigned'}
                      </p>
                      <p className="text-sm mb-3">
                        <span className="font-medium">Employees:</span> {zoneEmployees.length}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 cursor-pointer"
                          onClick={() => setViewZoneEmployees(location)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer"
                          onClick={() => {
                            setSelectedZone(location);
                            setIsManageZoneOpen(true);
                            setSupervisorSearch('');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Supervisor
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* View Zone Employees Dialog */}
          <Dialog open={viewZoneEmployees !== null} onOpenChange={() => setViewZoneEmployees(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Zone {viewZoneEmployees?.Zone} Employees</DialogTitle>
                <DialogDescription>
                  {viewZoneEmployees?.Location_Description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[500px] pr-4">
                <div className="space-y-3">
                  {viewZoneEmployees && getZoneEmployees(viewZoneEmployees).length > 0 ? (
                    getZoneEmployees(viewZoneEmployees).map((emp) => (
                      <div key={emp.Employee_ID} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{emp.Last_Name}, {emp.First_Name}</p>
                            <p className="text-sm text-gray-600">{emp.Job_Title?.Title}</p>
                            <p className="text-sm text-gray-600">ID: {emp.Employee_ID}</p>
                          </div>
                          <Badge className="bg-teal-100 text-teal-800">
                            {viewZoneEmployees.Supervisor_ID === emp.Employee_ID ? 'Supervisor' : 'Staff'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No employees assigned to this zone
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </section>

        {/* Salary Management */}
        <section id="salary">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">💵 Salary Management</h2>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => handleSalaryDialogOpen(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Manage Salaries
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {jobTitles.filter(j => j.Job_ID !== 1).map((job) => {
                  const avgSalary = salaries[job.Job_ID as keyof typeof salaries] || 0;
                  const displayTitle = job.Job_ID === 2 ? 'Supervisor' : job.Title;
                  return (
                    <div key={job.Job_ID} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium mb-2">{displayTitle}</h3>
                      <p className="text-2xl font-semibold text-blue-600 mb-1">${avgSalary.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Salary Management Dialog */}
          <Dialog open={isSalaryManagementOpen} onOpenChange={handleSalaryDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Employee Salaries</DialogTitle>
                <DialogDescription>
                  Update salaries for each job type. Changes will apply to all employees in that role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {jobTitles.filter(j => j.Job_ID !== 1).map((job) => {
                  const displayTitle = job.Job_ID === 2 ? 'Supervisor' : job.Title;
                  const displayDescription = job.Job_ID === 2 ? 'Zone supervision and operations' : job.Description;
                  return (
                    <div key={job.Job_ID} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{displayTitle}</h3>
                        <p className="text-sm text-gray-600">{displayDescription}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          step="1000"
                          value={tempSalaries[job.Job_ID as keyof typeof tempSalaries] || 0}
                          onChange={(e) => setTempSalaries(prev => ({ 
                            ...prev, 
                            [job.Job_ID]: parseFloat(e.target.value) || 0 
                          }))}
                          className="w-32"
                        />
                        <span className="text-gray-600">$/year</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSalarySave}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Employee Management */}
        <section id="employees">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">👥 Staff Management</h2>
            <AddEmployeeDialog 
              isOpen={isAddEmployeeOpen}
              onOpenChange={setIsAddEmployeeOpen}
              onAdd={handleAddEmployee}
              allEmployees={allEmployees}
              salaries={salaries}
            />
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-4">Total Employees: {allEmployees.length}</p>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {sortedEmployees.map((emp) => (
                    <div key={emp.Employee_ID} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="font-medium text-lg">{emp.Last_Name}, {emp.First_Name}</p>
                          <Badge className="bg-green-100 text-green-800">{emp.Job_Title?.Title}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span> {emp.Email}
                          </div>
                          <div>
                            <span className="font-medium">Employee ID:</span> {emp.Employee_ID}
                          </div>
                          <div>
                            <span className="font-medium">Zone:</span> {getEmployeeZone(emp)}
                          </div>
                          <div>
                            <span className="font-medium">Birthdate:</span> {formatDate(emp.Birthdate)}
                          </div>
                          <div>
                            <span className="font-medium">Sex:</span> {emp.Sex}
                          </div>
                          <div>
                            <span className="font-medium">Salary:</span> ${emp.Salary.toLocaleString()}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Address:</span> {emp.Address}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteConfirmEmployee(emp)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        {/* Animal Management */}
        <section id="animals">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">🐾 Animal Management</h2>
            <AddAnimalDialog 
              isOpen={isAddAnimalOpen}
              onOpenChange={setIsAddAnimalOpen}
              onAdd={handleAddAnimal}
              enclosures={enclosures}
            />
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-4">Manage zoo animals and their habitats</p>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {animalList.map((animal, index) => {
                    const enclosure = enclosures.find(e => e.Enclosure_ID === animal.Enclosure_ID);
                    // Generate a mock date added (based on animal ID for consistency)
                    const daysAgo = (animal.Animal_ID * 13) % 365; // Pseudo-random but consistent
                    const dateAdded = new Date();
                    dateAdded.setDate(dateAdded.getDate() - daysAgo);
                    const dateAddedString = formatDate(dateAdded.toISOString().split('T')[0]);
                    
                    return (
                      <div key={animal.Animal_ID} className="p-4 bg-teal-50 rounded-lg border border-teal-200 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white flex-shrink-0">
                            <PawPrint className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{animal.Animal_Name}</p>
                            <p className="text-sm text-gray-600">
                              {animal.Species} • {animal.Gender === 'M' ? 'Male' : animal.Gender === 'F' ? 'Female' : 'Unknown'} • ID: {animal.Animal_ID}
                            </p>
                            <p className="text-xs text-gray-500">
                              Weight: {animal.Weight} lbs • Born: {formatDate(animal.Birthday)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Habitat: {enclosure?.Enclosure_Name || 'Unknown'} • Added: {dateAddedString}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100 cursor-pointer flex-shrink-0"
                          onClick={() => setEditingAnimal(animal)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
        
        {/* Zone Supervisor Assignment Dialog */}
        <Dialog open={isManageZoneOpen} onOpenChange={(open) => {
          setIsManageZoneOpen(open);
          if (!open) setSupervisorSearch('');
        }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Manage Zone Supervisor</DialogTitle>
                <DialogDescription>
                  {selectedZone && `Select a supervisor for Zone ${selectedZone.Zone}: ${selectedZone.Location_Description}`}
                </DialogDescription>
              </DialogHeader>
              
              {/* Current Supervisor Display */}
              {selectedZone && (() => {
                const currentSupervisor = allEmployees.find(e => e.Employee_ID === selectedZone.Supervisor_ID);
                return currentSupervisor ? (
                  <div className="p-4 bg-purple-100 border-2 border-purple-300 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Supervisor</p>
                        <p className="font-medium text-lg">{currentSupervisor.Last_Name}, {currentSupervisor.First_Name}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
                          <span>ID: {currentSupervisor.Employee_ID}</span>
                          <span>Sex: {currentSupervisor.Sex}</span>
                          <span>DOB: {formatDate(currentSupervisor.Birthdate)}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-red-50 border-red-300 text-red-600 hover:bg-red-100 cursor-pointer"
                        onClick={() => handleAssignSupervisor(selectedZone.Location_ID, null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                    <p className="text-gray-600 text-center">No supervisor currently assigned</p>
                  </div>
                );
              })()}
              
              {/* Search Bar */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or ID..."
                  value={supervisorSearch}
                  onChange={(e) => setSupervisorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-2">
                  {/* Employee List */}
                  <p className="text-sm text-gray-600 mb-2 px-1">Select new supervisor:</p>
                  {filteredEmployeesForSupervisor.map((employee) => (
                    <button
                      key={employee.Employee_ID}
                      className="w-full p-4 border rounded-lg text-left hover:bg-purple-50 transition-colors cursor-pointer"
                      onClick={() => selectedZone && handleAssignSupervisor(selectedZone.Location_ID, employee.Employee_ID)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium flex-shrink-0">{employee.Last_Name}, {employee.First_Name}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>ID: {employee.Employee_ID}</span>
                          <span>Sex: {employee.Sex}</span>
                          <span>DOB: {formatDate(employee.Birthdate)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {filteredEmployeesForSupervisor.length === 0 && supervisorSearch && (
                    <div className="text-center py-8 text-gray-500">
                      No employees found matching "{supervisorSearch}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmEmployee !== null} onOpenChange={() => setDeleteConfirmEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteConfirmEmployee?.First_Name} {deleteConfirmEmployee?.Last_Name}</strong> from the system? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmEmployee && handleDeleteEmployee(deleteConfirmEmployee)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Animal Dialog */}
      <EditAnimalDialog
        animal={editingAnimal}
        isOpen={editingAnimal !== null}
        onOpenChange={(open: boolean) => !open && setEditingAnimal(null)}
        onUpdate={handleUpdateAnimal}
        onDelete={(animal: Animal) => {
          setEditingAnimal(null);
          setDeleteConfirmAnimal(animal);
        }}
        enclosures={enclosures}
      />

      {/* Delete Animal Confirmation Dialog */}
      <AlertDialog open={deleteConfirmAnimal !== null} onOpenChange={() => setDeleteConfirmAnimal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Animal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteConfirmAnimal?.Animal_Name}</strong> ({deleteConfirmAnimal?.Species}) from the zoo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmAnimal && handleDeleteAnimal(deleteConfirmAnimal)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <PawPrint className="h-4 w-4 mr-2" />
              Delete Animal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}

// Add Employee Dialog Component
function AddEmployeeDialog({ isOpen, onOpenChange, onAdd, allEmployees, salaries }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    sex: 'M',
    jobId: '3',
    email: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      firstName: '',
      lastName: '',
      birthdate: '',
      sex: 'M',
      jobId: '3',
      email: '',
      address: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to the WildWood Zoo staff. Salary will be set based on job type.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="jobId">Job Title *</Label>
              <Select value={formData.jobId} onValueChange={(value) => setFormData({...formData, jobId: value})}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTitles.filter(j => j.Job_ID !== 1).map(job => (
                    <SelectItem key={job.Job_ID} value={job.Job_ID.toString()}>
                      {job.Title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthdate">Birthdate *</Label>
                <Input 
                  id="birthdate" 
                  type="date"
                  value={formData.birthdate} 
                  onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex *</Label>
                <Select value={formData.sex} onValueChange={(value) => setFormData({...formData, sex: value})}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input 
                id="address" 
                placeholder="123 Main St, City, State ZIP"
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 cursor-pointer">
              Add Employee
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Add Animal Dialog Component
function AddAnimalDialog({ isOpen, onOpenChange, onAdd, enclosures }: any) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    gender: 'M',
    weight: '',
    birthday: '',
    enclosureId: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      species: '',
      gender: 'M',
      weight: '',
      birthday: '',
      enclosureId: '1'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
          <DialogDescription>
            Add a new animal to the WildWood Zoo collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animalName">Animal Name *</Label>
              <Input 
                id="animalName" 
                placeholder="e.g., Luna"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="species">Species *</Label>
              <Input 
                id="species" 
                placeholder="e.g., African Elephant"
                value={formData.species} 
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animalGender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="U">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">Weight (lbs) *</Label>
              <Input 
                id="weight" 
                type="number"
                step="0.1"
                placeholder="e.g., 250"
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthday">Birthday *</Label>
              <Input 
                id="birthday" 
                type="date"
                value={formData.birthday} 
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="enclosureId">Habitat *</Label>
              <Select value={formData.enclosureId} onValueChange={(value) => setFormData({...formData, enclosureId: value})}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc: Enclosure) => (
                    <SelectItem key={enc.Enclosure_ID} value={enc.Enclosure_ID.toString()}>
                      {enc.Enclosure_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
            Add Animal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Animal Dialog Component
function EditAnimalDialog({ animal, isOpen, onOpenChange, onUpdate, onDelete, enclosures }: any) {
  const [formData, setFormData] = useState({
    name: animal?.Animal_Name || '',
    species: animal?.Species || '',
    gender: animal?.Gender || 'M',
    weight: animal?.Weight?.toString() || '',
    birthday: animal?.Birthday || '',
    enclosureId: animal?.Enclosure_ID?.toString() || '1'
  });

  // Update form data when animal changes
  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.Animal_Name,
        species: animal.Species,
        gender: animal.Gender,
        weight: animal.Weight.toString(),
        birthday: animal.Birthday,
        enclosureId: animal.Enclosure_ID.toString()
      });
    }
  }, [animal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!animal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Animal</DialogTitle>
          <DialogDescription>
            Update information for {animal.Animal_Name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editAnimalName">Animal Name *</Label>
              <Input 
                id="editAnimalName" 
                placeholder="e.g., Luna"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="editSpecies">Species *</Label>
              <Input 
                id="editSpecies" 
                placeholder="e.g., African Elephant"
                value={formData.species} 
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editAnimalGender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="U">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editWeight">Weight (lbs) *</Label>
              <Input 
                id="editWeight" 
                type="number"
                step="0.1"
                placeholder="e.g., 250"
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editBirthday">Birthday *</Label>
              <Input 
                id="editBirthday" 
                type="date"
                value={formData.birthday} 
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="editEnclosureId">Habitat *</Label>
              <Select value={formData.enclosureId} onValueChange={(value) => setFormData({...formData, enclosureId: value})}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc: Enclosure) => (
                    <SelectItem key={enc.Enclosure_ID} value={enc.Enclosure_ID.toString()}>
                      {enc.Enclosure_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="bg-red-50 border-red-300 text-red-600 hover:bg-red-100 cursor-pointer"
              onClick={() => onDelete(animal)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Animal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}