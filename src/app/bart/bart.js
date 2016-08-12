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
    let depLines = new Set();
    let arrLines = new Set();

    let depLinePatterns = new Map();
    let arrLinePatterns = new Map();

    return this.getStopSchedule(departStopId).then(schedule => {
      schedule.forEach(sched => {
        depLines.add(sched.LineRef);
      });
      console.log(depLines);

      let patternPromises = [];
      depLines.forEach(line => {
        patternPromises.push(this.getPattern(line));
        console.log("!");
      });

      Promise.all(promises).then(() => {
        let lineMatches = this.connectDepartToArrive(departStopId, depLinePatterns, arriveStopId);
        console.log(depLinePatterns);
        return schedule.filter(sched => {
          return lineMatches.indexOf(sched.LineRef) !== -1;
        });
      });

      return patternPromises;
    }).catch(error => {
      return Error(error);
    });
/*
    // if no connected patterns, then grab arrival lines and see where we canf ind a match
    const arrSchedule = this.getStopSchedule(arriveStopId).then(schedule => {
      schedule.forEach(sched => {
        arrLines.add(sched.LineRef);
      });

      arrLines.forEach(line => {
        this.getPattern(line).then(pattern => {
          arrLinePatterns.set(line, pattern);
        });
      });
    });
*/
    // Promise.all the above

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
    this.getStopSchedule("12018501").then(res => {console.log(res);});

    /*this.getRoute("12018501", "12018504").then(result => {
      console.log(result);
    });*/
  }
}
