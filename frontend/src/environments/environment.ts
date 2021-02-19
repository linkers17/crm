// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://localhost:7777/api',
  API_UPLOADS: 'http://localhost:7777',
  STAGES: [
    {title: 'Привлечение клиента', value: 'prospecting'},
    {title: 'Предложение', value: 'offer'},
    {title: 'Согласование', value: 'negotiation'},
    {title: 'Закрыто успешно', value: 'closed won'},
    {title: 'Закрыто провалом', value: 'closed loose'}
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
