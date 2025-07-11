
import React from 'react';
import { Plane, Map, Compass } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full py-20 overflow-hidden">
      <div className="backdrop"></div>
      
      {/* Floating elements */}
      <div className="absolute opacity-20 top-20 left-[10%] animate-float">
        <Plane size={40} />
      </div>
      <div className="absolute opacity-20 top-40 right-[15%] animate-float" style={{ animationDelay: '1s' }}>
        <Map size={48} />
      </div>
      <div className="absolute opacity-20 bottom-20 left-[20%] animate-float" style={{ animationDelay: '2s' }}>
        <Compass size={36} />
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
          AI-Powered Travel Planning
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Your Perfect Trip, <br className="hidden sm:block" />
          <span className="text-primary">Planned Effortlessly</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Tell us where you want to go, and our AI will create a personalized travel itinerary
          tailored to your preferences and budget.
        </p>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={() => document.getElementById('travel-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
          >
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
