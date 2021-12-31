import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {WelcomeComponent} from './welcome.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {findComponent, findEl} from "../spec-helpers/element.spec-helper";
import {By} from "@angular/platform-browser";
import {FullCalendarService} from "./full-calendar.service";
import {FullCalendarModule} from "@fullcalendar/angular";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {UIService} from "../shared/ui.service";
import {DateClickArg} from "@fullcalendar/interaction";
import {ViewApi} from "@fullcalendar/common";


xdescribe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    let fullCalendarServiceSpy: jasmine.SpyObj<FullCalendarService>;
    let controller: HttpTestingController;

    const uiServiceSpy = jasmine.createSpyObj(
        "UIService",
        {
            loadingStateNotifier: undefined,
            showSnackBar: undefined
        }
    );

    const setup = async (
        fullCalendarServiceReturnValues?: jasmine.SpyObjMethodNames<FullCalendarService>,
    ) => {
        fullCalendarServiceSpy = jasmine.createSpyObj<FullCalendarService>(
            'FullCalendarService',
            {
                getEvents: of([
                    {
                        "id": 1,
                        "title": "Event name",
                        "start": "2021-12-07"
                    }
                ]),
                ...fullCalendarServiceReturnValues,
            }
        );

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [WelcomeComponent],
            providers: [
                {
                    provide: FullCalendarService,
                    useValue: fullCalendarServiceSpy
                },
                {
                    provide: UIService,
                    useValue: uiServiceSpy
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();

        controller = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    }

    it('should create', async () => {
        await setup();
        expect(component).toBeTruthy();
    });

    it('find full calendar component ', async () => {
        await setup();
        const full_calendar = findComponent(fixture, 'full-calendar');
        expect(full_calendar).toBeTruthy();
    });

    it('get full calendar event successfully',
        async () => {
            await setup();
            await fixture.whenStable().then(() => {
                expect(fullCalendarServiceSpy.getEvents).toHaveBeenCalled();
                expect(component.calendarOptions?.initialView).toBe('dayGridMonth');
                if(component.calendarOptions && component.calendarOptions.dateClick){
                    let dateClickArg: any = {
                        dateStr: "test"
                    };
                    dateClickArg.dateStr = "test";
                    // spyOn(component, 'onDateClick')
                    spyOn(window, 'alert')

                    component.calendarOptions.dateClick(dateClickArg)
                    expect(window.alert).toHaveBeenCalled();
                    expect(window.alert).toHaveBeenCalledWith('Clicked on date : test');
                }

            });
        }
    );

    it('handles get full calendar event when empty response ',
        fakeAsync(
            async () => {
                await setup({
                    // Let the API report a failure
                    getEvents: of([]),
                });
                spyOn(window.console, 'log');
                // component.ngOnInit();
                // tick();
                // fixture.detectChanges();

                expect(fullCalendarServiceSpy.getEvents).toHaveBeenCalled();

                fixture.whenStable().then(() => {
                    expect(component.calendarOptions).toBeUndefined();
                    expect(uiServiceSpy.showSnackBar).toHaveBeenCalled();
                });

            }
        )
    );

    it('handles get full calendar event when error response',
        fakeAsync(
            async () => {
                await setup({
                    // Let the API report a failure
                    getEvents: throwError(new Error('Full calendar failed')),
                });
                spyOn(window.console, 'log');
                // TODO Important ngOnInit
                component.ngOnInit();
                // tick();
                // fixture.detectChanges();

                expect(fullCalendarServiceSpy.getEvents).toHaveBeenCalled();

                await fixture.whenStable().then(() => {
                    // tick();
                    // fixture.detectChanges();
                    expect(window.console.log).toHaveBeenCalled();
                });

            }
        )
    );



    // it('when click ',
    //     fakeAsync( async () => {
    //         // let compiled = fixture.nativeElement;
    //         findComponent(fixture, 'full-calendar')
    //             .nativeElement
    //             .click();
    //         spyOn(window.console, 'log')
    //
    //         fixture.detectChanges();
    //         tick()
    //         await fixture.whenStable().then(() => {
    //
    //             expect(console.log).toHaveBeenCalled();
    //         });
    //     })
    // );

});
