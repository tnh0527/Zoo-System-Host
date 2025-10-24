import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  employeeRecords,
  purchases,
  tickets,
  memberships,
  locations,
  jobTitles,
  enclosures,
} from "../data/mockData";
import {
  LogOut,
  DollarSign,
  Users,
  Package,
  Coffee,
  Ticket,
  Crown,
  UserPlus,
  Trash2,
  Calendar,
  Eye,
  Edit,
  Search,
  Save,
  Home,
  Plus,
  PawPrint,
} from "lucide-react";
import { useData } from "../data/DataContext";
import { toast } from "sonner@2.0.3";
import { ZooLogo } from "../components/ZooLogo";
import { usePricing } from "../data/PricingContext";

export function AdminPortal({ user, onLogout, onNavigate }) {
  const {
    animals: animalList,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    items: giftShopItems,
    concessionItems: foodItems,
  } = useData();
  const {
    ticketPrices,
    membershipPrice,
    updateTicketPrices,
    updateMembershipPrice,
  } = usePricing();
  const [allEmployees, setAllEmployees] = useState(employeeRecords);
  const [allLocations, setAllLocations] = useState(locations);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isManageZoneOpen, setIsManageZoneOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState(null);
  const [revenueRange, setRevenueRange] = useState("all");
  const [viewZoneEmployees, setViewZoneEmployees] = useState(null);
  const [isSalaryManagementOpen, setIsSalaryManagementOpen] = useState(false);
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [deleteConfirmAnimal, setDeleteConfirmAnimal] = useState(null);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [lastUpdated] = useState(new Date());

  // Salary state for each job type (5 shared login roles)
  const [salaries, setSalaries] = useState({
    2: 72000, // Supervisor
    3: 72000, // Veterinarian
    4: 45000, // Zookeeper
    5: 32000, // Concession Worker
    6: 35000, // Gift Shop Worker
  });

  // Temporary salary state for editing
  const [tempSalaries, setTempSalaries] = useState({ ...salaries });

  // Pricing state for tickets and memberships
  const [isPricingManagementOpen, setIsPricingManagementOpen] = useState(false);
  const [tempTicketPrices, setTempTicketPrices] = useState({ ...ticketPrices });
  const [tempMembershipPrice, setTempMembershipPrice] =
    useState(membershipPrice);

  // Update supervisor salaries on mount and when locations change
  useEffect(() => {
    setAllEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        // Check if this employee is a supervisor of any zone
        const isSupervisor = allLocations.some(
          (loc) => loc.Supervisor_ID === emp.Employee_ID
        );

        if (isSupervisor) {
          // Employee is a supervisor, use supervisor salary
          return { ...emp, Salary: salaries[2] };
        }
        return emp;
      })
    );
  }, []); // Only run on mount

  // Helper function to filter data by date range
  const filterByDateRange = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (revenueRange) {
      case "today":
        return daysDiff === 0;
      case "week":
        return daysDiff >= 0 && daysDiff <= 7; // Include today and past 7 days
      case "month":
        return daysDiff >= 0 && daysDiff <= 30; // Include today and past 30 days
      case "year":
        return daysDiff >= 0 && daysDiff <= 365; // Include today and past 365 days
      case "all":
      default:
        return true;
    }
  };

  // Helper function to format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  // Helper function to format last updated time
  const formatLastUpdated = () => {
    const hours = lastUpdated.getHours();
    const minutes = String(lastUpdated.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  // Helper function to get employee zone
  const getEmployeeZone = (emp) => {
    // Check if employee is a supervisor of a zone
    const supervisedZone = allLocations.find(
      (loc) => loc.Supervisor_ID === emp.Employee_ID
    );
    if (supervisedZone) return `Zone ${supervisedZone.Zone} (Supervisor)`;

    // Otherwise, find zone by supervisor chain
    const supervisor = allEmployees.find(
      (e) => e.Employee_ID === emp.Supervisor_ID
    );
    if (supervisor) {
      const supZone = allLocations.find(
        (loc) => loc.Supervisor_ID === supervisor.Employee_ID
      );
      if (supZone) return `Zone ${supZone.Zone}`;
    }

    return "Not Assigned";
  };

  // Sort employees alphabetically by last name
  const sortedEmployees = useMemo(() => {
    return [...allEmployees].sort((a, b) =>
      a.Last_Name.localeCompare(b.Last_Name)
    );
  }, [allEmployees]);

  // Calculate statistics from database with date filtering
  const filteredPurchases = purchases.filter((p) =>
    filterByDateRange(p.Purchase_Date)
  );
  const filteredTickets = tickets.filter((t) => {
    const purchase = purchases.find((p) => p.Purchase_ID === t.Purchase_ID);
    return purchase && filterByDateRange(purchase.Purchase_Date);
  });
  const filteredMemberships = memberships.filter((m) =>
    filterByDateRange(m.Start_Date)
  );

  const ticketRevenue = filteredTickets.reduce(
    (sum, t) => sum + t.Price * t.Quantity,
    0
  );
  const membershipRevenue = filteredMemberships.reduce(
    (sum, m) => sum + m.Price,
    0
  );
  const giftShopRevenue =
    giftShopItems.reduce((sum, item) => sum + item.Price, 0) * 2.5;
  const foodRevenue =
    foodItems.reduce((sum, item) => sum + item.Price, 0) * 3.2;

  const totalRevenue =
    ticketRevenue + membershipRevenue + giftShopRevenue + foodRevenue;
  const totalAnimals = animalList.length;
  const totalEmployees = allEmployees.length;
  const activeMemb = memberships.filter((m) => m.Membership_Status).length;

  // Revenue Breakdown
  const revenueBreakdown = [
    {
      category: "Tickets",
      amount: ticketRevenue,
      color: "bg-green-600",
      icon: Ticket,
    },
    {
      category: "Memberships",
      amount: membershipRevenue,
      color: "bg-purple-600",
      icon: Crown,
    },
    {
      category: "Gift Shop",
      amount: giftShopRevenue,
      color: "bg-blue-600",
      icon: Package,
    },
    {
      category: "Food & Beverages",
      amount: foodRevenue,
      color: "bg-orange-600",
      icon: Coffee,
    },
  ];

  // Ticket stats
  const ticketStats = [
    {
      type: "Adult",
      sold: filteredTickets.filter((t) => t.Ticket_Type === "Adult").length,
    },
    {
      type: "Child",
      sold: filteredTickets.filter((t) => t.Ticket_Type === "Child").length,
    },
    {
      type: "Senior",
      sold: filteredTickets.filter((t) => t.Ticket_Type === "Senior").length,
    },
    {
      type: "Student",
      sold: filteredTickets.filter((t) => t.Ticket_Type === "Student").length,
    },
  ];

  const handleDeleteEmployee = (emp) => {
    // Check if employee is a supervisor
    const supervisedZone = allLocations.find(
      (loc) => loc.Supervisor_ID === emp.Employee_ID
    );
    if (supervisedZone) {
      // Remove supervisor assignment
      setAllLocations(
        allLocations.map((loc) =>
          loc.Supervisor_ID === emp.Employee_ID
            ? { ...loc, Supervisor_ID: null }
            : loc
        )
      );
    }

    setAllEmployees(
      allEmployees.filter((e) => e.Employee_ID !== emp.Employee_ID)
    );
    toast.success(`${emp.First_Name} ${emp.Last_Name} has been removed`);
    setDeleteConfirmEmployee(null);
  };

  const handleAddEmployee = (formData) => {
    const newEmployee = {
      Employee_ID: Math.max(...allEmployees.map((e) => e.Employee_ID), 0) + 1,
      First_Name: formData.firstName,
      Last_Name: formData.lastName,
      // Store both Job_ID (from mock data) and Position_ID for compatibility
      Job_ID: parseInt(formData.jobTitleId),
      Position_ID: parseInt(formData.jobTitleId),
      Supervisor_ID: formData.supervisorId
        ? parseInt(formData.supervisorId)
        : null,
      Salary: salaries[parseInt(formData.jobTitleId)] || 0,
      Hire_Date: formData.hireDate,
      Email: formData.email,
    };

    setAllEmployees([...allEmployees, newEmployee]);
    setIsAddEmployeeOpen(false);
    toast.success(`${formData.firstName} ${formData.lastName} has been added`);
  };

  const handleManageZone = (zone, supervisorId) => {
    setAllLocations(
      allLocations.map((loc) =>
        loc.Zone === zone.Zone
          ? {
              ...loc,
              Supervisor_ID: supervisorId ? parseInt(supervisorId) : null,
            }
          : loc
      )
    );

    // Update supervisor salary
    if (supervisorId) {
      setAllEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.Employee_ID === parseInt(supervisorId)
            ? { ...emp, Salary: salaries[2] }
            : emp
        )
      );
    }

    setIsManageZoneOpen(false);
    toast.success(`Zone ${zone.Zone} supervisor has been updated`);
  };

  const handleSaveSalaries = () => {
    setSalaries(tempSalaries);

    // Update all employee salaries based on their job titles
    setAllEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        // Check if employee is a supervisor
        const isSupervisor = allLocations.some(
          (loc) => loc.Supervisor_ID === emp.Employee_ID
        );

        if (isSupervisor) {
          // Employee is a supervisor, use supervisor salary
          return { ...emp, Salary: tempSalaries[2] };
        } else {
          // Not a supervisor, use their position's salary
          return {
            ...emp,
            Salary: tempSalaries[emp.Position_ID] || emp.Salary,
          };
        }
      })
    );

    setIsSalaryManagementOpen(false);
    toast.success("Salaries have been updated");
  };

  const handleCancelSalaryChanges = () => {
    setTempSalaries({ ...salaries });
    setIsSalaryManagementOpen(false);
  };

  const handleSavePricing = () => {
    updateTicketPrices(tempTicketPrices);
    updateMembershipPrice(tempMembershipPrice);
    setIsPricingManagementOpen(false);
    toast.success("Pricing has been updated");
  };

  const handleCancelPricingChanges = () => {
    setTempTicketPrices({ ...ticketPrices });
    setTempMembershipPrice(membershipPrice);
    setIsPricingManagementOpen(false);
  };

  const handleAddAnimal = (formData) => {
    const newAnimal = {
      Animal_ID: Math.max(...animalList.map((a) => a.Animal_ID), 0) + 1,
      Animal_Name: formData.name,
      Species: formData.species,
      Gender: formData.gender,
      Weight: parseFloat(formData.weight),
      Birthday: formData.birthday,
      Enclosure_ID: parseInt(formData.enclosureId),
    };

    addAnimal(newAnimal);
    setIsAddAnimalOpen(false);
    toast.success(`${formData.name} has been added to the zoo`);
  };

  const handleUpdateAnimal = (formData) => {
    if (!editingAnimal) return;

    const updatedAnimal = {
      ...editingAnimal,
      Animal_Name: formData.name,
      Species: formData.species,
      Gender: formData.gender,
      Weight: parseFloat(formData.weight),
      Birthday: formData.birthday,
      Enclosure_ID: parseInt(formData.enclosureId),
    };

    updateAnimal(updatedAnimal);
    setEditingAnimal(null);
    toast.success(`${formData.name} has been updated`);
  };

  const handleDeleteAnimal = (animal) => {
    deleteAnimal(animal.Animal_ID);
    setDeleteConfirmAnimal(null);
    setEditingAnimal(null);
    toast.success(`${animal.Animal_Name} has been removed from the zoo`);
  };

  // Pie chart data for revenue breakdown
  const pieData = revenueBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const COLORS = ["#16a34a", "#9333ea", "#2563eb", "#ea580c"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate("home")}
                className="text-white hover:bg-white/20 cursor-pointer"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Admin Portal</h1>
                <p className="text-teal-100">
                  Welcome, {user.First_Name} {user.Last_Name}
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-white hover:bg-white/20 cursor-pointer"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Last Updated Banner */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last updated: Today at {formatLastUpdated()}</span>
          </div>
          <div className="flex gap-2">
            <Select
              value={revenueRange}
              onValueChange={(value) => setRevenueRange(value)}
            >
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">
                    ${formatNumber(Math.round(totalRevenue))}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Members</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(activeMemb)}
                  </p>
                </div>
                <Crown className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Animals</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(totalAnimals)}
                  </p>
                </div>
                <PawPrint className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Employees</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(totalEmployees)}
                  </p>
                </div>
                <Users className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">
                        ${formatNumber(Math.round(item.amount))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${formatNumber(Math.round(value))}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Sales Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ticket Sales by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" fill="#16a34a" name="Tickets Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Employee Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Management
              </CardTitle>
              <Dialog
                open={isAddEmployeeOpen}
                onOpenChange={setIsAddEmployeeOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <AddEmployeeDialog
                  onAdd={handleAddEmployee}
                  employees={allEmployees}
                  jobTitles={jobTitles}
                  locations={allLocations}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {sortedEmployees.map((emp) => (
                    <div
                      key={emp.Employee_ID}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {emp.First_Name} {emp.Last_Name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {jobTitles.find(
                              (j) => j.Position_ID === emp.Position_ID
                            )?.Title || "Unknown"}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {getEmployeeZone(emp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Salary: ${formatNumber(emp.Salary)}/year
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmEmployee(emp)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => setIsSalaryManagementOpen(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Manage Salaries
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Zone Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {allLocations.map((zone) => {
                    const supervisor = allEmployees.find(
                      (e) => e.Employee_ID === zone.Supervisor_ID
                    );
                    const zoneEmployees = allEmployees.filter((e) => {
                      if (e.Employee_ID === zone.Supervisor_ID) return true;
                      const empSupervisor = allEmployees.find(
                        (s) => s.Employee_ID === e.Supervisor_ID
                      );
                      return (
                        empSupervisor &&
                        empSupervisor.Employee_ID === zone.Supervisor_ID
                      );
                    });

                    return (
                      <div
                        key={zone.Zone}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                              Zone {zone.Zone}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Supervisor:{" "}
                              {supervisor
                                ? `${supervisor.First_Name} ${supervisor.Last_Name}`
                                : "Unassigned"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Employees: {zoneEmployees.length}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewZoneEmployees(zone)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedZone(zone);
                                setIsManageZoneOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Animal Management Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              Animal Management
            </CardTitle>
            <Button
              className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
              onClick={() => setIsAddAnimalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animalList.map((animal) => {
                  const enclosure = enclosures.find(
                    (e) => e.Enclosure_ID === animal.Enclosure_ID
                  );
                  const age =
                    new Date().getFullYear() -
                    new Date(animal.Birthday).getFullYear();

                  return (
                    <Card
                      key={animal.Animal_ID}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                              {animal.Animal_Name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {animal.Species}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingAnimal(animal)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmAnimal(animal)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gender:</span>
                            <span className="font-medium">
                              {animal.Gender === "M"
                                ? "Male"
                                : animal.Gender === "F"
                                ? "Female"
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age:</span>
                            <span className="font-medium">{age} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">
                              {animal.Weight} lbs
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Habitat:</span>
                            <span className="font-medium">
                              {enclosure?.Enclosure_Name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ID:</span>
                            <span className="font-medium">
                              #{animal.Animal_ID}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pricing Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Management
            </CardTitle>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsPricingManagementOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Pricing
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Ticket Prices</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Adult Ticket:</span>
                    <span className="font-medium">
                      ${ticketPrices.adult.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Child Ticket:</span>
                    <span className="font-medium">
                      ${ticketPrices.child.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Senior Ticket:</span>
                    <span className="font-medium">
                      ${ticketPrices.senior.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Student Ticket:</span>
                    <span className="font-medium">
                      ${ticketPrices.student.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Membership Price</h4>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Annual Membership:</span>
                  <span className="font-medium">
                    ${membershipPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Employee Confirmation */}
      <AlertDialog
        open={deleteConfirmEmployee !== null}
        onOpenChange={() => setDeleteConfirmEmployee(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              {deleteConfirmEmployee?.First_Name}{" "}
              {deleteConfirmEmployee?.Last_Name} from the system? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirmEmployee &&
                handleDeleteEmployee(deleteConfirmEmployee)
              }
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Animal Confirmation */}
      <AlertDialog
        open={deleteConfirmAnimal !== null}
        onOpenChange={() => setDeleteConfirmAnimal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Animal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {deleteConfirmAnimal?.Animal_Name}{" "}
              from the zoo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirmAnimal && handleDeleteAnimal(deleteConfirmAnimal)
              }
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Zone Dialog */}
      <Dialog open={isManageZoneOpen} onOpenChange={setIsManageZoneOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Zone {selectedZone?.Zone}</DialogTitle>
            <DialogDescription>
              Assign or change the supervisor for this zone
            </DialogDescription>
          </DialogHeader>
          <ManageZoneForm
            zone={selectedZone}
            employees={allEmployees}
            onSave={handleManageZone}
            onCancel={() => setIsManageZoneOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Zone Employees Dialog */}
      <Dialog
        open={viewZoneEmployees !== null}
        onOpenChange={() => setViewZoneEmployees(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Zone {viewZoneEmployees?.Zone} Employees</DialogTitle>
            <DialogDescription>
              All employees working in this zone
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-3">
              {viewZoneEmployees &&
                allEmployees
                  .filter((e) => {
                    if (e.Employee_ID === viewZoneEmployees.Supervisor_ID)
                      return true;
                    const supervisor = allEmployees.find(
                      (s) => s.Employee_ID === e.Supervisor_ID
                    );
                    return (
                      supervisor &&
                      supervisor.Employee_ID === viewZoneEmployees.Supervisor_ID
                    );
                  })
                  .map((emp) => (
                    <div
                      key={emp.Employee_ID}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {emp.First_Name} {emp.Last_Name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {jobTitles.find(
                                (j) => j.Position_ID === emp.Position_ID
                              )?.Title || "Unknown"}
                            </Badge>
                            {emp.Employee_ID ===
                              viewZoneEmployees.Supervisor_ID && (
                              <Badge className="text-xs bg-teal-600">
                                Supervisor
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            ${formatNumber(emp.Salary)}/year
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Salary Management Dialog */}
      <Dialog
        open={isSalaryManagementOpen}
        onOpenChange={setIsSalaryManagementOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Salaries</DialogTitle>
            <DialogDescription>
              Adjust annual salary for each job role (affects all employees in
              that role)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries(tempSalaries).map(([positionId, salary]) => {
              const jobTitle = jobTitles.find(
                (j) => j.Position_ID === parseInt(positionId)
              );
              return (
                <div key={positionId}>
                  <Label
                    htmlFor={`salary-${positionId}`}
                    className="mb-2 block"
                  >
                    {jobTitle?.Title}
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      id={`salary-${positionId}`}
                      type="number"
                      value={salary}
                      onChange={(e) =>
                        setTempSalaries({
                          ...tempSalaries,
                          [positionId]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-gray-600 text-sm">/year</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveSalaries}
              className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelSalaryChanges}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Management Dialog */}
      <Dialog
        open={isPricingManagementOpen}
        onOpenChange={setIsPricingManagementOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Pricing</DialogTitle>
            <DialogDescription>
              Adjust ticket and membership prices
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-semibold mb-3">Ticket Prices</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="adult-ticket">Adult Ticket</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      id="adult-ticket"
                      type="number"
                      step="0.01"
                      value={tempTicketPrices.adult}
                      onChange={(e) =>
                        setTempTicketPrices({
                          ...tempTicketPrices,
                          adult: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="child-ticket">Child Ticket</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      id="child-ticket"
                      type="number"
                      step="0.01"
                      value={tempTicketPrices.child}
                      onChange={(e) =>
                        setTempTicketPrices({
                          ...tempTicketPrices,
                          child: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="senior-ticket">Senior Ticket</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      id="senior-ticket"
                      type="number"
                      step="0.01"
                      value={tempTicketPrices.senior}
                      onChange={(e) =>
                        setTempTicketPrices({
                          ...tempTicketPrices,
                          senior: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="student-ticket">Student Ticket</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      id="student-ticket"
                      type="number"
                      step="0.01"
                      value={tempTicketPrices.student}
                      onChange={(e) =>
                        setTempTicketPrices({
                          ...tempTicketPrices,
                          student: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Membership Price</h4>
              <div>
                <Label htmlFor="membership-price">Annual Membership</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">$</span>
                  <Input
                    id="membership-price"
                    type="number"
                    step="0.01"
                    value={tempMembershipPrice}
                    onChange={(e) =>
                      setTempMembershipPrice(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSavePricing}
              className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelPricingChanges}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Animal Dialog */}
      <AddAnimalDialog
        isOpen={isAddAnimalOpen}
        onOpenChange={setIsAddAnimalOpen}
        onAdd={handleAddAnimal}
        enclosures={enclosures}
      />

      {/* Edit Animal Dialog */}
      <EditAnimalDialog
        animal={editingAnimal}
        isOpen={editingAnimal !== null}
        onOpenChange={() => setEditingAnimal(null)}
        onUpdate={handleUpdateAnimal}
        onDelete={(animal) => {
          setEditingAnimal(null);
          setDeleteConfirmAnimal(animal);
        }}
        enclosures={enclosures}
      />
    </div>
  );
}

// Add Employee Dialog Component
function AddEmployeeDialog({ onAdd, employees, jobTitles, locations }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitleId: "4",
    supervisorId: "",
    hireDate: new Date().toISOString().split("T")[0],
    email: "",
  });

  const [supervisorSearch, setSupervisorSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      firstName: "",
      lastName: "",
      jobTitleId: "4",
      supervisorId: "",
      hireDate: new Date().toISOString().split("T")[0],
      email: "",
    });
    setSupervisorSearch("");
  };

  // Filter supervisors based on search
  const filteredSupervisors = employees.filter((emp) => {
    const isSupervisor = locations.some(
      (loc) => loc.Supervisor_ID === emp.Employee_ID
    );
    if (!isSupervisor) return false;

    const searchTerm = supervisorSearch.toLowerCase();
    return (
      emp.First_Name.toLowerCase().includes(searchTerm) ||
      emp.Last_Name.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogDescription>
          Enter the new employee's information below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Select
              value={formData.jobTitleId}
              onValueChange={(value) =>
                setFormData({ ...formData, jobTitleId: value })
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobTitles
                  .filter((j) => j.Job_ID !== 1)
                  .map((job) => (
                    <SelectItem key={job.Job_ID} value={String(job.Job_ID)}>
                      {job.Title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hireDate">Hire Date *</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) =>
                setFormData({ ...formData, hireDate: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="supervisor">Supervisor (Optional)</Label>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="supervisorSearch"
                placeholder="Search supervisors..."
                value={supervisorSearch}
                onChange={(e) => setSupervisorSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={formData.supervisorId}
              onValueChange={(value) =>
                setFormData({ ...formData, supervisorId: value })
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select a supervisor (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredSupervisors.map((sup) => {
                  const zone = locations.find(
                    (loc) => loc.Supervisor_ID === sup.Employee_ID
                  );
                  return (
                    <SelectItem
                      key={sup.Employee_ID}
                      value={sup.Employee_ID.toString()}
                    >
                      {sup.First_Name} {sup.Last_Name} (Zone {zone?.Zone})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
        >
          Add Employee
        </Button>
      </form>
    </DialogContent>
  );
}

// Manage Zone Form Component
function ManageZoneForm({ zone, employees, onSave, onCancel }) {
  const [supervisorId, setSupervisorId] = useState(
    zone?.Supervisor_ID?.toString() || ""
  );
  const [supervisorSearch, setSupervisorSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(zone, supervisorId);
  };

  // Filter available supervisors (employees with Position_ID 2)
  const availableSupervisors = employees.filter((emp) => {
    const searchTerm = supervisorSearch.toLowerCase();
    return (
      emp.Job_ID === 2 &&
      (emp.First_Name.toLowerCase().includes(searchTerm) ||
        emp.Last_Name.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="zoneSearch">Search Supervisors</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="zoneSearch"
            placeholder="Search by name..."
            value={supervisorSearch}
            onChange={(e) => setSupervisorSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="zoneSupervisor">Assign Supervisor</Label>
        <Select value={supervisorId} onValueChange={setSupervisorId}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select a supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {availableSupervisors.map((emp) => (
              <SelectItem
                key={emp.Employee_ID}
                value={emp.Employee_ID.toString()}
              >
                {emp.First_Name} {emp.Last_Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer"
        >
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Add Animal Dialog Component
function AddAnimalDialog({ isOpen, onOpenChange, onAdd, enclosures }) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    gender: "M",
    weight: "",
    birthday: "",
    enclosureId: "1",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      species: "",
      gender: "M",
      weight: "",
      birthday: "",
      enclosureId: "1",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
          <DialogDescription>
            Enter the new animal's information below.
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="species">Species *</Label>
              <Input
                id="species"
                placeholder="e.g., African Elephant"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animalGender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
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
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="enclosureId">Habitat *</Label>
              <Select
                value={formData.enclosureId}
                onValueChange={(value) =>
                  setFormData({ ...formData, enclosureId: value })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc) => (
                    <SelectItem
                      key={enc.Enclosure_ID}
                      value={enc.Enclosure_ID.toString()}
                    >
                      {enc.Enclosure_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
          >
            Add Animal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Animal Dialog Component
function EditAnimalDialog({
  animal,
  isOpen,
  onOpenChange,
  onUpdate,
  onDelete,
  enclosures,
}) {
  const [formData, setFormData] = useState({
    name: animal?.Animal_Name || "",
    species: animal?.Species || "",
    gender: animal?.Gender || "M",
    weight: animal?.Weight?.toString() || "",
    birthday: animal?.Birthday || "",
    enclosureId: animal?.Enclosure_ID?.toString() || "1",
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
        enclosureId: animal.Enclosure_ID.toString(),
      });
    }
  }, [animal]);

  const handleSubmit = (e) => {
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="editSpecies">Species *</Label>
              <Input
                id="editSpecies"
                placeholder="e.g., African Elephant"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editAnimalGender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
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
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="editEnclosureId">Habitat *</Label>
              <Select
                value={formData.enclosureId}
                onValueChange={(value) =>
                  setFormData({ ...formData, enclosureId: value })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc) => (
                    <SelectItem
                      key={enc.Enclosure_ID}
                      value={enc.Enclosure_ID.toString()}
                    >
                      {enc.Enclosure_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer"
            >
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
