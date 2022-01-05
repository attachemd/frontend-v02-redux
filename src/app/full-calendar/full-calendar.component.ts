import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    DoCheck,
    EmbeddedViewRef, Injector,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';

import {Calendar} from '@fullcalendar/core'
import momentPlugin, {toMoment} from '@fullcalendar/moment'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {EventComponent} from "./event/event.component";

import * as $ from 'jquery';
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
export class FullCalendarComponent implements OnInit, DoCheck {
    // @Input()
    // set configurations(config: any) {
    //     if(config) {
    //         this.defaultConfigurations = config;
    //     }
    // }
    //
    // @Input() eventData: any;
    // defaultConfigurations: any;

    // Connects to the `<ng-template>` in our template.
    @ViewChild("fcEventContent", {static: true}) eventContent!: TemplateRef<any>;
    // To prevent memory leaks, we need to manually destroy any views we create when the
    // events are removed from the view.
    private readonly contentRenderers = new Map<string, EmbeddedViewRef<any>>();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef
    ) {
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
            eventClassNames: 'myclassname',
            allDayText: 'toute la journée',
            themeSystem: 'bootstrap',

            // eventContent: function (arg) {
            //     let italicEl = document.createElement('i')
            //     let divEl = document.createElement('div')
            //     let timeEl = document.createElement('div')
            //     let div2El = document.createElement('div')
            //     let appEvent = document.createElement('app-event')
            //     if( arg.event.id === "15"){
            //         divEl.className = 'new-class'
            //     }
            //     console.log("********* arg.event **********");
            //     console.log(arg.event);
            //     divEl.innerHTML = arg.event.title
            //     timeEl.innerHTML = arg.timeText
            //     div2El.innerHTML = `<button onclick="alert('hi! event id is: ${arg.event.id}')">Click me</button>`;
            //     if (arg.event.extendedProps.isUrgent) {
            //         italicEl.innerHTML = 'urgent event'
            //     } else {
            //         italicEl.innerHTML = 'normal event'
            //     }
            //
            //     let arrayOfDomNodes = [divEl, italicEl, timeEl, div2El, appEvent]
            //     return {domNodes: arrayOfDomNodes}
            // },

            // eventContent: { html: `<button onclick="alert('hi!')">Click me</button>` },

            eventContent: (arg) => this.renderEventContent(arg),
            eventWillUnmount: (arg) => this.unrenderEvent(arg),

            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,list'
            },
            views: {
                dayGridMonth: { // name of view
                    // titleFormat: {year: 'numeric', month: "2-digit", day: '2-digit'}
                    titleFormat: {year: 'numeric', month: 'long'},
                    // titleFormat: function(date) {
                    //     // return '<p>' + date.toString() + '!!!</p>';
                    //     return '<p></p>';
                    // }
                    // other view-specific options here
                }
            },
            viewDidMount: function (args) {
                //The title isn't rendered until after this callback, so we need to use a timeout.
                window.setTimeout(function () {
                    let num = args.view.title.match(/\d+/g);
                    // num[0] will be 21

                    let letr = args.view.title.match(/[a-zA-Z]+/g);
                    /* letr[0] will be foofo.
                       Now both are separated, and you can make any string as you like. */
                    $("#full-calendar").find('.fc-toolbar-title').empty().append(
                        // "<div>"+view.start.format('MMM Do [to]')+"</div>"+
                        // "<div>"+view.end.format('MMM Do')+"</div>"
                        `
                 <div class="fc-title">
                    <div class="letr">${letr}</div>
                    <div class="num">${num}</div>
                 </div>`
                    );
                }, 0);
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
                    id: "14",
                    title: 'All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "15",
                    title: 'Start FullCalendar project',
                    start: '2022-01-05 04:00:00',
                    end: '2022-01-05 08:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "16",
                    title: 'Long Event',
                    start: '2022-01-07 09:00:00',
                    end: '2022-01-08 13:00:00',
                    backgroundColor: '#F5FEFD',
                    borderColor: '#2EE5C9',
                    textColor: '#000',
                },
            ],

            eventDragStop: (arg) => {
                // console.log("------------ eventDragStop: arg.event.id ------------");
                // console.log(
                //     '%c eventDragStop: arg.event.id: ',
                //     'background: white; ' +
                //     'color: #000; ' +
                //     'padding: 10px; ' +
                //     'border: 3px solid red'
                // );
                // console.log(arg.event.id);
                // const event = calendar.getEventById(arg.event.id);
                // event!.setExtendedProp('refresh', true);

            },

            // events: '/api/full_calendar/',
            eventDrop: (info) => {
                // if(!confirm("Are you sure you want to move this event?")){
                //     info.revert();
                // }
            },
            eventResize: (info) => {
                if (!confirm("Are you sure you want to resize this event?")) {
                    info.revert();
                }
            },
        });

        calendar.render()

    }

    // renderEventContent(arg: any) {
    //     let renderer = this.contentRenderers.get(arg.event.id)
    //     console.log("-----------renderer---------")
    //     console.log(renderer);
    //     if (!renderer) {
    //         // Make a new renderer and save it so that we can destroy when the event is unmounted.
    //         renderer = this.eventContent.createEmbeddedView({arg: arg});
    //         console.log("-----------renderer 2---------")
    //         console.log(renderer);
    //         this.contentRenderers.set(arg.event.id, renderer);
    //     } else {
    //         // Just update the existing renderer.
    //         renderer.context.arg = arg;
    //         renderer.markForCheck();
    //     }
    //     renderer.detectChanges();
    //     console.log("-----------renderer.rootNodes---------")
    //     console.log(renderer.rootNodes);
    //     return {domNodes: renderer.rootNodes}
    //     // return renderer.rootNodes[0];
    // }

    renderEventContent(arg: any) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventComponent); // Your dynamic component will replace DynamicComponent

        const componentRef = componentFactory.create(this.injector);
        componentRef.instance.data = arg;
        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        const element: HTMLElement = document.createElement('div');
        element.appendChild(domElem); // Component needs to be added here
        // document.body.appendChild(element);
        console.log(
            '%c "************ element ************" ',
            'background: white; ' +
            'color: #000; ' +
            'padding: 10px; ' +
            'border: 3px solid red'
        );
        console.log(element);

        return {domNodes: [domElem]};
        // return renderer.rootNodes[0];
    }

    unrenderEvent(arg: any) {
        console.log("🌶️, 🌶️, 🌶️, 🌶️, 🌶️")
        // const renderer = this.contentRenderers.get(arg.event.id);
        // if (renderer) {
        //     renderer.destroy();
        // }
    }

    ngDoCheck() {
        // console.log("🌶️, 🌶️, 🌶️, 🌶️, 🌶️")
        // this.contentRenderers.forEach(r => r.detectChanges());
    }

}
