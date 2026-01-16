export interface Flight {
  id: string;
  code: string;
  departure?: string;
  arrival?: string;
  economyPrice?: number;
  businessPrice?: number;
  firstClassPrice?: number;
  extraBaggagePrice?: number;
  extraLegroomPrice?: number;
  priorityBoardingPrice?: number;
  totalBookings?: number;
  totalRevenue?: number;
  aircraftId?: string;
  aircraftTailNumber?: string;
  routeOrigin?: string;
  routeDestination?: string;
}