class MainSection {
  /** @ngInject */
  constructor(bartService, $indexedDB) {
    this.bartService = bartService;
    this.$indexedDB = $indexedDB;
    this.updateIdb();
  }
  updateIdb() {
    console.log("HERE");
    this.$indexedDB.openStore('patterns', store => {
        // single item
      store.getAll().then(topics => {
        // Update scope
        console.log(topics);
      });
    });

    this.bartService.initTransitDb();
  }

}

angular
  .module('app')
  .component('mainSection', {
    templateUrl: 'app/components/MainSection.html',
    controller: MainSection
  });
