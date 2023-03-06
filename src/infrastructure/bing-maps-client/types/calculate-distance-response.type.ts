export type DistanceMatrixCell = {
  departureTime: string;
  destinationIndex: number;
  hasError: boolean
  originIndex: number;
  travelDistance: number; // in km
  travelDuration: number;
  totalWalkDuration: number;
}

export type CalculateDistanceType = {
  results: DistanceMatrixCell[]
}
