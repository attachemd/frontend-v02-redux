import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalendarOptions} from '@fullcalendar/angular';
import * as events from "events";
import {FinishedExercise} from "../training/finished-exercise.model";

interface Event {
    title: string,
    start: string
}

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    Events = [];
    calendarOptions: CalendarOptions | undefined;

    constructor(private httpClient: HttpClient) {
    }

    onDateClick(res:any) {
        alert('Clicked on date : ' + res.dateStr)
    }

    ngOnInit(): void {
        setTimeout(() => {
            return this.httpClient.get('http://localhost:8888/event.php')
                .subscribe((res:Event) => {
                    this.Events.push(res);
                    console.log(this.Events);
                });

            return this.http
                .get<Event[]>(
                    '/api/full_calendar/'
                )
                .subscribe(
                    (events: FinishedExercise[]) => {

                    },
                    (error:any) => {

                    }
                )
        }, 2200);

        setTimeout(() => {
            this.calendarOptions = {
                initialView: 'dayGridMonth',
                dateClick: this.onDateClick.bind(this),
                events: this.Events
            };
        }, 2500);

    }

}
