import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {UIService} from "../shared/ui.service";
import {TrainingService} from "./training.service";
import {TestScheduler} from "rxjs/testing";
import {Observable, of, Subject} from "rxjs";
import {AuthService} from "../auth/auth.service";

let uiServiceSpy: UIService


// const uiServiceSpy = jasmine.createSpyObj(
//     "UIService",
//     {
//         loadingStateNotifier: undefined,
//         showSnackBar: undefined,
//         // loadingStateGetter: new Subject<boolean>()
//     }
// );

// let uiServiceSpy: Pick<UIService, keyof UIService> = {
//     loadingStateChange$: new Subject<boolean>(),
//     loadingStateNotifier(): void {
//     },
//     loadingStateGetter(): Subject<boolean> {
//         return this.loadingStateChange$
//     },
//     showSnackBar(...availableChoices:any): void {
//         console.log("🤕 🤑 🤠");
//     },
// };


fdescribe('AuthService', () => {


    let sut: TrainingService;
    let controller: HttpTestingController;
    let scheduler: TestScheduler;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');


    beforeEach(() => {
        uiServiceSpy = jasmine.createSpyObj(
            "UIService",
            {
                loadingStateNotifier: undefined,
                showSnackBar: undefined,
                // loadingStateGetter: new Subject<boolean>()
            }
        );
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: UIService,
                    useValue: uiServiceSpy
                },
                TrainingService,
            ],
        });
        sut = TestBed.inject(TrainingService);
        controller = TestBed.inject(HttpTestingController);
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected)
        })
        // spyOn(uiServiceSpy, 'loadingStateNotifier').and.callThrough();
        // spyOn(uiServiceSpy, 'showSnackBar').and.callThrough();
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });

    it('Stream exercise when call exerciseChangedNotifier with exercise', () => {
        scheduler.run(({expectObservable, cold}) => {
            const exercise = {
                id: '15',
                name: "test",
                duration: 10,
                calories: 20
            };
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.exerciseChangedNotifier(exercise))
            expectObservable(sut.exerciseChangedGetter()).toBe('-a', {a: exercise})
        })
    });

    it('Stream exercises array when call exercisesChangedNotifier with exercises', () => {
        scheduler.run(({expectObservable, cold}) => {
            const exercises = [{
                id: '15',
                name: "test",
                duration: 10,
                calories: 20
            }];
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.exercisesChangedNotifier(exercises))
            expectObservable(sut.exercisesChangedGetter()).toBe('-a', {a: exercises})
        })
    });

    it(
        'Stream finished exercises array when call exercisesChangedNotifier with finished exercises',
        () => {
            scheduler.run(({expectObservable, cold}) => {
                    const exercises = [{
                        id: '15',
                        name: "test",
                        duration: 10,
                        calories: 20
                    }];
                    // sut.exerciseChangedNotifier(exercise);
                    cold('-a').subscribe(() => sut.finishedExercisesChangedNotifier(exercises))
                    expectObservable(sut.finishedExercisesChangedGetter()).toBe('-a', {a: exercises})
                }
            )
        });


    it(
        'Get available exercises && start && complete exercise successfully',
        async () => {

            const response = [{
                id: '15',
                name: "test",
                duration: 10,
                calories: 20
            }]
            console.log("👾 🤖 🎃 test");
            sut.getAvailableExercises();


            const request = controller.expectOne(
                {
                    method: "GET",
                    url: "/api/exercises/"
                }
            );

            // Answer the request so the Observable emits a value.
            request.flush(response);
            controller.verify();

            // Now verify emitted valued.
            expect((sut as any).availableExercises).toBe(response);
            expect(uiServiceSpy.loadingStateNotifier).toHaveBeenCalledWith(false);
            expect(uiServiceSpy.showSnackBar).not.toHaveBeenCalled();

            const selectedExerciseId = '15';
            spyOn(sut, 'exerciseChangedNotifier')
            // spyOn(sut, 'addDataToDatabase')
            sut.startExercise(selectedExerciseId);
            expect(sut.exerciseChangedNotifier).toHaveBeenCalledWith({
                date: undefined,
                state: undefined,
                ...response[0]
            });


            spyOn(sut, 'getCompletedOrCanceledExercises')
            sut.completeExercise();
            const completeExerciseRequest = controller.expectOne(
                {
                    method: "POST",
                    url: "/api/fexercises/15/"
                }
            );


            // Answer the request so the Observable emits a value.
            completeExerciseRequest.flush(response);
            // getCompletedOrCanceledExercises.flush(response);
            controller.verify();

            expect(sut.exerciseChangedNotifier).toHaveBeenCalledWith(undefined);
            expect(sut.getCompletedOrCanceledExercises).toHaveBeenCalled();

            // let getCompletedOrCanceledExercisesRequest = controller.expectOne(
            //     {
            //         method: "GET",
            //         url: "/api/fexercises/"
            //     }
            // );
        }
    );


    it(
        'Get available exercises passes through empty response',
        async () => {

            const response: any = []

            await sut.getAvailableExercises();

            const request = controller.expectOne(
                {
                    method: "GET",
                    url: "/api/exercises/"
                }
            );

            // Answer the request so the Observable emits a value.
            request.flush(response);
            controller.verify();

            // Now verify emitted valued.
            // expect(sut.availableExercises).toBe(response);
            expect(uiServiceSpy.showSnackBar).toHaveBeenCalledWith(
                'no exercise is available',
                undefined,
                3000
            );
            // expect(uiServiceSpy.showSnackBar).toHaveBeenCalled();

        }
    );

    it(
        'Get available exercises passes through error response',
        async () => {
            // const status = 500;
            // const statusText = 'Internal Server Error';
            // const errorEvent = new ErrorEvent('API error');
            spyOn(sut, 'exercisesChangedNotifier')
            await sut.getAvailableExercises();

            controller.expectOne(
                {
                    method: "GET",
                    url: "/api/exercises/"
                }
            )
                .flush(errorEvent, {status, statusText});
            // .flush(error);
            expect(uiServiceSpy.showSnackBar).toHaveBeenCalledWith(
                'error when getting available exercises, try later.',
                undefined,
                3000
            );
            expect(sut.exercisesChangedNotifier).toHaveBeenCalled();
            // expect(actualIsLoadingState).toEqual(false);

        }
    );

    it(
        'get completed or canceled exercises successfully',
        () => {
            const response = [{
                id: '15',
                name: "test",
                duration: 10,
                calories: 20
            }]
            console.log("👾 🤖 🎃 test");
            spyOn(sut, 'finishedExercisesChangedNotifier')
            sut.getCompletedOrCanceledExercises();

            const request = controller.expectOne(
                {
                    method: "GET",
                    url: "/api/fexercises/"
                }
            );

            request.flush(response);
            controller.verify();


            expect(sut.finishedExercisesChangedNotifier).toHaveBeenCalled();

        }
    );

    it(
        'get completed or canceled exercises passes through error response',
        () => {
            // const status = 500;
            // const statusText = 'Internal Server Error';
            // const errorEvent = new ErrorEvent('API error');


            spyOn(window.console, 'log')
            spyOn(sut, 'finishedExercisesChangedNotifier')
            sut.getCompletedOrCanceledExercises();

            const request = controller.expectOne(
                {
                    method: "GET",
                    url: "/api/fexercises/"
                }
            );

            request.flush(errorEvent, {status, statusText});
            // request.flush(...apiError);
            controller.verify();


            expect(console.log).toHaveBeenCalled();
            expect(sut.finishedExercisesChangedNotifier).not.toHaveBeenCalled();

        }
    );


})
