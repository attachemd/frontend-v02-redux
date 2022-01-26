import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
    @Input()
    data: any;
    isAvailable: boolean = true;

    constructor() {
    }

    ngOnInit(): void {
        // console.log("///////// data /////////");
        // console.log(this.data);
        // console.log(this.data?.event._def.publicId);
    }

}
