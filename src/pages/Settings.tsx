
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [resourceCalcMethod, setResourceCalcMethod] = useState("standard");
  const [defaultStaffRate, setDefaultStaffRate] = useState("800");
  const [defaultTruckRate, setDefaultTruckRate] = useState("2000");
  
  const handleSaveClick = () => {
    toast.success("Settings saved successfully");
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your system preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for high volume days and resource changes
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily and weekly summary emails
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automation">Resource Automation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate optimal resource allocation
                  </p>
                </div>
                <Switch
                  id="automation"
                  checked={automationEnabled}
                  onCheckedChange={setAutomationEnabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resource Calculation Settings</CardTitle>
            <CardDescription>
              Configure how resources are calculated and allocated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resource-method">Resource Calculation Method</Label>
                <Select
                  value={resourceCalcMethod}
                  onValueChange={setResourceCalcMethod}
                >
                  <SelectTrigger id="resource-method">
                    <SelectValue placeholder="Select calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (Default)</SelectItem>
                    <SelectItem value="optimized">Cost Optimized</SelectItem>
                    <SelectItem value="peak">Peak Season</SelectItem>
                    <SelectItem value="custom">Custom Rules</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Determines how staff and vehicle resources are calculated
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="staff-rate">Default Staff Rate (₹/day)</Label>
                  <Input
                    id="staff-rate"
                    type="number"
                    value={defaultStaffRate}
                    onChange={(e) => setDefaultStaffRate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="truck-rate">Default Truck Rate (₹/day)</Label>
                  <Input
                    id="truck-rate"
                    type="number"
                    value={defaultTruckRate}
                    onChange={(e) => setDefaultTruckRate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Delhi Metro Integration</CardTitle>
            <CardDescription>
              Configure integration with Delhi Metro systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for secure communication with Delhi Metro systems
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stations">Metro Stations</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="stations">
                    <SelectValue placeholder="Select stations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stations</SelectItem>
                    <SelectItem value="blue">Blue Line Only</SelectItem>
                    <SelectItem value="yellow">Yellow Line Only</SelectItem>
                    <SelectItem value="red">Red Line Only</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Select which metro stations to include in analytics
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="real-time">Real-time Data Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect to live lost item reporting system
                  </p>
                </div>
                <Switch id="real-time" defaultChecked={false} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveClick}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
