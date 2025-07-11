import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateTravelPlan, getFlightsInfo } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelFormProps {
  onPlanGenerated: (plan: string, destination: string) => void;
  onFlightsGenerated: (flights: any[]) => void;
  onLoading: (isLoading: boolean) => void;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
];

const TravelForm: React.FC<TravelFormProps> = ({ 
  onPlanGenerated, 
  onFlightsGenerated,
  onLoading 
}) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [people, setPeople] = useState("1");
  const [showFlights, setShowFlights] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!source.trim()) errors.source = "Source location is required";
    if (!destination.trim()) errors.destination = "Destination location is required";
    if (!startDate) errors.startDate = "Start date is required";
    if (!endDate) errors.endDate = "End date is required";
    if (startDate && endDate && startDate > endDate) errors.dates = "End date cannot be before start date";
    if (!budget.trim()) errors.budget = "Budget is required";
    if (isNaN(Number(budget)) || Number(budget) <= 0) errors.budget = "Budget must be a positive number";
    if (!people.trim() || isNaN(Number(people)) || Number(people) <= 0) {
      errors.people = "Number of people must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onLoading(true);

    try {
      const travelPlan = await generateTravelPlan({
        source,
        destination,
        startDate: startDate!,
        endDate: endDate!,
        budget: Number(budget),
        currency,
        people: Number(people)
      });
      
      onPlanGenerated(travelPlan, destination);
      
      if (showFlights) {
        const flights = await getFlightsInfo({
          source,
          destination,
          date: format(startDate!, "yyyy-MM-dd")
        });
        onFlightsGenerated(flights);
      } else {
        onFlightsGenerated([]);
      }
    } catch (error) {
      console.error("Error generating travel plan:", error);
    } finally {
      onLoading(false);
    }
  };

  const currencySymbol = currencies.find(c => c.code === currency)?.symbol || '$';

  return (
    <div id="travel-form" className="w-full max-w-3xl mx-auto mt-8 mb-16">
      <div className="glass-morphism rounded-2xl p-8 soft-shadow animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-center">Plan Your Journey</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source">From</Label>
              <Input
                id="source"
                placeholder="City, Country"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={cn(formErrors.source && "border-destructive")}
              />
              {formErrors.source && (
                <p className="text-destructive text-sm">{formErrors.source}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="City, Country"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={cn(formErrors.destination && "border-destructive")}
              />
              {formErrors.destination && (
                <p className="text-destructive text-sm">{formErrors.destination}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      formErrors.startDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.startDate && (
                <p className="text-destructive text-sm">{formErrors.startDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      formErrors.endDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.endDate && (
                <p className="text-destructive text-sm">{formErrors.endDate}</p>
              )}
              {formErrors.dates && (
                <p className="text-destructive text-sm">{formErrors.dates}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                    {currencySymbol}
                  </div>
                  <Input
                    id="budget"
                    type="number"
                    placeholder={`Budget in ${currency}`}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={cn("pl-10", formErrors.budget && "border-destructive")}
                    min="1"
                  />
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formErrors.budget && (
                <p className="text-destructive text-sm">{formErrors.budget}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="people">Number of Travelers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="people"
                  type="number"
                  placeholder="Number of people"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className={cn("pl-10", formErrors.people && "border-destructive")}
                  min="1"
                />
              </div>
              {formErrors.people && (
                <p className="text-destructive text-sm">{formErrors.people}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showFlights" 
              checked={showFlights} 
              onCheckedChange={(checked) => setShowFlights(!!checked)} 
            />
            <Label htmlFor="showFlights" className="font-normal cursor-pointer">
              Show flight information
            </Label>
          </div>
          
          <Button type="submit" className="w-full py-6 text-base">
            Generate Travel Plan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TravelForm;
