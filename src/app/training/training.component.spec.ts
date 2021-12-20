import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TrainingComponent} from './training.component';
import {MockComponent} from "ng-mocks";
import {NewTrainingComponent} from "./new-training/new-training.component";
import {TrainingService} from "./training.service";
import {Subject} from 'rxjs';
import {FinishedExercise} from "./finished-exercise.model";
import {MatTabsModule} from "@angular/material/tabs";
import {PastTrainingComponent} from './past-training/past-training.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {By} from "@angular/platform-browser";
import {NgZone, NO_ERRORS_SCHEMA} from "@angular/core";
import {findComponent} from "../spec-helpers/element.spec-helper";

fdescribe('TrainingComponent', () => {
    let component: TrainingComponent;
    let fixture: ComponentFixture<TrainingComponent>;

    let trainingServiceSpy = jasmine.createSpyObj("TrainingService", ["getAvailableExercises"]);
    trainingServiceSpy.exerciseChanged$ = new Subject<FinishedExercise>();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatTabsModule
            ],
            providers: [
                {
                    provide: TrainingService,
                    useValue: trainingServiceSpy
                }
            ],
            declarations: [
                TrainingComponent,
                // MockComponent(NewTrainingComponent),
                // MockComponent(PastTrainingComponent),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
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
});
