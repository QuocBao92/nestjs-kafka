export interface IMOUrlConfig {
  orderService: {
    orderDetailWithOrderNumber: string;
    orders: string;
    orderCurrencyDenominations: string;
    orderStatuses: string;
  };
  citService: {
    cits: string;
    citsWithCitId: string;
    entryDefault: string;
  };
  retailService: {
    companyLocations: string;
    companyLocationsCitRelations: string;
    locations: string;
  };
  calendarService: {
    calendars: string;
    calendarsWithCalendarId: string;
    entryDefault: string;
    holidayCalendars: string;
    calendarTypes: string;
  };
  assetService: {
    assets: string;
    assetSettingsWithAssetId: string;
  };
}
