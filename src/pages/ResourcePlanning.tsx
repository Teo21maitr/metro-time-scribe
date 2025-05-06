
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ActionItem, 
  DayData, 
  calculateOptimalResources, 
  generateActions, 
  generateMonthData 
} from "@/lib/data-service";
import { format } from "date-fns";
import { toast } from "sonner";
import { Truck, Users } from "lucide-react";

const ResourcePlanning = () => {
  const [searchParams] = useSearchParams();
  const actionId = searchParams.get("action");
  
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemCount, setItemCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [truckCount, setTruckCount] = useState<number>(0);
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMonthData();
      const actionsList = generateActions(data);
      setMonthData(data);
      setActions(actionsList);
      
      if (actionId) {
        const action = actionsList.find(a => a.id === actionId);
        if (action) {
          setSelectedAction(action);
          setItemCount(action.itemCount);
          setStaffCount(action.staffAssigned);
          setTruckCount(action.trucksAssigned);
        }
      }
      
      setIsLoading(false);
    }, 300);
  }, [actionId]);
  
  const handleItemCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count >= 0) {
      setItemCount(count);
      const optimal = calculateOptimalResources(count);
      setStaffCount(optimal.staff);
      setTruckCount(optimal.trucks);
    }
  };
  
  const handleOptimizeClick = () => {
    const optimal = calculateOptimalResources(itemCount);
    setStaffCount(optimal.staff);
    setTruckCount(optimal.trucks);
    toast.success("Resources optimized");
  };
  
  const handleSaveClick = () => {
    toast.success("Resource plan saved successfully");
  };
  
  const calculateCost = () => {
    const staffCost = staffCount * 800; // Rs 800 per staff per day
    const truckCost = truckCount * 2000; // Rs 2000 per truck per day
    return staffCost + truckCost;
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Resource Planning</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Calculator</CardTitle>
              <CardDescription>
                Plan optimal staff and trucks based on item count
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="itemCount">Number of Items</Label>
                    <Input
                      id="itemCount"
                      type="number"
                      min="0"
                      value={itemCount}
                      onChange={(e) => handleItemCountChange(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleOptimizeClick} className="w-full">
                    Calculate Optimal Resources
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="staffSlider">Staff Required: {staffCount}</Label>
                          <span className="text-sm text-muted-foreground">
                            <Users className="h-4 w-4 inline mr-1" />
                            Min 1
                          </span>
                        </div>
                        <Slider
                          id="staffSlider"
                          min={1}
                          max={Math.max(10, staffCount * 2)}
                          step={1}
                          value={[staffCount]}
                          onValueChange={(values) => setStaffCount(values[0])}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="truckSlider">Trucks Required: {truckCount}</Label>
                          <span className="text-sm text-muted-foreground">
                            <Truck className="h-4 w-4 inline mr-1" />
                            Min 1
                          </span>
                        </div>
                        <Slider
                          id="truckSlider"
                          min={1}
                          max={Math.max(5, truckCount * 2)}
                          step={1}
                          value={[truckCount]}
                          onValueChange={(values) => setTruckCount(values[0])}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Estimated Cost:</span>
                      <span>₹{calculateCost().toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on ₹800/staff and ₹2,000/truck per day
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedAction && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedAction.title}</CardTitle>
                <CardDescription>
                  Scheduled for {format(selectedAction.date, "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Original Allocation</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Users className="h-5 w-5" />
                        <span>{selectedAction.staffAssigned} Staff</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Truck className="h-5 w-5" />
                        <span>{selectedAction.trucksAssigned} Trucks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium">New Allocation</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                        <Users className="h-5 w-5" />
                        <span>{staffCount} Staff</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                        <Truck className="h-5 w-5" />
                        <span>{truckCount} Trucks</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveClick} className="w-full">
                    Update Resource Allocation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation Rules</CardTitle>
            <CardDescription>
              Guidelines for efficient resource allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm">Staff Allocation</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Basic rate: 1 staff per 10 items</li>
                  <li>• High volume ({">"}100 items): 1 staff per 12 items</li>
                  <li>• Low volume (&lt;20 items): Minimum 1 staff</li>
                  <li>• Festival days: Add 20% more staff</li>
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm">Truck Allocation</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Basic rate: 1 truck per 30 items</li>
                  <li>• High volume ({">"}100 items): 1 truck per 35 items</li>
                  <li>• Low volume (&lt;20 items): Minimum 1 truck</li>
                  <li>• Large items: May require additional trucks</li>
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm">Cost Optimization Tips</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Combine nearby station collections</li>
                  <li>• Schedule actions on consecutive days</li>
                  <li>• Use larger trucks for bulk collections</li>
                  <li>• Allocate multi-skilled staff for efficiency</li>
                </ul>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <h3 className="font-medium text-sm">Delhi Metro Special Considerations</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Peak hours: Avoid resource allocation from 8-10am and 5-7pm</li>
                  <li>• Festival seasons: Plan for 30-50% higher item volumes</li>
                  <li>• Monsoon season: Allow extra time for transport</li>
                  <li>• Tourist areas: Higher proportion of valuable items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcePlanning;
