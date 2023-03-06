import config from "config/config";
import { Coords } from "modules/farms/types/coords.type";
import fetch from "node-fetch";
import { GetAddressCoordsResponse } from "./types/getAddressCoordsResponse.type";
import { CalculateDistanceResponse } from "./types/calculateDistanceResponse.type";

export class DistanceMatrixClient {
  private distanceMatrixApiUrl: string;
  constructor() {
    this.distanceMatrixApiUrl = "https://api.distancematrix.ai/maps/api/geocode/json"
  }

  public async calculateDistance(from: Coords, to: Coords): Promise<CalculateDistanceResponse> {
    const { lat: fromLat, lng: formLng } = from;
    const { lat: toLat, lng: toLng} = to;
    const resp = await fetch(
      `${this.distanceMatrixApiUrl}?origins=${`${fromLat.trim()},${formLng.trim()}`}&destinations=${`${toLat.trim()},${toLng.trim()}`}&key=${config.DISTANCE_MATRIX_API_KEY}`
    );
    return resp.json() as Promise<CalculateDistanceResponse>;
  }

  public async getAdddressCoords(address: string): Promise<GetAddressCoordsResponse> {
    const resp = await fetch(`${this.distanceMatrixApiUrl}?address=${encodeURIComponent(address)}&key=${config.DISTANCE_MATRIX_API_KEY}`)
    return resp.json() as Promise<GetAddressCoordsResponse>;
  }
}
