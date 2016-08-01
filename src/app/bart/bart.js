class BartService {

  getStops() {
    const url = `${apiUrl}/stops?${apiKey}${op}`;
    return fetch(url)
    .then(res => {
      return res.json();
    }).then(stops => {
      return stops;
    }).catch(err => {
      return Error(err);
    });
  }

  getLines() {
    const url = `${apiUrl}/lines?${apiKey}${op}`;
    return fetch(url)
    .then(res => {
      return res.json();
    }).then(lines => {
      console.log(lines);
      return lines;
    }).catch(err => {
      return Error(err);
    });
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

  initTransitDb() {
    getStops().then(stops => {
      console.log("STOPS");
      console.log(stops);
    });
    getLines().then(lines => {
      console.log("LINES");
      console.log(lines);
    });
    /* .then(lines => {
      lines.forEach(line => {
        getPattern(line);
      });
    });*/
  }
}
