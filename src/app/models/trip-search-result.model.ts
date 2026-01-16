import { Flight } from "./flight.model";


export interface TripSearchResult {
  outboundTrips: Flight[][];
  inboundTrips: Flight[][];
}