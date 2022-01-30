import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../state/training.reducer';
import { FinishedExercise } from '../finished-exercise.model';
import { pipe } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-current-training',
    templateUrl: './current-training.component.html',
    styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
    progress = 0;
    // timer: ReturnType<typeof setTimeout>;
    timer: number = 0;

    constructor(
        private dialog: MatDialog,
        private trainingService: TrainingService,
        private store: Store<fromTraining.State>
    ) {}

    ngOnInit(): void {
        this.startOrResume();
    }

    startOrResume() {
        this.store
            .select(fromTraining.getActiveTraining)
            .pipe(take(1))
            .subscribe((ex: FinishedExercise | null) => {
                let duration = ex?.duration;
                const step = duration ? (duration * 1000) / 100 : 1;
                // const step = (duration*1000 / 100) ;

                this.timer = window.setInterval(() => {
                    console.log('setInterval');
                    if (this.progress >= 100) {
                        clearInterval(this.timer);
                        this.trainingService.completeExercise();
                    } else this.progress += 1;
                }, step);
            });
        // let duration = this.trainingService
        //     .getRunningExercise()
        //     .duration;
        // const step = duration ? (duration * 1000 / 100) : 1;
        // // const step = (duration*1000 / 100) ;
        // this.timer = window.setInterval(() => {
        //     console.log("setInterval");
        //     if (this.progress >= 100) {
        //         clearInterval(this.timer);
        //         this.trainingService.completeExercise()
        //     } else {
        //         this.progress += 1;
        //     }
        // }, step);
    }

    onStop(): void {
        clearInterval(this.timer);
        const dialog = this.dialog.open(StopTrainingComponent, {
            data: {
                progress: this.progress,
            },
        });

        dialog.afterClosed().subscribe(
            (result) => {
                if (result)
                    // this.trainingExit.emit();
                    this.trainingService.cancelExercise(this.progress);
                else this.startOrResume();
            },
            (error) => {
                console.log('error :', error);
            }
        );
    }
}
