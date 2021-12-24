import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/angular';
import {DateClickArg} from "@fullcalendar/interaction";
import {FullCalendarService} from "./full-calendar.service";
import {UIService} from "../shared/ui.service";
// import * as events from "events";
// import {FinishedExercise} from "../training/finished-exercise.model";

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

    Events: Event[] = [];
    calendarOptions: CalendarOptions | undefined;

    constructor(
        private fullCalendarService: FullCalendarService,
        private uiService: UIService
    ) {
    }

    onDateClick(dateClickEvent: any) {
        alert('Clicked on date : ' + dateClickEvent.dateStr)
    }

    ngOnInit(): void {

        this.fullCalendarService
            .getEvents()
            .subscribe(
                (events: Event[]) => {
                    if(events.length === 0) {

                        this.uiService.showSnackBar(
                            "no events found!",
                            undefined,
                            3000
                        );
                        return;
                        // throw {
                        //     error: {
                        //         detail: "no events found!"
                        //     }
                        // };
                    }
                    this.Events.push(events[0]);
                    console.log(this.Events);
                    this.calendarOptions = {
                        initialView: 'dayGridMonth',
                        // dateClick: this.onDateClick.bind(this),
                        dateClick: (dateClickEvent: DateClickArg) => {         // <-- add the callback here as one of the properties of `options`
                            console.log("DATE CLICKED !!!");
                            this.onDateClick(dateClickEvent);
                        },
                        events: this.Events
                    };
                },
                (error: any) => {
                    console.log("error")
                    console.log(error)
                }
            )

    }

}
