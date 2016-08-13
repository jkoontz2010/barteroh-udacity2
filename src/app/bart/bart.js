class BartService {
  constructor($indexedDB) {
    this.$indexedDB = $indexedDB;

    this.initTransitDb();
  }

  storeStops(apiResult) {
    const stopPoints = apiResult.Contents.dataObjects.ScheduledStopPoint;

    this.$indexedDB.openStore('stops', store => {
      store.insert(stopPoints).then(e => {
        return stopPoints;
      }).catch(err => {
        return Error(err);
      });
    });

    return stopPoints;
  }
  getStops() {
    const url = `${apiUrl}/stops?${apiKey}${op}`;

    return this.$indexedDB.openStore('stops', store => {
      return store.getAll();
    }).then(stops => {
      if (stops !== undefined && stops.length > 0) {
        return stops;
      }

      return fetch(url).then(res => {
        return res.json();
      }).then(stops => {
        return this.storeStops(stops);
      }).catch(err => {
        return Error(err);
      });
    });
  }

  storeStopSchedule(apiResult, stopId) {
    const scheduleItems = apiResult.Siri.ServiceDelivery.StopTimetableDelivery.TimetabledStopVisit.map(stop => {
      const data = stop.TargetedVehicleJourney;
      const journey = data.DatedVehicleJourneyRef;
      const sched = {};

      sched[journey] = {LineRef: data.LineRef,
              ArrivalTime: data.TargetedCall.AimedArrivalTime,
              DepartureTime: data.TargetedCall.AimedDepartureTime
      };

      return sched;
    });

    const scheduleObject = {stopId, schedule: scheduleItems};

    this.$indexedDB.openStore('scheduledStops', store => {
      store.insert(scheduleObject).then(e => {
      }).catch(err => {
        return Error(err);
      });
    });

    return scheduleItems;
  }

  getStopSchedule(stopId) {
    const url = `${apiUrl}/stoptimetable?${apiKey}&OperatorRef=BART&MonitoringRef=${stopId}`;

    return this.$indexedDB.openStore('scheduledStops', store => {
      return store.find(stopId);
    }).then(schedule => {
      return this.getFutureDatesOnly(schedule);
    }).catch(err => {
      // thanks to angular indexedDB library, an error is thrown when store.find() returns nothing
      return fetch(url).then(res => {
        return res.json();
      }).then(schedule => {
        return this.storeStopSchedule(schedule, stopId);
      }).catch(err => {
        return Error(err);
      });
    });
  }

  storePattern(apiResult, lineId) {
    this.$indexedDB.openStore('patterns', store => {
      store.insert({lineId, pattern: apiResult.journeyPatterns}).then(e => {

      }).catch(err => {
        return Error(err);
      });
    });

    return apiResult.journeyPatterns;
  }

  getPattern(lineId) {
    const url = `${apiUrl}/patterns?${apiKey}${op}&line_id=${lineId}`;

    return this.$indexedDB.openStore('patterns', store => {
      return store.find(lineId);
    }).then(pattern => {
      if (pattern !== undefined) {
        return pattern;
      }

      return fetch(url)
      .then(res => {
        return res.json();
      }).then(pattern => {
        return this.storePattern(pattern);
      }).catch(err => {
        return Error(err);
      });
    });
  }

  connectDepartToArrive(departStopId, departLinePatterns, arriveStopId) {
    let matches = [];
    departLinePatterns.forEach((pattern, lineId) => {
      //console.log(`PATTERN`);
      //console.log(pattern);
      for (let stop of pattern[0].PointsInSequence.TimingPointInJourneyPattern) {
        if (stop.ScheduledStopPointRef === arriveStopId) {
          matches.push(lineId);

        }
      }

    });

    console.log(matches);
    return matches;
  }
  getRoute(departStopId, arriveStopId) {
    let routes = new Map();

    return Promise.all([this.getStopSchedule(departStopId), this.getStopSchedule(arriveStopId)]).then(schedules => {
      schedules[0].forEach(sched => {
        // the key is the journey ref
        const schedKey = Object.keys(sched)[0];

        if (schedules[1][schedKey] !== undefined) {
          let depTime = new Date(sched[schedKey].DepartureTime);
          let arrTime = new Date(schedules[1][schedKey].ArrivalTime);

          if (depTime < arrTime) {
            routes.set(sched.DepartureTime, {Line: sched.LineRef, ArrivalTime: arrTime});
          }
        }
      });
      return routes;
    }).catch(error => {
      return Error(error);
    });
  }
  /*
  * Removes old schedules and retrieves new ones for line(s) once present in IndexedDB if schedule is empty
  */
  cleanStopSchedules() {
    this.$indexedDB.openStore('scheduledStops', store => {
      store.getAll().then(schedules => {
        schedules.forEach(schedule => {
          const sched = this.getFutureDatesOnly(schedule);

          if (sched.length === 0) {
            store.delete(schedule.stopId);
            this.getStopSchedule(schedule.stopId);
          }
        });
        return schedules;
      }).catch(err => {
        return Error(err);
      });
    });
  }

  getFutureDatesOnly(schedule) {
    const now = new Date();
    return schedule.schedule.filter(journey => {
      const jdate = new Date(journey[Object.keys(journey)[0]].ArrivalTime);

      if (now < jdate) {
        return journey;
      }
    });
  }

  initTransitDb() {
    this.cleanStopSchedules();
    //this.getStops().then(stops => { console.log(stops); });
    //this.getStopSchedule("12018504").then(res => {console.log(res);});

    this.getRoute("12018502", "12018518").then(result => {
      console.log(result);
    });
  }
}
