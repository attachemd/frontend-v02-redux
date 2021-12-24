import {TestBed} from '@angular/core/testing';

import {FullCalendarService} from './full-calendar.service';
import {JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

xdescribe('FullCalendarService', () => {

    let fullCalendarService: FullCalendarService;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return '';
                        }
                    }
                })
            ],
            providers: [
                FullCalendarService,
            ],
        });
        fullCalendarService = TestBed.inject(FullCalendarService);
        controller = TestBed.inject(HttpTestingController);


    });

    it('should be created', () => {
        expect(fullCalendarService).toBeTruthy();
    });

    it('Get full calendar event successfully', () => {

        const response = [
            {
                "id": 1,
                "title": "Event name",
                "start": "2021-12-07"
            }
        ]

        let actualEvents: any;

        fullCalendarService.getEvents().subscribe(
            (events) => {
                actualEvents = events;
            }
        );

        const request = controller.expectOne(
            {
                method: "GET",
                url: "/api/full_calendar/"
            }
        )

        // Answer the request so the Observable emits a value.
        request.flush(response);
        controller.verify();

        // Now verify emitted valued.
        expect(actualEvents).toEqual(response);

    });

    it(
        'Get full calendar event passes through with error response',
        async () => {
            const status = 500;
            const statusText = 'Internal Server Error';
            const errorEvent = new ErrorEvent('API error');

            spyOn(window.console, 'log')

            let actualEvents: any;

            fullCalendarService.getEvents().subscribe(
                (events) => {
                    actualEvents = events;
                }
            );

            controller.expectOne(
                {
                    method: "GET",
                    url: "/api/full_calendar/"
                }
            )
                .flush(errorEvent, {status, statusText});

            // expect(console.log).toHaveBeenCalled();

            expect(actualEvents.length).toEqual(0);

        }
    );

});
