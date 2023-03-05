import { Farm } from "./farm.entity";

export class FarmList {
  public static create(farms: Farm[]): FarmList {
    return new FarmList(farms);
  }

  private constructor (private farmList: Farm[]) { }

  public sortByDrivingDistance(): void {
    this.farmList.sort((a, b) => a.drivingDistance - b.drivingDistance);
  }

  public getAverageYeild(): number {
    let yieldSum = 0;
    for (let i = 0; i < this.farms.length; i++) {
      yieldSum += this.farms[i].yieldValue;
    }

    return yieldSum / this.farms.length;
  }

  public get farms(): Farm[] { return this.farmList; }
}
