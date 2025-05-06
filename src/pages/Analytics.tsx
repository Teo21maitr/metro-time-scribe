
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { DayData, generateMonthData } from "@/lib/data-service";
import { format, getDay, getMonth, parseISO } from "date-fns";

const Analytics = () => {
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("weekly");

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMonthData();
      setMonthData(data);
      setIsLoading(false);
    }, 500);
  }, []);

  // Transform data for weekly view (by day of week)
  const weeklyData = monthData.reduce((acc: any[], day) => {
    const dayOfWeek = getDay(day.date);
    const existing = acc.find(item => item.dayOfWeek === dayOfWeek);
    
    if (existing) {
      existing.items += day.items;
      existing.count += 1;
    } else {
      acc.push({
        dayOfWeek,
        dayName: format(day.date, "EEE"),
        items: day.items,
        staffNeeded: day.staffNeeded,
        trucksNeeded: day.trucksNeeded,
        count: 1
      });
    }
    
    return acc;
  }, []).map(item => ({
    ...item,
    items: Math.round(item.items / item.count),
    staffNeeded: Math.round(item.staffNeeded / item.count),
    trucksNeeded: Math.round(item.trucksNeeded / item.count),
  })).sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  // Top 5 days with highest item counts
  const topDays = [...monthData]
    .sort((a, b) => b.items - a.items)
    .slice(0, 5)
    .map(day => ({
      date: format(day.date, "MMM d"),
      items: day.items,
      staffNeeded: day.staffNeeded,
      trucksNeeded: day.trucksNeeded,
    }));

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <Select
          value={timeframe}
          onValueChange={(value) => setTimeframe(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly Patterns</SelectItem>
            <SelectItem value="monthly">Monthly Overview</SelectItem>
            <SelectItem value="topDays">Top Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center min-h-[400px]">
            <p>Loading analytics data...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {timeframe === "weekly" && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Lost Item Patterns</CardTitle>
                <CardDescription>
                  Average number of lost items by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dayName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="items" name="Lost Items" fill="#9b87f5" />
                      <Bar dataKey="staffNeeded" name="Staff Required" fill="#6E59A5" />
                      <Bar dataKey="trucksNeeded" name="Trucks Required" fill="#8E9196" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {timeframe === "monthly" && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Item Volume Trend</CardTitle>
                <CardDescription>
                  Daily lost item volumes throughout the month
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthData.map(day => ({
                      date: format(day.date, "MMM d"),
                      items: day.items,
                      staffNeeded: day.staffNeeded,
                      trucksNeeded: day.trucksNeeded,
                    }))} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="items" name="Lost Items" stroke="#9b87f5" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="staffNeeded" name="Staff Required" stroke="#6E59A5" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="trucksNeeded" name="Trucks Required" stroke="#8E9196" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {timeframe === "topDays" && (
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Highest Volume Days</CardTitle>
                <CardDescription>
                  Days with the highest number of lost items
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDays} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="items" name="Lost Items" fill="#9b87f5" />
                      <Bar dataKey="staffNeeded" name="Staff Required" fill="#6E59A5" />
                      <Bar dataKey="trucksNeeded" name="Trucks Required" fill="#8E9196" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Weekly Peaks</h3>
                    <p className="text-sm mt-1">
                      Mondays and Fridays consistently show 35% more lost items than midweek days.
                      Consider allocating 2-3 additional staff on these days.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Staff Efficiency</h3>
                    <p className="text-sm mt-1">
                      Staff process an average of 8-12 items per hour. 
                      The optimal ratio is 1 staff member per 10-15 items for standard processing.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Transport Optimization</h3>
                    <p className="text-sm mt-1">
                      Combining collection from adjacent stations reduces transport costs by up to 24%.
                      Schedule multi-station collections on medium-volume days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h3 className="font-medium">Festival Season</h3>
                    <p className="text-sm mt-1">
                      Expect 40-60% increase in lost items during Diwali, Holi and other major festivals.
                      Pre-schedule additional resources 1 week before major festivals.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h3 className="font-medium">Monsoon Impact</h3>
                    <p className="text-sm mt-1">
                      July-August sees 25% higher item loss rate, particularly umbrellas and rainwear.
                      Allow additional transport time due to traffic delays.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h3 className="font-medium">Tourist Season</h3>
                    <p className="text-sm mt-1">
                      October-February tourism season increases high-value lost items by 30%.
                      Focus additional resources on stations near tourist attractions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
