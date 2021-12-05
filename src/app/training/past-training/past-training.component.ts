import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../exercise.model";
import {TrainingService} from "../training.service";

@Component({
    selector: 'app-past-training',
    templateUrl: './past-training.component.html',
    styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit {
    public displayedColumns = ['date', 'name', 'calories', 'duration', 'state']
    public dataSource = new MatTableDataSource<Exercise>()

    constructor(private trainingService: TrainingService) {
    }

    ngOnInit(): void {
        this.dataSource.data = this.trainingService.getCompletedOrCanceledExercises()
    }

}
