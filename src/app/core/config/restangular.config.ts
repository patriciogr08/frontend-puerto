import { InjectionToken } from "@angular/core";
import { environment } from "environments/environment";
import { Restangular } from "ngx-restangular";

// Function for setting the default restangular configurations
export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setBaseUrl(environment.baseUrl);
}

//Restangular service that uses tenant subdomain
export const RESTANGULAR_TENANT = new InjectionToken<any>('RestangularTenant');
export function RestangularTenantFactory(restangular: Restangular) {
  return restangular.withConfig((RestangularConfigurer) => {
    RestangularConfigurer.setBaseUrl(environment.baseUrl);
  });
}