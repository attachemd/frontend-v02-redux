import {
    AfterViewInit,
    Component, OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../exercise.model";
import {TrainingService} from "../training.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-past-training',
    templateUrl: './past-training.component.html',
    styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent
    implements OnInit,
        AfterViewInit,
        OnDestroy {
    public displayedColumns = [
        'date',
        'name',
        'calories',
        'duration',
        'state'
    ]
    public dataSource = new MatTableDataSource<Exercise>()
    @ViewChild(MatSort)
    private sort!: MatSort;
    @ViewChild(MatPaginator)
    private paginator!: MatPaginator;
    private finishedExercisesSubscribtion: Subscription =
        new Subscription();

    constructor(private trainingService: TrainingService) {
    }

    ngOnInit(): void {

        this.finishedExercisesSubscribtion =
            this.trainingService
                .finishedExercisesChanged
                .subscribe(
                    (exercises: Exercise[]) => {
                        this.dataSource.data = exercises;
                    },
                    (error) => {
                        console.log('error :', error)
                    }
                )

        this.trainingService
            .getCompletedOrCanceledExercises();

    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    // doFilter(filterValue: string) {
    //     this.dataSource.filter = filterValue
    // }
    doFilter(event: KeyboardEvent) {
        this.dataSource.filter = (
            event.target as HTMLInputElement
        )
            .value
            .trim()
            .toLowerCase()
    }

    ngOnDestroy() {
        this.finishedExercisesSubscribtion.unsubscribe();
    }
}
