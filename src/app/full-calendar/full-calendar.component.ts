import {Component, Input, OnInit} from '@angular/core';

import {Calendar} from '@fullcalendar/core'
import momentPlugin, {toMoment} from '@fullcalendar/moment'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

// import * as $ from 'jquery';
// (window as any).$ = (window as any).jQuery = jQuery;
// (window as any).$ = (window as any).jQuery;
// import * as moment from 'moment';
// import 'fullcalendar';

// interface JQuery{
//     fullCalendar():void;
// }

@Component({
    selector: 'app-full-calendar',
    templateUrl: './full-calendar.component.html',
    styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements OnInit {
    // @Input()
    // set configurations(config: any) {
    //     if(config) {
    //         this.defaultConfigurations = config;
    //     }
    // }
    //
    // @Input() eventData: any;
    // defaultConfigurations: any;

    constructor() {
        // this.eventData = [
        //     {
        //         title: 'event1',
        //         start: moment()
        //     },
        //     {
        //         title: 'event2',
        //         start: moment(),
        //         end: moment().add(2, 'days')
        //     },
        // ];
        // this.defaultConfigurations = {
        //     editable: true,
        //     eventLimit: true,
        //     titleFormat: 'MMM D YYYY',
        //     header: {
        //         left: 'prev,next today',
        //         center: 'title',
        //         right: 'month,agendaWeek,agendaDay'
        //     },
        //     buttonText: {
        //         today: 'Today',
        //         month: 'Month',
        //         week: 'Week',
        //         day: 'Day'
        //     },
        //     views: {
        //         agenda: {
        //             eventLimit: 2
        //         }
        //     },
        //     allDaySlot: false,
        //     slotDuration: moment.duration('00:15:00'),
        //     slotLabelInterval: moment.duration('01:00:00'),
        //     firstDay: 1,
        //     selectable: true,
        //     selectHelper: true,
        //     events: this.eventData,
        // };
    }

    ngOnInit(): void {
        // ($('#full-calendar') as any).fullCalendar(
        //     this.defaultConfigurations
        // );

        let calendarEl: HTMLElement = document.getElementById('full-calendar')!;
        let calendar = new Calendar(calendarEl, {
            plugins: [momentPlugin, dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
            titleFormat: 'MMMM D, YYYY', // you can now use moment format strings!
            initialView: 'timeGridWeek',
            locale: 'fr',
            // eventContent: function (arg) {
            //     let italicEl = document.createElement('i')
            //     let divEl = document.createElement('div')
            //     let appEvent = document.createElement('app-event')
            //     if( arg.event.id === "15"){
            //         divEl.className = 'new-class'
            //     }
            //     divEl.innerHTML = arg.event.title
            //     if (arg.event.extendedProps.isUrgent) {
            //         italicEl.innerHTML = 'urgent event'
            //     } else {
            //         italicEl.innerHTML = 'normal event'
            //     }
            //
            //     let arrayOfDomNodes = [divEl, italicEl, appEvent]
            //     return {domNodes: arrayOfDomNodes}
            // },

            eventContent: { html: '<app-event></app-event>' },

            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,list'
            },
            buttonText: {
                today: "Aujourd'hui",
                month: "Mois",
                week: "Semaine",
                list: "Liste"
            },
            nowIndicator: true,
            selectable: true,
            editable: true,
            dateClick: function (arg) {
                let m = toMoment(arg.date, calendar); // calendar is required
                console.log('clicked on ' + m.format());
            },
            // dateClick: (dateClickEvent) =>  {         // <-- add the callback here as one of the properties of `options`
            //     console.log("DATE CLICKED !!!");
            // },

            events: [
                {
                    title: 'All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#99CF5F',
                    borderColor: '#99CF5F',
                    textColor: '#2f520a',
                },
                {
                    id: "15",
                    title: 'Start FullCalendar project',
                    start: '2022-01-05 09:00:00',
                    end: '2022-01-05 11:00:00',
                    backgroundColor: '#341917',
                    borderColor: '#341917'
                },
                {
                    title: 'Long Event',
                    start: '2022-01-07 09:00:00',
                    end: '2022-01-08 13:00:00',
                    backgroundColor: '#422C78',
                    borderColor: '#422C78'
                },
            ],

            // events: '/api/full_calendar/',
            eventDrop: (info) => {
                if(!confirm("Are you sure you want to move this event?")){
                    info.revert();
                }
            },
            eventResize: (info) => {
                if(!confirm("Are you sure you want to resize this event?")){
                    info.revert();
                }
            },
        });

        calendar.render()

    }

}
