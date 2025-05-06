
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar as CalendarIcon, Truck, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ActionItem, DayData, generateActions, generateMonthData } from "@/lib/data-service";
import { format, isSameDay } from "date-fns";

const Dashboard = () => {
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMonthData(today);
      setMonthData(data);
      setActions(generateActions(data));
      setIsLoading(false);
    }, 500);
  }, []);

  const todayData = monthData.find(day => isSameDay(day.date, today));
  const todayActions = actions.filter(action => isSameDay(action.date, today));
  const upcomingActions = actions.filter(action => !isSameDay(action.date, today) && !action.completed);

  // Calculate some summary stats
  const totalItems = monthData.reduce((acc, day) => acc + day.items, 0);
  const totalStaff = monthData.reduce((acc, day) => acc + day.staffNeeded, 0);
  const totalTrucks = monthData.reduce((acc, day) => acc + day.trucksNeeded, 0);
  const highDays = monthData.filter(day => day.tag === 'high').length;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Lost items management and resource planning for Delhi Metro
          </p>
        </div>
        <Link to="/calendar">
          <Button>
            Open Calendar <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lost Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Forecast for {format(today, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Required</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Person-days this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transport Required</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : totalTrucks}</div>
            <p className="text-xs text-muted-foreground">
              Truck-days this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Volume Days</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : highDays}</div>
            <p className="text-xs text-muted-foreground">
              Days requiring extra resources
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
              <CardDescription>
                {format(today, "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading today's data...</p>
                </div>
              ) : todayData ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className={`p-4 rounded-lg ${
                    todayData.tag === 'low' ? 'resource-low' : 
                    todayData.tag === 'medium' ? 'resource-medium' : 'resource-high'
                  }`}>
                    <h3 className="font-semibold">Lost Items Forecast</h3>
                    <p className="text-3xl font-bold">{todayData.items}</p>
                    <p className="text-sm mt-1">{todayData.notes}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-semibold">Staff Required</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <p className="text-3xl font-bold">{todayData.staffNeeded}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-semibold">Trucks Required</h3>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <p className="text-3xl font-bold">{todayData.trucksNeeded}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No data available for today</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Actions</CardTitle>
              <CardDescription>
                Tasks that need to be completed today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <p>Loading actions...</p>
                </div>
              ) : todayActions.length > 0 ? (
                <div className="space-y-4">
                  {todayActions.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Staff: {action.staffAssigned} | Trucks: {action.trucksAssigned}
                        </p>
                      </div>
                      <Link to={`/resources?action=${action.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No actions scheduled for today</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Actions</CardTitle>
              <CardDescription>
                Tasks scheduled for the coming days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading upcoming actions...</p>
                </div>
              ) : upcomingActions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingActions.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <div className="flex gap-4">
                          <p className="text-sm text-muted-foreground">
                            {format(action.date, "MMM d")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Staff: {action.staffAssigned} | Trucks: {action.trucksAssigned}
                          </p>
                        </div>
                      </div>
                      <Link to={`/resources?action=${action.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming actions scheduled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
