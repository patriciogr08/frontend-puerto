import { InjectionToken } from "@angular/core";
import { environment } from "environments/environment";
import { Restangular } from "ngx-restangular";
import { AuthService } from "../auth/auth.service";

// Function for setting the default restangular configurations
export function RestangularConfigFactory(RestangularProvider, AuthService: AuthService) {
    RestangularProvider.setBaseUrl(environment.baseUrl);
    RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
      let bearerToken = AuthService.accessToken;
        
      return {
        headers: Object.assign({}, headers, {Authorization: `Bearer ${bearerToken}`})
      };
    });
}

//Restangular service that uses tenant subdomain
export const RESTANGULAR_TENANT = new InjectionToken<any>('RestangularTenant');
export function RestangularTenantFactory(restangular: Restangular) {
  return restangular.withConfig((RestangularConfigurer) => {
    RestangularConfigurer.setBaseUrl(environment.baseUrl);
  });
}