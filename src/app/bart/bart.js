class BartService {
  constructor($indexedDB) {
    this.$indexedDB = $indexedDB;
    this.stops = [];
    this.lines = [];
    this.timetables = [];
    this.stopSchedules = new Map();

    initTransitDb();
  }

  getStops() {
    const url = `${apiUrl}/stops?${apiKey}${op}`;

    if (this.stops.length === 0) {
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
    console.log("stores stops");
    return this.stops;
  }

  getStopSchedule(stopId) {
    const url = `${apiUrl}/stoptimetable?${apiKey}&OperatorRef=BART&MonitoringRef=${stopId}`;

    // if stopId not in this.stopSchedules.keys()
    return fetch(url).then(res => {
      return res.json();
    }).then(times => {
      return times;
    }).catch(err => {
      return Error(err);
    });
  }

  getLines() {
    const url = `${apiUrl}/lines?${apiKey}${op}`;

    if (this.lines.length === 0) {
      return fetch(url)
      .then(res => {
        return res.json();
      }).then(lines => {
        this.lines = lines;
        this.$indexedDB.openStore('lines', store => {
          store.insert(this.lines).then(e => {
            // do something
            console.log(`Added lines to db`);
          }).catch(err => {
            return Error(err);
          });
        });
        return lines;
      }).catch(err => {
        return Error(err);
      });
    }
    console.log("stored lines");
    return this.lines;
  }

  getPattern(lineId) {
    const url = `${apiUrl}/patterns?${apiKey}${op}&line_id=${lineId}`;
    return fetch(url)
    .then(res => {
      return res.json();
    }).then(pattern => {
      console.log(pattern);
      return pattern;
    }).catch(err => {
      return Error(err);
    });
  }

  getTimetable(lineId) {
    const url = `${apiUrl}/timetable?${apiKey}${op}&line_id=${lineId}`;

    if (this.lines.length === 0) {
      return fetch(url)
      .then(res => {
        return res.json();
      }).then(timetable => {
        /* this.lines = lines;
        this.$indexedDB.openStore('lines', store => {
          store.insert(this.lines).then(e => {
            // do something
            console.log(`Added lines to db`);
          }).catch(err => {
            return Error(err);
          });
        });
        return lines;
        */
        console.log(timetable);
      }).catch(err => {
        return Error(err);
      });
    }
    console.log("stored lines");
    return this.lines;
  }

  initTransitDb() {
    /* this.getStops().then(stops => {
      console.log("STOPS");
      console.log(stops);
    }); */
    this.getLines().then(lines => {
      console.log("LINES");
      console.log(lines);
      return lines;
    }).then(lines => {
      /* console.log("PATTERNS");
      lines.forEach(line => {
        this.getPattern(line.Id).then(pattern => {
          console.log(line.Id);
          console.log(pattern);
        });
      });*/
    });

    this.getStopSchedule("12018504").then(res => {
      console.log(res);
    });
    /* .then(lines => {
      lines.forEach(line => {
        getPattern(line);
      });
    });*/
    this.$indexedDB.openStore('stops', store => {
          // single item
      store.getAll().then(stops => {
        // Update scope
        this.stops = stops;
        console.log("stored dsops: "+this.stops.length);
      });
    }).then(() => {
      console.log("GETTING");
      this.getStops();
    });

    this.$indexedDB.openStore('lines', store => {
        // single item
      store.getAll().then(lines => {
        // Update scope
        this.lines = lines;
        console.log("stored lines: "+this.lines.length);
      });
    }).then(() => {
      console.log("GETTING lines");
      this.getLines();
    });

    this.getTimetable("FREMONT/DALY");
    this.getPattern("BAY PT/SFIA");
  }
}