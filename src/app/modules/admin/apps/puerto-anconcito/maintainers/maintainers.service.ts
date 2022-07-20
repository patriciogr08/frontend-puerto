import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MaintainersService {

    constructor(
        @Inject(Restangular) public restangular: Restangular,
    ) { }

    getClients(pagination: boolean, paginationPageSize: number, page: number): Observable<any> {
        const query = {
            pagination: Number(pagination),
            per_page: paginationPageSize,
            page: page
        }
        return this.restangular.all('').customGET('clientes', query);
    }
}