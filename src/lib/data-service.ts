
// Mock data for the ChronoScope application
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export interface StationData {
  name: string;
  items: number;
  staffNeeded: number;
  trucksNeeded: number;
}

export interface DayData {
  date: Date;
  items: number;
  staffNeeded: number;
  trucksNeeded: number;
  notes: string;
  tag: 'low' | 'medium' | 'high';
  stations: StationData[];
}

export interface ActionItem {
  id: string;
  title: string;
  date: Date;
  itemCount: number;
  staffAssigned: number;
  trucksAssigned: number;
  completed: boolean;
}

// List of Delhi Metro stations
export const metroStations = [
  "VAISHALI", "BRIG. HOSHIAR SINGH", "RITHALA", "KAROL BAGH", 
  "YASHOBHOOMI DWARKA SECTOR  - 25", "SAMAYPUR BADLI", "KASHMERE GATE", 
  "IFFCO CHOWK", "DELHI CANTT.", "BOTANICAL GARDEN", "RAJIV CHOWK", 
  "NEW DELHI (Yellow & Airport Line)", "MANDI HOUSE", "JHILMIL", 
  "MOOLCHAND", "CHIRAG DELHI", "RAMAKRISHNA ASHRAM MARG", "LAJPAT NAGAR", 
  "AIIMS", "DELHI AEROCITY", "DWARKA SECTOR - 21", "NOIDA ELECTRONIC CITY",
  "JAMIA MILLIA ISLAMIA", "SULTANPUR", "AIRPORT (T-3)", "BARAKHAMBA ROAD",
  "JAMA MASJID", "JANAKPURI EAST", "RAMESH NAGAR", "HARKESH NAGAR OKHLA",
  "PATEL NAGAR", "LAL QUILA", "CENTRAL SECRETARIAT", "JANPATH",
  "CHANDNI CHOWK", "MUNDKA", "TILAK NAGAR", "RAJOURI GARDEN",
  "JAHANGIRPURI", "ADARSH NAGAR"
  // Only including 40 stations for brevity, in real app would include all stations
];

// Generate mock data for the month
export const generateMonthData = (baseDate = new Date()): DayData[] => {
  const firstDay = startOfMonth(baseDate);
  const lastDay = endOfMonth(baseDate);
  
  // Generate days in the month
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Generate data for each day
  return days.map(date => {
    // Weekends have higher lost items
    const isWeekend = [0, 6].includes(date.getDay());
    // Mondays and Fridays are busier
    const isBusyWeekday = [1, 5].includes(date.getDay());
    // Festival days (placeholder logic)
    const isFestival = date.getDate() === 15;
    
    // Base number of items varies by day
    let items = Math.floor(Math.random() * 20) + 10; // 10-30 base items
    
    if (isWeekend) items += Math.floor(Math.random() * 15) + 15; // Add 15-30 more on weekends
    if (isBusyWeekday) items += Math.floor(Math.random() * 10) + 5; // Add 5-15 more on busy weekdays
    if (isFestival) items += Math.floor(Math.random() * 30) + 20; // Add 20-50 more on festival days
    
    // Calculate resource needs based on item count
    const staffNeeded = Math.max(1, Math.ceil(items / 10)); // 1 staff per 10 items, min 1
    const trucksNeeded = Math.max(1, Math.ceil(items / 25)); // 1 truck per 25 items, min 1
    
    // Determine tag based on item count
    let tag: 'low' | 'medium' | 'high' = 'low';
    if (items > 50) tag = 'high';
    else if (items > 30) tag = 'medium';
    
    // Generate notes
    let notes = '';
    if (isFestival) notes = 'Festival Day - Expect high volume';
    else if (isWeekend) notes = 'Weekend - Above average volume expected';
    else if (isBusyWeekday) notes = 'Busy weekday - Prepare additional staff';
    
    // Generate station-specific data
    const stations: StationData[] = generateStationData(items);
    
    return {
      date,
      items,
      staffNeeded,
      trucksNeeded,
      notes,
      tag,
      stations
    };
  });
};

// Generate station-specific data
const generateStationData = (totalItems: number): StationData[] => {
  // Select a random number of stations that will have items today (between 10-30 stations)
  const activeStationCount = Math.min(Math.floor(Math.random() * 20) + 10, metroStations.length);
  
  // Create a shuffled copy of the stations array
  const shuffledStations = [...metroStations].sort(() => Math.random() - 0.5);
  
  // Take only the active number of stations
  const activeStations = shuffledStations.slice(0, activeStationCount);
  
  // Distribute total items among active stations
  let remainingItems = totalItems;
  
  return activeStations.map((name, index) => {
    // For the last station, assign all remaining items
    if (index === activeStations.length - 1) {
      const items = remainingItems;
      const staffNeeded = Math.max(1, Math.ceil(items / 10));
      const trucksNeeded = Math.max(1, Math.ceil(items / 25));
      return { name, items, staffNeeded, trucksNeeded };
    }
    
    // For other stations, assign a random portion of remaining items
    const maxItemsForStation = Math.ceil(remainingItems / (activeStationCount - index) * 1.5);
    const items = Math.max(1, Math.floor(Math.random() * maxItemsForStation));
    remainingItems -= items;
    
    const staffNeeded = Math.max(1, Math.ceil(items / 10));
    const trucksNeeded = Math.max(1, Math.ceil(items / 25));
    
    return { name, items, staffNeeded, trucksNeeded };
  }).sort((a, b) => b.items - a.items); // Sort by item count (highest first)
};

// Generate mock actions
export const generateActions = (days: DayData[]): ActionItem[] => {
  const actions: ActionItem[] = [];
  
  // Generate a few actions for days with high item counts
  days.filter(day => day.tag === 'high').forEach((day, index) => {
    actions.push({
      id: `action-${index + 1}`,
      title: `Empty ${day.items} stock items`,
      date: day.date,
      itemCount: day.items,
      staffAssigned: day.staffNeeded,
      trucksAssigned: day.trucksNeeded,
      completed: false
    });
  });
  
  // Add some random actions for medium days too
  days.filter(day => day.tag === 'medium' && Math.random() > 0.5).forEach((day, index) => {
    actions.push({
      id: `action-medium-${index + 1}`,
      title: `Process ${day.items} found items`,
      date: day.date,
      itemCount: day.items,
      staffAssigned: day.staffNeeded,
      trucksAssigned: day.trucksNeeded,
      completed: false
    });
  });
  
  return actions;
};

// Helper to find day data by date
export const findDayData = (days: DayData[], date: Date): DayData | undefined => {
  return days.find(day => isSameDay(day.date, date));
};

// Calculate optimal resource allocation (simplified algorithm)
export const calculateOptimalResources = (itemCount: number): { staff: number; trucks: number } => {
  // Base calculation
  let staff = Math.ceil(itemCount / 10);
  let trucks = Math.ceil(itemCount / 30);
  
  // Optimization rules (simplified)
  if (itemCount > 100) {
    // More efficient for large volumes
    staff = Math.ceil(itemCount / 12);
    trucks = Math.ceil(itemCount / 35);
  } else if (itemCount < 20) {
    // Minimum staffing
    staff = Math.max(1, staff);
    trucks = Math.max(1, trucks);
  }
  
  return { staff, trucks };
};
