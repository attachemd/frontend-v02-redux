import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-event-day-grid-month',
    templateUrl: './event-day-grid-month.component.html',
    styleUrls: ['./event-day-grid-month.component.css']
})
export class EventDayGridMonthComponent implements OnInit {
    @Input()
    data: any;

    constructor() {
    }

    ngOnInit(): void {
    }

}
