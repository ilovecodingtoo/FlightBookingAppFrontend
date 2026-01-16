export interface Ticket {
  id: string;
  number: string;
  extraBaggage?: boolean;
  extraLegroom?: boolean;
  priorityBoarding?: boolean;
  fareType?: string;
  airlineName?: string;
  routeOrigin?: string;
  routeDestination?: string;
  departure?: string;
  arrival?: string;
  price?: number;
  passengerId?: string;
  passengerEmail?: string;
  flightId?: string;
  flightCode?: string;
}