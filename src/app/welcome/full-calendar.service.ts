import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FullCalendarService {

    constructor(
        private http: HttpClient
    ) {
    }

    public getEvents(): Observable<any> {
        return this.http
            .get<any>(
                '/api/full_calendar/'
            )
            .pipe(
                map(
                    (data: any) => {
                        return data
                    }),
                catchError((error) => {

                    console.log('error');
                    console.log(error);

                    return of([]);
                })
            )
    }
}
