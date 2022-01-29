import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    DoCheck, ElementRef,
    EmbeddedViewRef, Injector,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';

import {Calendar} from '@fullcalendar/core'
import momentPlugin, {toMoment} from '@fullcalendar/moment'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {EventComponent} from "./event/event.component";

import * as $ from 'jquery';
import moment from "moment";
import {EventDayGridMonthComponent} from "./event-day-grid-month/event-day-grid-month.component";
import {interval, of} from "rxjs";
import {map, mergeMap, take} from "rxjs/operators";
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
    count = 0;
    calendar: any;
    toolbarTitle!: JQuery;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef,
        private elRef: ElementRef
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
        // const numbers = interval(1000);
        //
        // const takeFourNumbers = numbers.pipe(take(4));
        //
        // takeFourNumbers.subscribe(x => console.log('Next: ', x));

        const letters = of('a', 'b', 'c');
        const result = letters.pipe(
            mergeMap(x => interval(1000).pipe(map(i => x+i))),
        );
        result.subscribe(x => console.log(x));


        // ($('#full-calendar') as any).fullCalendar(
        //     this.defaultConfigurations
        // );
        const externalEventsElem = this.elRef
            .nativeElement
            .closest('.container')
            .querySelector("#external-events");
        let checkbox = this.elRef
            .nativeElement
            .closest('.container')
            .querySelector('#drop-remove');
        // const parentElement = document.getElementById('fexternal-events');
        console.log("parentElement: ");
        console.log(externalEventsElem);
        console.log("this.elRef.nativeElement.parentElement: ");
        console.log(this.elRef.nativeElement.parentElement);

        // initialize the external events
        // -----------------------------------------------------------------

        new Draggable(externalEventsElem, {
            itemSelector: '.fc-event',
            // eventData: {}
            // eventData: function(eventEl) {
            //     return {
            //         title: eventEl.innerText
            //     };
            // }
        });

        // initialize the calendar
        // -----------------------------------------------------------------

        let calendarEl: HTMLElement = document.getElementById('full-calendar')!;
        this.calendar = new Calendar(calendarEl, {
            plugins: [
                momentPlugin,
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin
            ],
            // initialView: 'timeGridWeek',
            initialView: 'dayGridMonth',
            dayMaxEventRows: true,
            dayMaxEvents: true,
            // FullCalendar More-Link moreLinkContent
            moreLinkContent: () => {
                console.log(
                    '%c moreLinkContent ',
                    'background: red; color: #fff; padding: 0 200px;'
                );
                // let italicEl = document.createElement('i')
                // italicEl.innerHTML = "me!";
                // let arrayOfDomNodes = [ italicEl ]
                // return { domNodes: arrayOfDomNodes }
            },

            moreLinkDidMount: () => {
                console.log(
                    '%c moreLinkDidMount ',
                    'background: red; color: #fff; padding: 0 200px;'
                );

            },

            // FullCalendar dayHeaders

            dayHeaders: true,
            // dayHeaderFormat: (args) => {
            //     return moment(args.date).format('ddd Do');
            // },
            dayHeaderClassNames: "day-header",
            dayHeaderFormat: {weekday: 'long'},
            dayHeaderContent: (arg) => {
                console.log("arg: ");
                console.log(arg)
                const element: HTMLElement = document.createElement('div');
                element.className = 'header-cell'
                element.innerHTML = arg.text
                return {domNodes: [element]};
            },


            // FullCalendar Day-Cell

            dayCellClassNames: "day-cell-th",
            dayCellContent: (arg) => {
                const element: HTMLElement = document.createElement('div');
                element.className = 'day-cell'
                element.innerHTML = arg.date.getDate().toString();
                return {domNodes: [element]};
            },


            // FullCalendar views

            // businessHours: true,
            views: {
                dayGridMonth: { // name of view
                    // titleFormat: {year: 'numeric', month: "2-digit", day: '2-digit'}
                    titleFormat: {year: 'numeric', month: 'long'},
                    eventClassNames: 'day-grid-month',
                    eventContent: (arg) => this.renderEventDayGridMonthContent(arg),
                    // titleFormat: function(date) {
                    //     // return '<p>' + date.toString() + '!!!</p>';
                    //     return '<p></p>';
                    // }
                    // other view-specific options here
                },
                // dayGridWeek: { // name of view
                //     dayMaxEventRows: 2
                // },
                timeGrid: {
                    // dayMaxEventRows: 2,
                    eventMaxStack: 1,
                    // FullCalendar More-Link timeGrid
                    moreLinkClassNames: "time-grid-more-link",
                    slotMinTime: "09:00:00",
                    slotMaxTime: "17:00:00",
                    // height: 'auto',
                    expandRows: true,
                    dayHeaderFormat: {weekday: 'long', day: 'numeric'},
                }
            },
            viewDidMount: (args) => {

                console.log("----------viewDidMount----------");

                this.toolbarTitle = $("#full-calendar")
                    .find('.fc-toolbar-title');
                this.formatTitleDate(this.toolbarTitle.text());
                let startDate = moment().subtract(1, 'month');
                console.log("startDate: ");
                console.log(startDate);


                // //The title isn't rendered until after this callback, so we need to use a timeout.
                // window.setTimeout(function () {
                //     let num = args.view.title.match(/\d+/g);
                //     let letr = args.view.title.match(/[a-zA-Z]+/g);
                //     $("#full-calendar").find('.fc-toolbar-title').empty().append(
                //         // "<div>"+view.start.format('MMM Do [to]')+"</div>"+
                //         // "<div>"+view.end.format('MMM Do')+"</div>"
                //         `
                //  <div class="fc-title">
                //     <div class="letr">${letr}</div>
                //     <div class="num">${num}</div>
                //  </div>`
                //     );
                // }, 0);

                // this.calendar.updateSize();
                console.log(
                    '%c viewDidMount ',
                    'background: #fff; color: #000; padding: 0 100px; border: 1px solid red;'
                );
                this.updateMoreLinks();
            },

            viewWillUnmount: () => {
                console.log(
                    '%c viewWillUnmount ',
                    'background: green; color: #fff; padding: 0 100px;'
                );
                // this.toolbarTitle.empty();
            },
            // contentHeight: 600,
            // dayMaxEvents: true,

            // aspectRatio: 2,

            titleFormat: 'MMMM D, YYYY', // you can now use moment format strings!
            locale: 'fr',
            // eventClassNames: 'myclassname',
            eventClassNames: (arg) => {

                if (arg.event.extendedProps.isUrgent) {
                    return ['urgent']
                } else {
                    return ['myclassname']
                }
            },
            allDayText: 'toute la journée',
            // themeSystem: 'bootstrap',

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
            customButtons: {
                myCustomButton: {
                    text: '>',
                    click: () => {
                        this.calendar.next();
                        let date = this.calendar.getDate();
                        console.log(
                            '%c date ',
                            'background: #AA759F; color: #fff; padding: 0 100px;'
                        );
                        console.log("date: ");
                        console.log(date);
                    }
                },
                // next: {
                //     text: 'custom!2',
                //     click: () => {
                //
                //     }
                // }
            },

            // FullCalendar headerToolbar
            headerToolbar: {
                left: 'prev next today',
                center: 'title',
                end: 'dayGridMonth timeGridWeek timeGridDay list'
            },

            slotLabelContent: (arg) => {
                console.log("arg: ");
                console.log(arg)
                const element: HTMLElement = document.createElement('div');
                element.className = 'slot-cell'
                element.innerHTML = arg.text
                return {domNodes: [element]};
            },


            buttonText: {
                today: "Aujourd'hui",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                list: "Liste"
            },

            // FullCalendar nowIndicator
            nowIndicator: true,
            nowIndicatorClassNames: "now-indicator",
            selectable: true,
            dateClick: (arg) => {
                let m = toMoment(arg.date, this.calendar); // calendar is required
                console.log('clicked on ' + m.format());
            },
            // dateClick: (dateClickEvent) =>  {         // <-- add the callback here as one of the properties of `options`
            //     console.log("DATE CLICKED !!!");
            // },

            events: [
                {
                    id: "14",
                    allDay: true,
                    title: '1 All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "141",
                    title: '2 All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "142",
                    title: '3 All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "143",
                    title: '4 All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "144",
                    title: '5 All Day Event',
                    start: '2022-01-04',
                    backgroundColor: '#F5FCF5',
                    borderColor: '#2ACC39',
                    textColor: '#000',
                },
                {
                    id: "15",
                    title: '1 Start FullCalendar project',
                    start: '2022-01-05 04:00:00',
                    end: '2022-01-05 05:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "151",
                    title: '1.1 Start FullCalendar project',
                    start: '2022-01-05 04:00:00',
                    end: '2022-01-05 05:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "152",
                    title: '1.2 Start FullCalendar project',
                    start: '2022-01-05 04:00:00',
                    end: '2022-01-05 05:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "153",
                    title: '1.3 Start FullCalendar project',
                    start: '2022-01-05 04:00:00',
                    end: '2022-01-05 05:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "18",
                    title: '2 Start FullCalendar project',
                    start: '2022-01-05 04:30:00',
                    end: '2022-01-05 06:00:00',
                    backgroundColor: '#E7F8F3',
                    borderColor: '#21BF87',
                    textColor: '#21BF87',
                },
                {
                    id: "19",
                    title: '3 Start FullCalendar project',
                    start: '2022-01-05 06:00:00',
                    end: '2022-01-05 07:00:00',
                    backgroundColor: '#F0E6FB',
                    borderColor: '#7400D8',
                    textColor: '#7400D8',
                },
                {
                    id: "20",
                    title: '4 Start FullCalendar project',
                    start: '2022-01-05 08:00:00',
                    end: '2022-01-05 09:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "21",
                    title: '5 Start FullCalendar project',
                    start: '2022-01-05 09:00:00',
                    end: '2022-01-05 10:00:00',
                    backgroundColor: '#FFF7F5',
                    borderColor: '#FF6634',
                    textColor: '#000',
                },
                {
                    id: "17",
                    title: 'Start project',
                    start: '2022-01-13 09:00:00',
                    end: '2022-01-14 14:00:00',
                    backgroundColor: '#00E0AD',
                    borderColor: '#0F348E',
                    textColor: '#0F348E',
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

            eventDisplay: 'block',

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
            // FullCalendar Drag&Drop
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            drop: (arg) => {
                console.log(
                    '%c Drop ',
                    'background: yellow; color: black; padding: 0 100px;'
                );
                this.updateMoreLinks();
            },
            eventReceive: (arg) => {
                console.log(
                    '%c eventReceive ',
                    'background: yellow; color: black; padding: 0 100px;'
                );
                // arg.event.backgroundColor = "red";
                console.log("event: ", arg.event);
                console.log("element key: ", arg.draggedEl.dataset.key);
                console.log("title: ", arg.event.title);
                console.log("title2: ", arg.draggedEl.dataset.event);
                console.log("duration: ", arg.event.durationEditable);
                console.log("start: ", arg.event.start);
                console.log("backgroundColor: ", arg.event.backgroundColor);
                console.log("startStr: ", arg.event.startStr);
                console.log("view: ", arg.view);

                this.calendar.addEvent({
                    id: "1",
                    title: arg.event.title,
                    start: arg.event.startStr,
                    // end: '2022-01-05 05:00:00',
                    backgroundColor: arg.event.backgroundColor,
                    borderColor: arg.event.borderColor,
                    textColor: arg.event.textColor,
                })
                arg.revert();
                // is the "remove after drop" checkbox checked?
                if (checkbox.checked) {
                    // if so, remove the element from the "Draggable Events" list
                    arg.draggedEl.parentNode?.removeChild(arg.draggedEl);
                }
            },
            eventAdd: (arg) => {
                console.log(
                    '%c eventAdd ',
                    'background: yellow; color: black; padding: 0 100px;'
                );
                console.log(arg.event.backgroundColor)
            },
            eventDrop: (info) => {
                // if(!confirm("Are you sure you want to move this event?")){
                //     info.revert();
                // }
                console.log(
                    '%c eventDrop ',
                    'background: yellow; color: black; padding: 0 100px;'
                );
                this.updateMoreLinks();
            },
            eventResize: (info) => {
                if (!confirm("Are you sure you want to resize this event?")) {
                    info.revert();
                }
            },
        });
        console.log("this.calendar.render()");
        this.calendar.render();
        this.updateMoreLinks();
        // window.addEventListener('mouseup', e => {
        //     console.log("mouseup")
        // });

        // console.log("this.calendar: ");
        // console.log(this.calendar);
        // aspectRatio: 1.35,
        // this.calendar.setOption('height', "100%");
        // this.calendar.setOption('aspectRatio', 2);
        // let ratio = this.calendar.getOption('aspectRatio');
        // console.log(ratio)
        // window.resizeTo(screen.width-1,screen.height-1)
        // window.resizeTo(200,200)
        // window.resizeBy(200, 200);
        this.elemWatcher();
    }

    devLoopThroughAllDOMElements(): void {
        let all = document.getElementsByTagName("*");

        for (let i = 0, max = all.length; i < max; i++) {
            // Do something with the element here
            console.log(all[i]);
            console.log(window.getComputedStyle(all[i]).getPropertyValue("opacity"));
        }
    }

    updateMoreLinks() {
        setTimeout(() => {
            this.calendar.select('2022-01-07 09:00:00');
            this.calendar.unselect()
            // this.calendar.render();
            // this.calendar.setOption('aspectRatio', 2);
        }, 0)
    }

    elemWatcher() {
        console.log('A child node is on watch.');
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('.fc-toolbar-title');

        // Options for the observer (which mutations to observe)
        // const config = {attributes: true, childList: true, subtree: true};
        const config = {characterData: true, attributes: true, childList: true, subtree: true};

        // Callback function to execute when mutations are observed
        const callback = (mutationsList: any, observer: any) => {
            console.log(
                '%c elemWatcher ',
                'background: #FFE5A8; color: #000; padding: 0 100px; border: 1px solid #000;'
            );
            this.updateMoreLinks();
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                console.log("mutation.type: ");
                console.log(mutation.type);
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                    if (mutation["removedNodes"][0]) {
                        if (mutation["removedNodes"][0]["nodeValue"].replace(/\r|\n|\s/g, "") != "") {
                            console.log(
                                '%c ' + mutation["removedNodes"][0]["nodeValue"] + ' ',
                                'background: #3D7385; color: #fff; padding: 0 100px; border: 1px solid #003D52;'
                            );
                        }
                        console.log("MutationObserverWay: previous value is ", mutation["removedNodes"][0]["nodeValue"]);
                        console.log("MutationObserverWay: previous value is ", mutation["removedNodes"]);
                    }
                    if (mutation["addedNodes"][0]) {
                        if (mutation["addedNodes"][0]["nodeValue"].replace(/\r|\n|\s/g, "") != "") {
                            console.log(
                                '%c ' + mutation["addedNodes"][0]["nodeValue"] + ' ',
                                'background: #835F5F; color: #FFE4E4; padding: 0 100px; border: 1px solid black;'
                            );
                            this.formatTitleDate(mutation["addedNodes"][0]["nodeValue"]);
                        }

                        console.log("MutationObserverWay: new value is ", mutation["addedNodes"][0]["nodeValue"]);
                        console.log("MutationObserverWay: new value is ", mutation["addedNodes"]);
                        if (mutation["addedNodes"][0]["nodeValue"].replace(/\r|\n|\s/g, "") == "") {
                            console.log(
                                '%c addedNodes is empty ',
                                'background: #848BE6; color: #fff; padding: 0 100px; border: 1px solid #0F348E;'
                            );
                        }
                        if (mutation["addedNodes"][0]["nodeValue"].replace(/\r|\n|\s/g, "") != "") {
                            console.log(
                                '%c ' + mutation["addedNodes"][0]["nodeValue"] + ' ',
                                'background: #00E0AD; color: #0F348E; padding: 0 100px; border: 1px solid #0F348E;'
                            );
                        }
                    }

                } else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                } else if (mutation.type === 'characterData') {
                    console.log(
                        '%c characterData ',
                        'background: yellow; color: #000; padding: 0 100px; border: 1px solid black;'
                    );
                    console.log("characterData value is ", mutation);
                    console.log("textContent value is ", mutation.target.textContent);
                    this.formatTitleDate(mutation.target.textContent);
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode!, config);

        // Later, you can stop observing
        // observer.disconnect();
    }

    formatTitleDate(toolbarTitle: string) {
        // let toolbarTitleCurrentDate = this.toolbarTitle.text();
        let formattedDate!: string;
        let toolbarTitleCurrentDate = toolbarTitle;
        let dayOrYear = toolbarTitleCurrentDate.match(/\d+/g)!;
        let newNum: string;
        console.log("num");
        console.log(dayOrYear);
        let month: RegExpMatchArray = toolbarTitleCurrentDate.toLowerCase()
            .match(/[a-zàâçéèêëîïôûùüÿñæœ]+/g)!;
        let newLetr: string;
        console.log("month");
        console.log(month);
        if (month?.length === 2 && month[0] === month[1]) {
            formattedDate = this.getLetrDiv(month[0]) +
                this.getNumDiv(dayOrYear[0]) +
                this.getNumDiv("-") +
                this.getNumDiv(dayOrYear[2] + ",") +
                this.getNumDiv(dayOrYear[1]);
        } else if (month?.length === 2 && month[0] !== month[1]) {

            if (dayOrYear[1] !== dayOrYear[3]) {
                formattedDate = this.getLetrDiv(month[0]) +
                    this.getNumDiv(dayOrYear[0] + ",") +
                    this.getNumDiv(dayOrYear[1]) +
                    this.getNumDiv("-") +
                    this.getLetrDiv(month[1]) +
                    this.getNumDiv(dayOrYear[2] + ",") +
                    this.getNumDiv(dayOrYear[3]);
            } else {
                formattedDate = this.getLetrDiv(month[0]) +
                    this.getNumDiv(dayOrYear[0]) +
                    this.getNumDiv("-") +
                    this.getLetrDiv(month[1]) +
                    this.getNumDiv(dayOrYear[2] + ",") +
                    this.getNumDiv(dayOrYear[3]);
            }

        } else if (dayOrYear?.length === 2) {
            formattedDate = this.getLetrDiv(month[0]) +
                this.getNumDiv(dayOrYear[0] + ",") +
                this.getNumDiv(dayOrYear[1]);

        } else {
            formattedDate = this.getLetrDiv(month[0]) +
                this.getNumDiv(dayOrYear[0])
        }
        this.toolbarTitle.empty().append(
            // "<div>"+view.start.format('MMM Do [to]')+"</div>"+
            // "<div>"+view.end.format('MMM Do')+"</div>"
            `
                         <div class="fc-title">
                            ${formattedDate}
                         </div>`
        );

    }

    getLetrDiv(letr: string) {
        return `<div class="letr">${letr!}</div>`;
    }

    getNumDiv(num: string) {
        return `<div class="num">${num!}</div>`;
    }

    navigateBackAndForward(navigate: string) {
        // alert('clicked the custom button!');

        this.toolbarTitle.empty();
        this.calendar[navigate]();
        // let toolbarTitle = $("#full-calendar").find('.fc-toolbar-title')
        // let toolbarTitleCurrentDate = toolbarTitle.text();
        // console.log("toolbarTitleCurrentDate: ");
        // console.log(toolbarTitleCurrentDate);
        // let date = calendar.getDate();
        // console.log("The current date of the calendar is " + date.toISOString());
        this.count++;
        console.log(
            '%c eventClassNames ',
            'background: red; color: #fff; padding: 0 100px;'
        );
        // window.setTimeout(() => {
        // let toolbarTitle = $("#full-calendar").find('.fc-toolbar-title')

        // // let toolbarTitleCurrentDate = "attache!";
        //     console.log("toolbarTitleCurrentDate - setTimeout: ");
        //     console.log(toolbarTitleCurrentDate);
        // toolbarTitle.empty().append(
        //         // "attache! " + this.count
        //     toolbarTitleCurrentDate + " - modif!"
        // // toolbarTitle.text()
        //     );

        // let toolbarTitleCurrentDate = toolbarTitle.text();
        // let num = toolbarTitleCurrentDate.match(/\d+/g);
        // let letr = toolbarTitleCurrentDate.toLowerCase().match(/[a-zàâçéèêëîïôûùüÿñæœ]+/g);
        // toolbarTitle.empty().append(
        //     // "<div>"+view.start.format('MMM Do [to]')+"</div>"+
        //     // "<div>"+view.end.format('MMM Do')+"</div>"
        //     `
        //                  <div class="fc-title">
        //                     <div class="letr">${letr}</div>
        //                     <div class="num">${num}</div>
        //                  </div>`
        // );

        // this.formatTitleDate();

        // }, 3000)
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
        // console.log(
        //     '%c "************ element ************" ',
        //     'background: white; ' +
        //     'color: #000; ' +
        //     'padding: 10px; ' +
        //     'border: 3px solid red'
        // );
        // console.log(element);

        return {domNodes: [domElem]};
        // return renderer.rootNodes[0];
    }

    renderEventDayGridMonthContent(arg: any) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventDayGridMonthComponent); // Your dynamic component will replace DynamicComponent

        const componentRef = componentFactory.create(this.injector);
        componentRef.instance.data = arg;
        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;


        return {domNodes: [domElem]};
        // return renderer.rootNodes[0];
    }

    unrenderEvent(arg: any) {
        // console.log("🌶️, 🌶️, 🌶️, 🌶️, 🌶️")
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
