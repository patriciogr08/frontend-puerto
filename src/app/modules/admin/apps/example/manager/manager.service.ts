import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ManagerService {

    constructor(
        @Inject(Restangular) public restangular,
    ) { }

    getUsers(): Observable <any> {
        return this.restangular.all('users').getList();
    }
}