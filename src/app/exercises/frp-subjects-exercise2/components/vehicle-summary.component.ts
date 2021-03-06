import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { BIKE, CAR, countObservableItems, getMean, MinMaxValue, TRUCK, Vehicle } from '../utils/model';
import { Service } from '../utils/service';

@Component({
    selector: 'vehicles-summary',
    templateUrl: 'vehicle-summary.component.html',
    styleUrls: ['vehicle-summary.component.scss']
})
export class VehiclesSummaryComponent implements OnInit {

    totalVehicles$: Observable<number>;
    speedAvg$: Observable<number>;
    speedViolations$: Observable<number>;
    minMax$: Observable<MinMaxValue>;

    cars$: Observable<Vehicle>;
    bikes$: Observable<Vehicle>;
    trucks$: Observable<Vehicle>;

    vehicles$: Observable<Vehicle>;

    constructor(public service: Service) {
        this.vehicles$ = this.service.vehicles$;
    }

    ngOnInit() {
        this.totalVehicles$ = countObservableItems(this.vehicles$);
        this.speedViolations$ = countObservableItems(this.vehicles$.filter(v => v.speed > 120));

        const sumSpeeds$ = this.vehicles$.scan((total, cur) => total + cur.speed, 0);

        this.speedAvg$ = getMean(this.totalVehicles$, this.vehicles$);

        this.minMax$ = this.vehicles$
                           .scan((acc, cur) => <MinMaxValue>{ max: Math.max(acc.max, cur.speed),
                                                              min: Math.min(acc.min, cur.speed)},
                               <MinMaxValue>{min: 1000, max: 0});



        this.cars$ = this.vehicles$.filter(typeSelector(CAR));

        this.bikes$ = this.vehicles$.filter(typeSelector(BIKE));

        this.trucks$ = this.vehicles$.filter(typeSelector(TRUCK));
    }
}

const selector = property => value => vehicle => vehicle[property] === value;

const typeSelector = selector('type');
