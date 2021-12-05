import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../exercise.model";
import {TrainingService} from "../training.service";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-past-training',
    templateUrl: './past-training.component.html',
    styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
    public displayedColumns = ['date', 'name', 'calories', 'duration', 'state']
    public dataSource = new MatTableDataSource<Exercise>()
    @ViewChild(MatSort)
    private sort!: MatSort;

    constructor(private trainingService: TrainingService) {
    }

    ngOnInit(): void {
        this.dataSource.data = this.trainingService.getCompletedOrCanceledExercises()
    }

    ngAfterViewInit() {
           this.dataSource.sort = this.sort;
    }
}
