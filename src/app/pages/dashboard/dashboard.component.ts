import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, from, switchMap } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { CarPark, CarparkDaum, CarparkInfoSummary } from 'src/app/interface/carpark.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy{
  private apiSubscription: Subscription | undefined;
  carParkData: CarPark | null = null;

  ngOnInit() {
    this.initialApiCall();
  }

  ngOnDestroy() {
    this.unsubscribeFromApi();
  }

  initialApiCall() {
    // Fetch data with the current time
    const currentDateTime = new Date().toISOString().split('.')[0];
    this.apiCall(currentDateTime).subscribe((data: CarPark) => {
      this.carParkData = data;
      this.startApiInterval(); // Start the interval after initial data is fetched
    });
  }

  startApiInterval() { 
    this.unsubscribeFromApi();

    // Start the interval for subsequent API calls
    this.apiSubscription = interval(60000)
      .pipe(switchMap(() => this.apiCall(new Date().toISOString().split('.')[0])))
      .subscribe((data: CarPark) => {
        this.carParkData = data;
      });
  }

  unsubscribeFromApi() {
    // Unsubscribe from the API interval subscription
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  apiCall(dateTime: string): Observable<CarPark> { 
    const apiUrl = `https://api.data.gov.sg/v1/transport/carpark-availability?date_time=${dateTime}`;
    
    return from(fetch(apiUrl).then((response) => response.json()));
  }
  getCarParksByCategory(category: string): CarparkDaum[] {
    return this.carParkData?.items[0].carpark_data.filter(
      (carpark) => this.getCarparkCategory(+carpark.carpark_info[0].total_lots) === category
    ) || [];
  }

  getAvailableLots(carpark: CarparkDaum): number {
    let totalAvailableLots = 0;
    carpark.carpark_info.forEach((info) => {
      totalAvailableLots += +info.lots_available;
    });
    return totalAvailableLots;
  }

  getCarparkCategory(totalLots: number): string {
    if (totalLots < 100) {
      return 'small';
    } else if (totalLots < 300) {
      return 'medium';
    } else if (totalLots < 400) {
      return 'big';
    } else {
      return 'large';
    }
  }
  
  highestAvailableLots(category: string): CarparkInfoSummary {
    const carParksByCategory = this.getCarParksByCategory(category);
    let highestLots = 0;
    let highestLotsCarparks: CarparkDaum[] = [];

    carParksByCategory.forEach((carpark) => {
      const availableLots = this.getAvailableLots(carpark);
      if (availableLots > highestLots) {
        highestLots = availableLots;
        highestLotsCarparks = [carpark];
      } else if (availableLots === highestLots) {
        highestLotsCarparks.push(carpark);
      }
    });

    return { totalLots: highestLots, carparks: highestLotsCarparks };
  }

  lowestAvailableLots(category: string): CarparkInfoSummary {
    const carParksByCategory = this.getCarParksByCategory(category);
    let lowestLots = Infinity;
    let lowestLotsCarparks: CarparkDaum[] = [];

    carParksByCategory.forEach((carpark) => {
      const availableLots = this.getAvailableLots(carpark);
      if (availableLots < lowestLots) {
        lowestLots = availableLots;
        lowestLotsCarparks = [carpark];
      } else if (availableLots === lowestLots) {
        lowestLotsCarparks.push(carpark);
      }
    });

    return { totalLots: lowestLots, carparks: lowestLotsCarparks };
  }

  isLast(carpark: CarparkDaum, carparkArray: CarparkDaum[]): boolean {
    return carparkArray.indexOf(carpark) === carparkArray.length - 1;
  }
}