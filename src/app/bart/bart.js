class BartService {
  constructor($indexedDB) {
    this.$indexedDB = $indexedDB;

    this.initTransitDb();
  }

  getStops() {
    const url = `${apiUrl}/stops?${apiKey}${op}`;

    return this.$indexedDB.openStore('stops', store => {
      return store.getAll();
    }).then(stops => {
      if (stops !== undefined) {
        return stops;
      }

      return fetch(url).then(res => {
        return res.json();
      }).then(stops => {
        const stopPoints = stops.Contents.dataObjects.ScheduledStopPoint;

        this.$indexedDB.openStore('stops', store => {
          store.insert(stopPoints).then(e => {
            return stopPoints;
          }).catch(err => {
            return Error(err);
          });
        });
        return stopPoints;
      }).catch(err => {
        return Error(err);
      });
    });
  }

  getStopSchedule(stopId) {
    const url = `${apiUrl}/stoptimetable?${apiKey}&OperatorRef=BART&MonitoringRef=${stopId}`;
    const now = new Date();

    return this.$indexedDB.openStore('scheduledStops', store => {
      return store.find(stopId);
    }).then(schedule => {

      return schedule.schedule.filter(item => new Date(item.ArrivalTime) > now);
    }).catch(err => {
      // thanks to angular indexedDB library, an error is thrown when store.find() returns nothing
      return fetch(url).then(res => {
        return res.json();
      }).then(schedule => {
        const scheduleItems = schedule.Siri.ServiceDelivery.StopTimetableDelivery.TimetabledStopVisit.map(stop => {
          const data = stop.TargetedVehicleJourney;

          return {LineRef: data.LineRef,
                  DatedVehicleJourneyRef: data.DatedVehicleJourneyRef,
                  ArrivalTime: data.TargetedCall.AimedArrivalTime,
                  DepartureTime: data.TargetedCall.AimedDepartureTime
          };
        });

        const scheduleObject = {stopId, schedule: scheduleItems};

        this.$indexedDB.openStore('scheduledStops', store => {
          store.insert(scheduleObject).then(e => {
          }).catch(err => {
            return Error(err);
          });
        });

        return scheduleItems;
      }).catch(err => {
        return Error(err);
      });
    });
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
        this.$indexedDB.openStore('patterns', store => {
          store.insert({lineId, pattern: pattern.journeyPatterns}).then(e => {

          }).catch(err => {
            return Error(err);
          });
        });

        return pattern.journeyPatterns;
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
    /*
        return {LineRef: data.LineRef,
                DatedVehicleJourneyRef: data.DatedVehicleJourneyRef,
                ArrivalTime: data.TargetedCall.AimedArrivalTime,
                DepartureTime: data.TargetedCall.AimedDepartureTime
        };
      });
      */

    let routes = new Map();

    return Promise.all([this.getStopSchedule(departStopId), this.getStopSchedule(arriveStopId)]).then(schedules => {
      console.table(schedules[0]);
      console.table(schedules[1]);
      schedules[0].forEach(sched => {
        let journey = sched.DatedVehicleJourneyRef;
        let depTime = new Date(sched.DepartureTime);

        for (let sched2 of schedules[1]) {
          let journey2 = sched2.DatedVehicleJourneyRef;
          let arrTime = new Date(sched2.ArrivalTime);

          if (journey2 === journey && depTime < arrTime) {
            routes.set(sched.DepartureTime, { Line: sched.LineRef, ArrivalTime: arrTime});
            break;
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
        const now = new Date();
        schedules.forEach(schedule => {
          const sched = schedule.schedule.filter(item => new Date(item.ArrivalTime) > now);

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

  initTransitDb() {
    this.cleanStopSchedules();
    this.getStops().then(stops => { console.log(stops); });
    this.getStopSchedule("12018506").then(res => {console.log(res);});

    console.time("start");
    this.getRoute("12018502", "12018518").then(result => {
      console.log(result);
      console.timeEnd("start");
    }); 
  }
}
