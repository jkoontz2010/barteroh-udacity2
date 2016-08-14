class Schedule {

  constructor(bartService) {
    this.bartService = bartService;
    this.scheduleItems = this.bartService.getRoutes();
    this.selectedStops = this.bartService.getSelectedStops();
  }

}

angular
  .module('app')
  .component('schedule', {
    templateUrl: 'app/components/Schedule.html',
    controller: Schedule
  });
