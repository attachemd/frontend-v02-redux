import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model"

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
    @Output()
    public startTraining: EventEmitter<void> = new EventEmitter<void>();
    exercises: Exercise[] = []

    constructor(private trainingService: TrainingService) {
    }

    ngOnInit(): void {
        this.exercises = this.trainingService.getExercises();
    }

    onStartTraining() {
        this.startTraining.emit()
    }

}
