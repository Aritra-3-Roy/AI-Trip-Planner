
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plane } from 'lucide-react';

interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
  duration: string;
  price: {
    amount: number;
    currency: string;
  };
}

interface FlightsTableProps {
  flights: Flight[];
}

const FlightsTable: React.FC<FlightsTableProps> = ({ flights }) => {
  if (!flights.length) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 animate-fade-in-up">
      <Card className="rounded-xl overflow-hidden soft-shadow">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center text-lg">
            <Plane className="h-5 w-5 mr-2" />
            Available Flights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{flight.airline}</TableCell>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>
                      <div>{flight.departure.time}</div>
                      <div className="text-xs text-muted-foreground">{flight.departure.airport}</div>
                    </TableCell>
                    <TableCell>
                      <div>{flight.arrival.time}</div>
                      <div className="text-xs text-muted-foreground">{flight.arrival.airport}</div>
                    </TableCell>
                    <TableCell>{flight.duration}</TableCell>
                    <TableCell className="text-right">
                      {flight.price.currency} {flight.price.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightsTable;
