import {Component, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model"
import {NgForm} from "@angular/forms";
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
    exercises: Observable<any> = new Observable()
    // exercises: Exercise[] = []

    constructor(
        private trainingService: TrainingService,
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {
        // this.exercises = this.trainingService.getAvailableExercises();
        this.exercises = this.http
            .get(
                '/api/exercises/'
            )
    }

    onStartTraining(form: NgForm) {
        this.trainingService.startExercise(form.value.exercise)
    }

}
