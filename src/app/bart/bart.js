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
        console.log("stored dsops: "+stops.length);
        return stops;
      });
    });

    return fetch(url)
    .then(res => {
      return res.json();
    }).then(stops => {
      this.stops = stops.Contents.dataObjects.ScheduledStopPoint;

      this.$indexedDB.openStore('stops', store => {
        store.insert(this.stops).then(e => {
          // do something
          console.log(`Added stops to db`);
        }).catch(err => {
          return Error(err);
        });
      });
      return this.stops;
    }).catch(err => {
      return Error(err);
    });
  }

  getStopSchedule(stopId) {
    const url = `${apiUrl}/stoptimetable?${apiKey}&OperatorRef=BART&MonitoringRef=${stopId}`;

    this.$indexedDB.openStore('scheduledStops', store => {
      store.find(stopId).then(schedule => {
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
          console.log(`Added scheule to db`);
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

  initTransitDb() {
    this.getStops().then(stops => {
      console.log("STOPS");
      console.log(stops);
    });

    this.getPattern("OAKL/COLS").then(pattern => {
      console.log("SDF");
      console.log(pattern);
    });

    this.getStopSchedule("12018501").then(sched => {
      console.log(sched);
    });
  }
}
