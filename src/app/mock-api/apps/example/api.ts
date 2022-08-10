import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { contacts as contactsData, countries as countriesData, tags as tagsData } from 'app/mock-api/apps/contacts/data';
import { users } from './data';

@Injectable({
    providedIn: 'root'
})
export class UsersMockApi {
    private _users: any[] = users;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Register Mock API handlers
    */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Users - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/users')
            .reply(() => {

                // Clone the contacts
                const users = cloneDeep(this._users);

                // Return the response
                return [200, users];
            });
    }

}
