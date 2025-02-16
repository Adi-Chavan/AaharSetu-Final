import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy, Route, Clock } from 'lucide-react';

export function VolunteerPanel() {
  const deliveries = [
    {
      id: 1,
      pickup: "Metro Supermarket",
      dropoff: "St. Mary's Shelter",
      distance: "2.5 km",
      time: "30 mins",
      status: "Available",
      points: 50,
    },
    {
      id: 2,
      pickup: "Local Bakery",
      dropoff: "Community Center",
      distance: "1.8 km",
      time: "20 mins",
      status: "In Progress",
      points: 30,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
        <Button variant="outline">
          <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">Level 5 Volunteer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120kg</div>
            <p className="text-xs text-muted-foreground">Food delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Available Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <h3 className="font-semibold">{delivery.pickup}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{delivery.dropoff}</p>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{delivery.distance}</span>
                    <span>•</span>
                    <span>{delivery.time}</span>
                    <span>•</span>
                    <span>{delivery.points} points</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={delivery.status === "Available" ? "default" : "secondary"}>
                    {delivery.status}
                  </Badge>
                  {delivery.status === "Available" && (
                    <Button>Accept Delivery</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}