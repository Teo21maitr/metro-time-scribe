
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DayData, generateMonthData } from "@/lib/data-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Truck, Users } from "lucide-react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMonthData(currentMonth);
      setMonthData(data);
      setIsLoading(false);
    }, 300);
  }, [currentMonth]);

  // Navigation handlers
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calculate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handle day selection
  const handleDayClick = (date: Date) => {
    const dayData = monthData.find(day => isSameDay(day.date, date));
    if (dayData) {
      setSelectedDay(dayData);
      setDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Resource Calendar</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium min-w-32 text-center">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Resource Planning Calendar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-full resource-low">Low</span>
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-full resource-medium">Medium</span>
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-full resource-high">High</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <p>Loading calendar...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center font-medium">
                    {day}
                  </div>
                ))}

                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}

                {calendarDays.map(date => {
                  const dayData = monthData.find(day => isSameDay(day.date, date));
                  const isCurrentDay = isToday(date);

                  return (
                    <div
                      key={date.toString()}
                      onClick={() => handleDayClick(date)}
                      className={`calendar-day ${
                        isCurrentDay ? "calendar-day-selected" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm ${isCurrentDay ? "font-bold" : ""}`}>
                          {format(date, "d")}
                        </span>
                        {dayData && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full resource-${dayData.tag}`}>
                            {dayData.tag}
                          </span>
                        )}
                      </div>

                      {dayData && (
                        <div className="mt-2 text-xs">
                          <div className="flex items-center">
                            <span className="font-medium">{dayData.items}</span>
                            <span className="ml-1">items</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{dayData.staffNeeded}</span>
                            </div>
                            <div className="flex items-center">
                              <Truck className="h-3 w-3 mr-1" />
                              <span>{dayData.trucksNeeded}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Day detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(selectedDay.date, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                selectedDay.tag === 'low' ? 'resource-low' : 
                selectedDay.tag === 'medium' ? 'resource-medium' : 'resource-high'
              }`}>
                <h3 className="font-semibold">Lost Items Forecast</h3>
                <p className="text-3xl font-bold">{selectedDay.items}</p>
                {selectedDay.notes && <p className="text-sm mt-1">{selectedDay.notes}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="font-semibold">Staff Required</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-5 w-5" />
                    <p className="text-2xl font-bold">{selectedDay.staffNeeded}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="font-semibold">Trucks Required</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Truck className="h-5 w-5" />
                    <p className="text-2xl font-bold">{selectedDay.trucksNeeded}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Schedule Action</h3>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empty">Empty Stock Items</SelectItem>
                        <SelectItem value="process">Process Found Items</SelectItem>
                        <SelectItem value="transfer">Transfer to Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Schedule</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
