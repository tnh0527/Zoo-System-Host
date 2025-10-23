import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  ShieldCheck, 
  Heart, 
  Stethoscope, 
  User, 
  ShoppingBag, 
  Coffee,
  Calendar,
  ArrowRight
} from "lucide-react";

const roles = [
  {
    title: "Administrator",
    icon: ShieldCheck,
    description: "Full system access and management",
    color: "bg-green-500",
    link: "/admin"
  },
  {
    title: "Zookeeper",
    icon: Heart,
    description: "Animal care and habitat management",
    color: "bg-green-500",
    link: "/zookeeper"
  },
  {
    title: "Veterinarian",
    icon: Stethoscope,
    description: "Animal health and medical records",
    color: "bg-red-500",
    link: "/veterinarian"
  },
  {
    title: "Customer/Member",
    icon: User,
    description: "Memberships, tickets, and events",
    color: "bg-purple-500",
    link: "/customer"
  },
  {
    title: "Gift Shop Worker",
    icon: ShoppingBag,
    description: "Retail operations and inventory",
    color: "bg-yellow-500",
    link: "/giftshop"
  },
  {
    title: "Concession Worker",
    icon: Coffee,
    description: "Food service and concession stands",
    color: "bg-orange-500",
    link: "/concessions"
  },
  {
    title: "Event Coordinator",
    icon: Calendar,
    description: "Special events and programs",
    color: "bg-pink-500",
    link: "/events"
  }
];

export function RoleAccessGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Role-Based Quick Access</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the appropriate tools and features for your position.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.title} 
                className="hover:shadow-lg transition-shadow cursor-pointer group border-0 shadow-md"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  <div className="flex items-center justify-center text-green-600 group-hover:text-green-800">
                    <span className="mr-2">Access Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}