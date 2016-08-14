angular
  .module('app', ['ui.router', 'indexedDB'])
  .service('bartService', BartService)
  .config($indexedDBProvider => {
    $indexedDBProvider
      .connection('transitDB')
      .upgradeDatabase(1, (event, db) => {
        db.createObjectStore('stops', {keyPath: 'id'});
        db.createObjectStore('lines', {keyPath: 'Id'});
        db.createObjectStore('patterns', {keyPath: 'lineId'});

        db.createObjectStore('scheduledStops', {keyPath: 'stopId'});
        db.createObjectStore('savedSchedules', {keyPath: 'departStop'});
        db.createObjectStore('savedTransferRoutes');
      });
  });
