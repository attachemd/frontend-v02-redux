// import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
//
// import {WelcomeComponent} from './welcome.component';
// import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
// import {findComponent, findEl} from "../spec-helpers/element.spec-helper";
//
//
// describe('WelcomeComponent', () => {
//     let component: WelcomeComponent;
//     let fixture: ComponentFixture<WelcomeComponent>;
//     let controller: HttpTestingController;
//
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule,],
//             declarations: [WelcomeComponent],
//             providers: [],
//         })
//             .compileComponents();
//
//         controller = TestBed.inject(HttpTestingController);
//         fixture = TestBed.createComponent(WelcomeComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('should create', async () => {
//         expect(component).toBeTruthy();
//     });
//
//     it('find full calendar component', () => {
//         const full_calendar = findComponent(fixture, 'full-calendar');
//         expect(full_calendar).toBeTruthy();
//     });
//
//     // it('get full calendar event successfully ',
//     //     async () => {
//     //         await setup();
//     //         await fixture.whenStable().then(() => {
//     //             expect(httpSpy.get).toHaveBeenCalled();
//     //         });
//     //     }
//     // );
//
//     // it('handles get full calendar event when error response ',
//     //     fakeAsync(
//     //         async () => {
//     //             await setup({
//     //                 // Let the API report a failure
//     //                 get: throwError(new Error('Full calendar failed')),
//     //             });
//     //             spyOn(window.console, 'log')
//     //             tick();
//     //             fixture.detectChanges();
//     //
//     //             expect(httpSpy.get).toHaveBeenCalled();
//     //
//     //             await fixture.whenStable().then(() => {
//     //                 tick();
//     //                 fixture.detectChanges();
//     //                 expect(window.console.log).toHaveBeenCalled();
//     //             });
//     //
//     //         }
//     //     )
//     // );
//
//
//
//     // it('when click',
//     //     fakeAsync( async () => {
//     //         // let compiled = fixture.nativeElement;
//     //         findComponent(fixture, 'full-calendar')
//     //             .nativeElement
//     //             .click();
//     //         spyOn(window.console, 'log')
//     //
//     //         fixture.detectChanges();
//     //         tick()
//     //         await fixture.whenStable().then(() => {
//     //
//     //             expect(console.log).not.toHaveBeenCalled();
//     //         });
//     //     })
//     // );
//
// });

// it('should filter the products and return the correct product)',
//     inject([ProductService], (service: ProductService) => {
//         const usersSpy = spyOnProperty(service, 'products', 'get').and.returnValue(Observable.of(mockGetResponse));
//         service.products.subscribe((res) => {
//             // How do I continue here?
//             // the `this.products$.getValue()`
//             // will not contain any items,
//             // because I am mocking the data.
//             service.findByUserId(1);
//         });
//     }));
