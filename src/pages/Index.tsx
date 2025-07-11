
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import TravelForm from '@/components/TravelForm';
import PlanResult from '@/components/PlanResult';
import FlightsTable from '@/components/FlightsTable';
import TravelChat from '@/components/TravelChat';
import { checkApiKeys } from '@/utils/api';

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<string>("");
  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKeys, setHasApiKeys] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>("");
  
  useEffect(() => {
    // Check if API keys are set in environment variables
    setHasApiKeys(checkApiKeys());
    
    if (!checkApiKeys()) {
      console.warn("API keys are not set in environment variables. Please add them to your .env file.");
    }
  }, []);
  
  const handleTravelPlanGenerated = (plan: string, dest: string) => {
    setTravelPlan(plan);
    setDestination(dest);
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleFlightsGenerated = (flightsData: any[]) => {
    setFlights(flightsData);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <TravelForm 
          onPlanGenerated={(plan, dest) => handleTravelPlanGenerated(plan, dest)}
          onFlightsGenerated={handleFlightsGenerated}
          onLoading={setIsLoading}
        />
        
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="loader"></div>
          </div>
        )}
        
        {travelPlan && !isLoading && (
          <div id="results">
            <PlanResult markdownContent={travelPlan} />
            {flights.length > 0 && <FlightsTable flights={flights} />}
            <TravelChat travelPlan={travelPlan} destination={destination} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
