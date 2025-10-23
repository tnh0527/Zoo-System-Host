import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Crown, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    title: "Elephant Enrichment",
    day: "Daily",
    time: "2:00 PM"
  },
  {
    title: "Lion Feeding Time",
    day: "Daily",
    time: "11:00 AM"
  },
  {
    title: "Primate Playgroup",
    day: "Daily",
    time: "12:30 PM"
  },
  {
    title: "Reptile Discovery",
    day: "Daily",
    time: "1:00 PM"
  },
  {
    title: "Kangaroo Feeding",
    day: "Daily",
    time: "11:00 AM"
  },
  {
    title: "Bird Feeding",
    day: "Daily",
    time: "10:00 AM"
  },
  {
    title: "Flight Demonstration",
    day: "Daily",
    time: "12:00 PM"
  },
  {
    title: "Bear Country Talk",
    day: "Daily",
    time: "4:00 PM"
  }
];

const exhibits = [
  {
    name: "African Savanna",
    zone: "Zone A",
    description: "Home to elephants, giraffes, and zebras"
  },
  {
    name: "Big Cat Territory",
    zone: "Zone A",
    description: "Lions, tigers, and leopards"
  },
  {
    name: "Primate Forest",
    zone: "Zone B",
    description: "Gorillas, chimpanzees, and monkeys"
  },
  {
    name: "Reptile House",
    zone: "Zone B",
    description: "Snakes, lizards, and crocodiles"
  },
  {
    name: "Australian Outback",
    zone: "Zone C",
    description: "Kangaroos, koalas, and wallabies"
  },
  {
    name: "Tropical Rainforest",
    zone: "Zone C",
    description: "Exotic birds, sloths, and tree frogs"
  },
  {
    name: "Bird Sanctuary",
    zone: "Zone D",
    description: "Flamingos, eagles, and tropical birds"
  },
  {
    name: "North American Wilderness",
    zone: "Zone D",
    description: "Bears, wolves, and elk"
  }
];

const membershipBenefits = [
  "Unlimited zoo admission",
  "Exclusive member discounts",
  "Free parking",
  "Quarterly members newsletter"
];

interface CustomerHighlightsProps {
  onNavigate?: (page: 'tickets') => void;
}

export function CustomerHighlights({ onNavigate }: CustomerHighlightsProps) {
  const [eventsIndex, setEventsIndex] = useState(0);
  const [exhibitsIndex, setExhibitsIndex] = useState(0);
  
  const itemsPerPage = 3;
  
  const handleMembershipClick = () => {
    if (onNavigate) {
      onNavigate('tickets');
      setTimeout(() => {
        const membershipsSection = document.getElementById('memberships');
        if (membershipsSection) {
          membershipsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const nextEvents = () => {
    setEventsIndex((eventsIndex + 1) % upcomingEvents.length);
  };

  const prevEvents = () => {
    setEventsIndex(eventsIndex === 0 ? upcomingEvents.length - 1 : eventsIndex - 1);
  };

  const nextExhibits = () => {
    setExhibitsIndex((exhibitsIndex + 1) % exhibits.length);
  };

  const prevExhibits = () => {
    setExhibitsIndex(exhibitsIndex === 0 ? exhibits.length - 1 : exhibitsIndex - 1);
  };

  // Get visible items (3 consecutive items, wrapping around if needed)
  const getVisibleItems = (array: any[], startIndex: number) => {
    const items = [];
    for (let i = 0; i < itemsPerPage; i++) {
      items.push(array[(startIndex + i) % array.length]);
    }
    return items;
  };

  const visibleEvents = getVisibleItems(upcomingEvents, eventsIndex);
  const visibleExhibits = getVisibleItems(exhibits, exhibitsIndex);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss these exciting animal activities. All events are included with your admission ticket!
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={prevEvents}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
              aria-label="Previous events"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleEvents.map((event, index) => (
                <Card key={`${eventsIndex}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Calendar className="h-24 w-24 text-green-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.day} at {event.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <button
              onClick={nextEvents}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
              aria-label="Next events"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Exhibits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Exhibits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our amazing animal habitats from around the world.
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={prevExhibits}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
              aria-label="Previous exhibits"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleExhibits.map((exhibit, index) => (
                <Card key={`${exhibitsIndex}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                    {exhibit.image ? (
                      <img 
                        src={exhibit.image} 
                        alt={exhibit.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center">
                        <MapPin className="h-24 w-24 text-green-300" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{exhibit.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-600 mb-2">{exhibit.zone}</p>
                    <p className="text-gray-600 text-sm">{exhibit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <button
              onClick={nextExhibits}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
              aria-label="Next exhibits"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Membership Benefits */}
        <div className="bg-green-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl mb-4 text-green-800">Membership Benefits</h2>
            <p className="text-green-600 max-w-2xl mx-auto">
              Join our zoo family and enjoy exclusive benefits year-round.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Crown className="h-5 w-5 text-yellow-500 mr-3" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              onClick={handleMembershipClick}
            >
              Become a Member
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}