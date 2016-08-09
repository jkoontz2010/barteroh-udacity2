class MainSection {
  /** @ngInject */
  constructor(bartService, $indexedDB) {
    this.bartService = bartService;
    this.$indexedDB = $indexedDB;
    this.updateIdb();
  }
  updateIdb() {
    // this.bartService.initTransitDb();
  }

}

angular
  .module('app')
  .component('mainSection', {
    templateUrl: 'app/components/MainSection.html',
    controller: MainSection
  });
