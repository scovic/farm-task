import { Status } from "./status.type"

type ResultRow = {
  elements: {
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number
    },
    status: string
  }[]
}

export type CalculateDistanceResponse = {
  destination_addresses: string[],
  origin_addresses: string[],
  rows: ResultRow[],
  status: Status
}
