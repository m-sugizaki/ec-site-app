/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http'


import { AuthInterceptor } from './auth-interceptor'

// import { CachingInterceptor } from './caching-interceptor'
// import { EnsureHttpsInterceptor } from './ensure-https-interceptor'
// import { TrimNameInterceptor } from './trim-name-interceptor'
// import { UploadInterceptor } from './upload-interceptor'

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [

  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

]
