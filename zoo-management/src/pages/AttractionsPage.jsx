import { useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  PawPrint,
  Squirrel,
  Rabbit,
  Bird,
  Utensils,
  IceCream,
  CupSoda,
  Pizza,
} from "lucide-react";
import { exhibitsAPI, activitiesAPI } from "../services/customerAPI";
import { getExhibitImage } from "../utils/imageMapping";
import { useOptimizedFetch } from "../hooks/useOptimizedFetch";
import { ExhibitCard } from "../components/ExhibitCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useHeroImage } from "../utils/heroImages";
import { preloadImages } from "../utils/imagePreloader";

export function AttractionsPage() {
  const heroImage = useHeroImage("attractions");

  // Optimized data fetching with caching
  const {
    data: exhibitsData,
    loading: exhibitsLoading,
    error: exhibitsError,
  } = useOptimizedFetch(
    "exhibits",
    () => exhibitsAPI.getAll(),
    { cacheTime: 5 * 60 * 1000 } // Cache for 5 minutes
  );

  const {
    data: activitiesData,
    loading: activitiesLoading,
    error: activitiesError,
  } = useOptimizedFetch("activities", () => activitiesAPI.getAll(), {
    cacheTime: 5 * 60 * 1000,
  });

  // Ensure we always have arrays (handle null/undefined from cache)
  const exhibits = exhibitsData || [];
  const activities = activitiesData || [];

  const loading = exhibitsLoading || activitiesLoading;
  const error = exhibitsError || activitiesError;

  // Memoize activities lookup - only recalculate when activities change
  const activitiesByExhibit = useMemo(() => {
    const map = new Map();
    activities.forEach((activity) => {
      const exhibitId = activity.Exhibit_ID;
      if (!map.has(exhibitId)) {
        map.set(exhibitId, []);
      }
      map.get(exhibitId).push(activity.Activity_Name);
    });
    return map;
  }, [activities]);

  // Memoize exhibits with their activities
  const exhibitsWithActivities = useMemo(() => {
    return exhibits.map((exhibit) => ({
      id: exhibit.Exhibit_ID,
      name: exhibit.exhibit_Name,
      description: exhibit.exhibit_Description,
      zone: exhibit.Zone_Name,
      imageUrl: getExhibitImage(exhibit),
      activities: activitiesByExhibit.get(exhibit.Exhibit_ID) || [],
    }));
  }, [exhibits, activitiesByExhibit]);

  // Preload exhibit images
  useEffect(() => {
    if (exhibitsWithActivities.length > 0) {
      const imageUrls = exhibitsWithActivities
        .map((exhibit) => exhibit.imageUrl)
        .filter(Boolean);

      if (imageUrls.length > 0) {
        // Preload first 8 images immediately (visible above fold)
        const priorityImages = imageUrls.slice(0, 8);
        const laterImages = imageUrls.slice(8);

        preloadImages(priorityImages);

        // Preload remaining images after a short delay
        if (laterImages.length > 0) {
          setTimeout(() => preloadImages(laterImages), 500);
        }
      }
    }
  }, [exhibitsWithActivities]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={heroImage}
            alt="Zoo Exhibits and Attractions"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(20, 83, 45, 0.55), rgba(6, 78, 59, 0.55))",
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl mb-4 drop-shadow-lg">Exhibits</h1>
          <p className="text-xl text-green-100 max-w-2xl drop-shadow-md">
            Explore our world-class habitats and discover amazing animals from
            every corner of the globe across 4 themed zones.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500">Loading exhibits...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-red-600 font-semibold mb-2">Connection Error</p>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      ) : exhibits.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-yellow-600 font-semibold mb-2">
              No Data Available
            </p>
            <p className="text-yellow-700">Unable to load exhibits data.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Exhibits Grid */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl mb-8 text-center">All Exhibits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exhibitsWithActivities.map((exhibit) => (
                  <ExhibitCard
                    key={exhibit.id}
                    exhibit={exhibit}
                    activities={exhibit.activities}
                  />
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
                    <div className="flex justify-center text-orange-600 mb-2">
                      <PawPrint size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Zone A</h3>
                    <p className="text-sm text-gray-600">African Savanna</p>
                    <p className="text-sm text-gray-600">Big Cat Territory</p>
                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Utensils size={14} /> Safari Grill
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center text-green-600 mb-2">
                      <Squirrel size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Zone B</h3>
                    <p className="text-sm text-gray-600">Primate Forest</p>
                    <p className="text-sm text-gray-600">Reptile House</p>
                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                      <IceCream size={14} /> Polar Cafe
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center text-yellow-600 mb-2">
                      <Rabbit size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Zone C</h3>
                    <p className="text-sm text-gray-600">Australian Outback</p>
                    <p className="text-sm text-gray-600">Tropical Rainforest</p>
                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                      <CupSoda size={14} /> Rainforest Refreshments
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center text-blue-600 mb-2">
                      <Bird size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Zone D</h3>
                    <p className="text-sm text-gray-600">Bird Sanctuary</p>
                    <p className="text-sm text-gray-600">
                      N. American Wilderness
                    </p>
                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Pizza size={14} /> Desert Diner
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
