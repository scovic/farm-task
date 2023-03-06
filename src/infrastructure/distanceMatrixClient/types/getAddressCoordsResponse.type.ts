import { Status } from "./status.type";

type ResultRow = {
  address_component: { long_name: string, short_name: string, types: string[] }[];
  formatted_address: string;
  geometry: {
    geometry: {
      lat: number,
      lng: number
    },
    location_type: string,
    viewport: {
      northeast: {
        lat: number,
        lng: number
      },
      southwest: {
        lat: number,
        lng: number
      }
    }
  };
  place_id: string;
  plus_code: { compound_code: string, global_code: string  },
  types: string[];
}

export type GetAddressCoordsResponse = {
  result: ResultRow[];
  status: Status;
}
