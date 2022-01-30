import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FinishedExercise } from '../finished-exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../state/training.reducer';

@Component({
    selector: 'app-past-training',
    templateUrl: './past-training.component.html',
    styleUrls: ['./past-training.component.css'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
    public displayedColumns = ['date', 'name', 'calories', 'duration', 'state'];
    public dataSource = new MatTableDataSource<FinishedExercise>();
    @ViewChild(MatSort)
    private sort!: MatSort;

    @ViewChild(MatPaginator)
    private paginator!: MatPaginator;

    private finishedExercisesSubscribtion: Subscription = new Subscription();

    constructor(
        private trainingService: TrainingService,
        private store: Store<fromTraining.State>
    ) {}

    ngOnInit(): void {
        this.store
            .select(fromTraining.getFinishedExercises)
            .subscribe((exercises: FinishedExercise[]) => {
                this.dataSource.data = exercises;
            });

        // this.finishedExercisesSubscribtion =
        //     this.trainingService
        //         .finishedExercisesChangedGetter()
        //         .subscribe(
        //             (exercises: FinishedExercise[]) => {
        //                 this.dataSource.data = exercises;
        //             },
        //             (error) => {
        //                 console.log('error :', error)
        //             }
        //         )

        this.trainingService.getCompletedOrCanceledExercises();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    // doFilter(filterValue: string) {
    //     this.dataSource.filter = filterValue
    // }
    doFilter(event: KeyboardEvent) {
        this.dataSource.filter = (event.target as HTMLInputElement).value
            .trim()
            .toLowerCase();
    }

    ngOnDestroy() {
        // this.finishedExercisesSubscribtion.unsubscribe();
    }
}
