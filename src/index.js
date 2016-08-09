angular
  .module('app', ['ui.router', 'indexedDB'])
  .service('bartService', BartService)
  .config($indexedDBProvider => {
    $indexedDBProvider
      .connection('transitDB')
      .upgradeDatabase(1, (event, db) => {
        db.createObjectStore('stops', {keyPath: 'id'});
        db.createObjectStore('lines', {keyPath: 'Id'});
        const patternStore = db.createObjectStore('patterns');

        db.createObjectStore('scheduledStops', {keyPath: 'stopId'});
      });
  });
