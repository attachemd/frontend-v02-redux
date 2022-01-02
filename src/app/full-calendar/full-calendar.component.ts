import {Component, Input, OnInit} from '@angular/core';

import { Calendar } from '@fullcalendar/core'
import momentPlugin, {toMoment} from '@fullcalendar/moment'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

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

      let calendarEl:HTMLElement = document.getElementById('full-calendar')!;
      let calendar = new Calendar(calendarEl, {
          plugins: [ momentPlugin, dayGridPlugin, interactionPlugin ],
          titleFormat: 'MMMM D, YYYY', // you can now use moment format strings!
          initialView: 'dayGridWeek',
          selectable: true,
          dateClick: function(arg) {
              let m = toMoment(arg.date, calendar); // calendar is required
              console.log('clicked on ' + m.format());
          },
          // dateClick: (dateClickEvent) =>  {         // <-- add the callback here as one of the properties of `options`
          //     console.log("DATE CLICKED !!!");
          // },
          events: [
              {
                  title: 'All Day Event',
                  start: '2021-12-04',
              },
              {
                  title: 'Long Event',
                  start: '2021-12-05',
                  end: '2021-12-07',
              },
          ]
      });

      calendar.render()

  }

}
