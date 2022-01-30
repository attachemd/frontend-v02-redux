import {
    async,
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { TrainingComponent } from './training.component';
// import {MockComponent} from "ng-mocks";
import { NewTrainingComponent } from './new-training/new-training.component';
import { TrainingService } from './training.service';
import { Subject } from 'rxjs';
import { FinishedExercise } from './finished-exercise.model';
import { MatTabsModule } from '@angular/material/tabs';
import { PastTrainingComponent } from './past-training/past-training.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    findComponent,
    findEl,
    spyOnObj,
} from '../spec-helpers/element.spec-helper';
import { AuthService } from '../auth/auth.service';

describe('TrainingComponent', () => {
    let component: TrainingComponent;
    let fixture: ComponentFixture<TrainingComponent>;
    let trainingServiceSpy: Pick<
        TrainingService,
        'exerciseChangedNotifier' | 'exerciseChangedGetter'
    >;

    // let trainingServiceSpy = jasmine.createSpyObj(
    //     "TrainingService",
    //     ["getAvailableExercises"]
    // );
    // trainingServiceSpy.exerciseChanged$ = new Subject<FinishedExercise>();

    class TrainingServiceMock {
        constructor(private exerciseChanged$: Subject<FinishedExercise>) {}

        exerciseChangedGetter(): Subject<FinishedExercise> {
            return this.exerciseChanged$;
        }

        exerciseChangedNotifier(finishedExercise: FinishedExercise): void {
            this.exerciseChanged$.next(finishedExercise);
        }
    }

    beforeEach(async () => {
        let exerciseChanged$ = new Subject<FinishedExercise>();

        trainingServiceSpy = new TrainingServiceMock(exerciseChanged$);
        spyOnObj(TrainingServiceMock);
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatTabsModule],
            providers: [
                {
                    provide: TrainingService,
                    useValue: trainingServiceSpy,
                },
            ],
            declarations: [
                TrainingComponent,
                // MockComponent(NewTrainingComponent),
                // MockComponent(PastTrainingComponent),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TrainingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('create HomeComponent', () => {
        expect(component).toBeTruthy();
    });

    // it('find NewTrainingComponent', () => {
    //     let newTraining: NewTrainingComponent;
    //     const newTrainingEl = fixture.debugElement.query(
    //         // Original class!
    //         By.directive(NewTrainingComponent)
    //     );
    //     console.log("newTrainingEl: ")
    //     console.log(newTrainingEl)
    //     newTraining = newTrainingEl.componentInstance;
    //     expect(newTraining).toBeTruthy();
    // });
    //
    // it('find PastTrainingComponent',
    //     fakeAsync(() => {
    //             let pastTraining: PastTrainingComponent;
    //             const pastTrainingEl = fixture.debugElement.query(
    //                 // Original class!
    //                 By.directive(PastTrainingComponent)
    //             );
    //             console.log("pastTrainingEl: ")
    //             console.log(pastTrainingEl)
    //             pastTraining = pastTrainingEl.componentInstance;
    //             tick()
    //             fixture.detectChanges();
    //             expect(pastTraining).toBeTruthy();
    //         }
    //     ));

    it('find new training component', () => {
        const newTraining = findComponent(fixture, 'app-new-training');

        expect(newTraining).toBeTruthy();
    });

    // it('find past training component', () => {
    //     const pastTraining = findComponent(fixture, 'app-past-training');
    //     expect(pastTraining).toBeTruthy();
    // });

    // TODO problem with async
    it('find past training component', async () => {
        // let compiled = fixture.nativeElement;
        fixture.debugElement
            .queryAll(By.css('.mat-tab-label'))[1]
            .nativeElement.click();

        fixture.detectChanges();
        // flush()
        // tick()
        // await fixture.whenStable().then(() => {
        //
        //     // expect(compiled.querySelector('app-past-training')).toBeTruthy();
        //     // const pastTraining = findComponent(fixture, 'app-past-training');
        //     // expect(pastTraining).toBeTruthy();
        // });
        await fixture.whenStable();
        const pastTraining = findComponent(fixture, 'app-past-training');

        expect(pastTraining).toBeTruthy();
    });

    // it('should display registration form after clicking second tab',
    //     fakeAsync(() => {
    //         let compiled = fixture.nativeElement;
    //         fixture.debugElement
    //             .queryAll(By.css('.mat-tab-label'))[1]
    //             .nativeElement
    //             .click();
    //         // compiled.querySelectorAll('mat-tab')[1].click();
    //         // const matTab = findEl(fixture, 'tab2');
    //         // console.log("matTab: ");
    //         // console.log(matTab);
    //         // console.log("compiled: ");
    //         // console.log(compiled);
    //         tick();
    //         fixture.detectChanges();
    //
    //         expect(compiled.querySelector('app-past-training')).toBeTruthy();
    //
    //     })
    // );
});
