import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {UIService} from "../shared/ui.service";
import {TrainingService} from "./training.service";
import {TestScheduler} from "rxjs/testing";


const uiServiceSpy = jasmine.createSpyObj(
    "UIService",
    {
        loadingStateNotifier: undefined,
        showSnackBar: undefined
    }
);

fdescribe('AuthService', () => {


    let sut: TrainingService;
    let controller: HttpTestingController;
    let scheduler: TestScheduler;

    beforeEach(() => {
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

    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });

    it('Stream exercice when call exerciseChangedNotifier with exercise', () => {
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

})
