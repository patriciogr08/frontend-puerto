import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ManagerService {

    constructor(
        private httpClient: HttpClient,
        @Inject(Restangular) public restangular,
    ) { }

    getUsers(): Observable<any> {
        return this.restangular.all('users').getList();
    }

    /**
 * Get contacts
 */
    getUsersMock(): Observable<Array<any>> {
        return this.httpClient.get<Array<any>>('api/apps/users').pipe(
            tap((users) => {
                return users;
            })
        );
    }
}