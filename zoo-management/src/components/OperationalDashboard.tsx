import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, MapPin } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { exhibits, exhibitActivities } from "../data/mockData";

// Get today's activities based on even/odd rotation
// 8 exhibits x 2 activities = 16 total activities
// On even days: show Activity_Order 1 (8 activities)
// On odd days: show Activity_Order 2 (8 activities)
const getTodaysSchedule = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  
  // Even days: Activity_Order 1, Odd days: Activity_Order 2
  const activityOrder = dayOfYear % 2 === 0 ? 1 : 2;
  
  // Get activities for today based on rotation
  const todaysActivities = exhibitActivities
    .filter(activity => activity.Activity_Order === activityOrder)
    .map(activity => {
      const exhibit = exhibits.find(e => e.Exhibit_ID === activity.Exhibit_ID);
      return {
        time: exhibit?.Display_Time || "10:00:00",
        activity: activity.Activity_Name,
        location: exhibit?.exhibit_Name || "Unknown Location",
        description: activity.Activity_Description
      };
    })
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(item => ({
      ...item,
      time: formatTime(item.time)
    }));
  
  return todaysActivities;
};

// Helper to format time from 24-hour to 12-hour format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export function OperationalDashboard() {
  const todaysSchedule = getTodaysSchedule();
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Today's Activities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out all the exciting activities and experiences happening today at the zoo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {todaysSchedule.map((item, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4 w-full">
                        <div className="min-w-[90px]">
                          <span className="font-medium text-green-700">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.activity}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
