# barteroh-udacity2
Offline-capable/progressive web app for getting a BART route schedule.

To view offline capabaility, run the app locally, select a Departure and Arrival stop, kill the server after the routes are displayed, refresh the page.

## Stack
* ES6 w/Babel
* Angular JS 1.5 Components
* Service Workers
* IndexedDB
* SASS & [Bootstrap-SASS](https://github.com/twbs/bootstrap-sass)

## Run Locally

Clone from GitHub:

`git clone https://github.com/jkoontz2010/barteroh-udacity2.git`

Enter the directory and install dependencies:
```
npm install
bower install
```
Run with [Gulp 4](http://gulpjs.com/):

`gulp serve`

Kill the server and revisit localhost for offline version of app.
