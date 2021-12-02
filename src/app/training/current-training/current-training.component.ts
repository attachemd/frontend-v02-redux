import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StopTrainingComponent} from './stop-training.component';

@Component({
    selector: 'app-current-training',
    templateUrl: './current-training.component.html',
    styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
    @Output()
    trainingExit: EventEmitter<void> = new EventEmitter<void>();
    progress = 0;
    timer: number = 0;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.startOrResume();
    }

    startOrResume() {
        this.timer = setInterval(() => {

            if (this.progress >= 100) {
                clearInterval(this.timer);
            } else {
                this.progress += 5;
            }
        }, 1000)
    }

    onStop(): void {
        clearInterval(this.timer);
        const dialog = this.dialog.open(
            StopTrainingComponent, {
                data: {
                    progress: this.progress
                }
            }
        );
        dialog.afterClosed().subscribe(result => {
            if (result) {
                this.trainingExit.emit();
            } else {
                this.startOrResume();
            }
        })
    }

}
