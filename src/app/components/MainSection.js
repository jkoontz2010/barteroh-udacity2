class MainSection {
  /** @ngInject */
  constructor(bartService, $indexedDB, $scope) {
    this.bartService = bartService;

    this.stops = [];
    this.fromStation = '';
    this.toStation = '';
    this.hasRoutes = false;
    this.showOffline = false;

    this.bartService.initTransitDb();
    this.$scope = $scope;
    this.activate();
  }

  getRoute() {
    this.hasRoutes = false;
    this.showOffline = false;

    console.log(this.fromStation);
    console.log(this.toStation);

    this.bartService.getRoute(this.fromStation, this.toStation).then(results => {
      console.log(results);
      if (Object.keys(results).length > 0) {
        this.hasRoutes = true;
      }
    });
  }

  viewSaved() {
    this.hasRoutes = false;
    this.bartService.getSavedRoutes().then(results => {
      this.showOffline = true;
    });
  }

  activate() {
    this.bartService.getStops().then(stops => {
      this.stops = stops;
    });
  }

}

angular
  .module('app')
  .component('mainSection', {
    templateUrl: 'app/components/MainSection.html',
    controller: MainSection
  })
  .filter('bartStop', () => {
    return function (input) {
      let words = input.split(" ");
      words = words.map(word => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });

      return words.join(" ").substr(5);
    };
  });
