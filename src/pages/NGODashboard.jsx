import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, Clock } from 'lucide-react';

export function NGODashboard() {
  const availableDonations = [
    {
      id: 1,
      type: "Fresh Produce",
      donor: "Metro Supermarket",
      quantity: "50kg",
      expiry: "24 hours",
      status: "Available",
    },
    {
      id: 2,
      type: "Bakery Items",
      donor: "Local Bakery",
      quantity: "30kg",
      expiry: "12 hours",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" /> Notifications
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Within 5km radius</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Total 150kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Served</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250+</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{donation.type}</h3>
                  <p className="text-sm text-muted-foreground">{donation.donor}</p>
                  <div className="flex gap-2 text-sm">
                    <span>{donation.quantity}</span>
                    <span>•</span>
                    <span>Expires in {donation.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={donation.status === "Available" ? "default" : "secondary"}>
                    {donation.status}
                  </Badge>
                  <Button variant="outline">View Details</Button>
                  {donation.status === "Available" && (
                    <Button>Claim</Button>
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