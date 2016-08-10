class BartService {
  constructor($indexedDB) {
    this.$indexedDB = $indexedDB;

    this.initTransitDb();
  }

  getStops() {
    const url = `${apiUrl}/stops?${apiKey}${op}`;

    this.$indexedDB.openStore('stops', store => {
          // single item
      store.getAll().then(stops => {
        // Update scope
        return stops;
      });
    });

    return fetch(url)
    .then(res => {
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
  }

  getStopSchedule(stopId) {
    const url = `${apiUrl}/stoptimetable?${apiKey}&OperatorRef=BART&MonitoringRef=${stopId}`;
    const now = new Date();

    this.$indexedDB.openStore('scheduledStops', store => {
      store.find(stopId).then(schedule => {
        // only return schedules where the current time < AimedArrivalTime
        schedule = schedule.schedule.filter(item => new Date(item.ArrivalTime) > now);

        return schedule;
      }).catch(err => {
        return Error(err);
      });
    });

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

      return scheduleObject;
    }).catch(err => {
      return Error(err);
    });
  }

  getPattern(lineId) {
    const url = `${apiUrl}/patterns?${apiKey}${op}&line_id=${lineId}`;

    this.$indexedDB.openStore('patterns', store => {
      store.find(lineId).then(pattern => {
        return pattern;
      }).catch(err => {
        return Error(err);
      });
    });

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
    this.getStops();
  }
}
