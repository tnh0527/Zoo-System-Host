import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin } from "lucide-react";

const attractions = [
  {
    id: '1',
    name: 'African Savanna',
    zone: 'Zone A',
    description: 'Experience the vastness of the African plains with elephants, giraffes, and zebras roaming in our largest habitat.',
    highlights: ['Elephant Enrichment', 'Giraffe Encounter']
  },
  {
    id: '2',
    name: 'Big Cat Territory',
    zone: 'Zone A',
    description: 'Come face-to-face with the world\'s most magnificent big cats including tigers, lions, and leopards.',
    highlights: ['Lion Feeding Time', 'Big Cat Talk']
  },
  {
    id: '3',
    name: 'Primate Forest',
    zone: 'Zone B',
    description: 'Walk through a lush forest habitat and observe gorillas, chimpanzees, and orangutans in their natural environment.',
    highlights: ['Primate Playgroup', 'Monkey Mischief Show']
  },
  {
    id: '4',
    name: 'Reptile House',
    zone: 'Zone B',
    description: 'Discover the fascinating world of reptiles including snakes, lizards, crocodiles, and tortoises from around the globe.',
    highlights: ['Reptile Discovery', 'Feeding Demonstration']
  },
  {
    id: '5',
    name: 'Australian Outback',
    zone: 'Zone C',
    description: 'Meet kangaroos, koalas, and other unique wildlife from down under in this authentic outback habitat.',
    highlights: ['Kangaroo Feeding', 'Koala Keeper Talk']
  },
  {
    id: '6',
    name: 'Tropical Rainforest',
    zone: 'Zone C',
    description: 'Immerse yourself in a tropical paradise complete with exotic birds, sloths, and colorful tree frogs.',
    highlights: ['Bird Feeding', 'Rainforest Tour']
  },
  {
    id: '7',
    name: 'Bird Sanctuary',
    zone: 'Zone D',
    description: 'A peaceful aviary showcasing flamingos, eagles, and other magnificent birds from various ecosystems.',
    highlights: ['Flight Demonstration', 'Flamingo Talk']
  },
  {
    id: '8',
    name: 'North American Wilderness',
    zone: 'Zone D',
    description: 'Explore the rugged beauty of North America with grizzly bears, wolves, and elk in their natural habitat.',
    highlights: ['Bear Country Talk', 'Wolf Howl']
  }
];

export function AttractionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-4">Exhibits</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Explore our world-class habitats and discover amazing animals from every corner of the globe across 4 themed zones.
          </p>
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl mb-8 text-center">All Exhibits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attractions.map((attraction) => (
              <Card key={attraction.id} className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                  {attraction.image ? (
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                      <MapPin className="h-20 w-20 text-green-300" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{attraction.name}</span>
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 w-fit">{attraction.zone}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{attraction.description}</p>
                  
                  <div>
                    <p className="font-medium text-gray-900 mb-2 text-sm">Featured Activities:</p>
                    <ul className="space-y-1">
                      {attraction.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Zone Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl mb-8 text-center">Zoo Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl text-orange-600 mb-2">🦁</div>
                <h3 className="text-xl font-semibold mb-2">Zone A</h3>
                <p className="text-sm text-gray-600">African Savanna</p>
                <p className="text-sm text-gray-600">Big Cat Territory</p>
                <div className="mt-4 text-xs text-gray-500">🍔 Safari Grill</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl text-green-600 mb-2">🦍</div>
                <h3 className="text-xl font-semibold mb-2">Zone B</h3>
                <p className="text-sm text-gray-600">Primate Forest</p>
                <p className="text-sm text-gray-600">Reptile House</p>
                <div className="mt-4 text-xs text-gray-500">🍦 Polar Cafe</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl text-yellow-600 mb-2">🦘</div>
                <h3 className="text-xl font-semibold mb-2">Zone C</h3>
                <p className="text-sm text-gray-600">Australian Outback</p>
                <p className="text-sm text-gray-600">Tropical Rainforest</p>
                <div className="mt-4 text-xs text-gray-500">🥤 Rainforest Refreshments</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl text-blue-600 mb-2">🦅</div>
                <h3 className="text-xl font-semibold mb-2">Zone D</h3>
                <p className="text-sm text-gray-600">Bird Sanctuary</p>
                <p className="text-sm text-gray-600">N. American Wilderness</p>
                <div className="mt-4 text-xs text-gray-500">🍕 Desert Diner</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}