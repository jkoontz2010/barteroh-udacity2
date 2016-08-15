/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/app/bart/bart.js","bc486d398e9e0131b9c2ad61622fb1c0"],["/app/components/MainSection.html","6c6781625aa297d61301ede49104ecbc"],["/app/components/MainSection.js","786038e184a02d075f9ebbf4f1e6012f"],["/app/components/MainSection.spec.js","30bf8e1507ef369ee9b414e1570b9507"],["/app/components/Schedule.html","3ba80deb5704d97126e3946b81a201fc"],["/app/components/Schedule.js","6e86674646796c5c5ab81c95eeb5d69a"],["/app/constants/BartConstants.js","6cd5039ff40ef6ab4da7c23bbf1de945"],["/app/containers/App.html","75012d475a5ac7df3cd7c9dfbeb8b274"],["/app/containers/App.js","2088089eb0145e5bf52de46c786eb20c"],["/index.html","44dd96170e371869db719c8bb9318f8c"],["/index.js","9faaa6ee234335b68abb6d3e94897e82"],["/routes.js","eb2b75ead50da09a7aa9424b51594909"],["bower_components/angular-indexedDB/Gruntfile.js","aa3d881196cd816924a218a8e4346fc9"],["bower_components/angular-indexedDB/angular-indexed-db.js","5403aad788de2eca987cf0933937989c"],["bower_components/angular-indexedDB/angular-indexed-db.min.js","979a6341cd07f61e1862a9741489a55b"],["bower_components/angular-indexedDB/karma-e2e.conf.js","67b063809f4772d9f601ede0e351fc78"],["bower_components/angular-indexedDB/karma.conf.js","130b90a11598e5128efb446c8c2fade2"],["bower_components/angular-mocks/angular-mocks.js","bc501cca67446a1c077f784c98b003d0"],["bower_components/angular-mocks/ngAnimateMock.js","ed7195f7cbba99b06f95a715d6027375"],["bower_components/angular-mocks/ngMock.js","38d4e7768ae37daa27dd22d750d062fd"],["bower_components/angular-mocks/ngMockE2E.js","afaf184834005c99ba7f80720439dba2"],["bower_components/angular-ui-router/release/angular-ui-router.js","7bc040184c8a8b39cb5eed856f620415"],["bower_components/angular-ui-router/release/angular-ui-router.min.js","6fc32e732b7478ea830d1de1ffd0d6a1"],["bower_components/angular-ui-router/src/common.js","461e6f5d7b0bab271cb7f1aea78e827c"],["bower_components/angular-ui-router/src/resolve.js","50bdaf08938a9eacc0abb5dc983989b3"],["bower_components/angular-ui-router/src/state.js","a87ceb1f58b9e1b243d38c1c068d013e"],["bower_components/angular-ui-router/src/stateDirectives.js","62c301be1526699c9d8e558168679e4b"],["bower_components/angular-ui-router/src/stateFilters.js","18b68f94ab548a82d5de148a4f2bb6d3"],["bower_components/angular-ui-router/src/templateFactory.js","ae0763a83d877c17e33b577514d4ff51"],["bower_components/angular-ui-router/src/urlMatcherFactory.js","750f6610bad300ca838d92244cb26cfe"],["bower_components/angular-ui-router/src/urlRouter.js","9505c410ff39376cb28a79b5da390921"],["bower_components/angular-ui-router/src/view.js","651abd1e858d67b2c066130966f047ec"],["bower_components/angular-ui-router/src/viewDirective.js","7718706549ebbb0fb228893bcb7ab8b2"],["bower_components/angular-ui-router/src/viewScroll.js","e45db2f223481f236dc05e1192eab2e0"],["bower_components/angular/angular-csp.css","5d7bf1728c2447221cad6c6263557306"],["bower_components/angular/angular.js","fea945437030dbaf178cc608f8cf24ff"],["bower_components/angular/angular.min.js","c8ddded85c81cfcd8dd4e54b71724d85"],["bower_components/angular/index.js","0d848853205d22ab8be985876aec948a"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js","004eb14c4f62e0ae670be4c8803d3d19"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap.js","fb81549ee2896513a1ed5714b1b1a0f0"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js","5869c96cc8f19086aee625d670d741f9"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js","76d0f746d06d24675053cf712c832ff8"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js","facbbd4e8afa141b7341ea417d8af151"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js","c4c661f012bbd357893f925e18de01a2"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js","fdcec9762e6028f443113b7664fdff4f"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js","d76d9e35b465bc2773ed6306169524bc"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js","45aa760b64065a1d9025f9f3982f8cfe"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js","5cc53746133c2e8e639a6df9a299a14a"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js","0d19a9c5c9ccdb8d81583badcebb57f6"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js","916e7d014861d391f425951bc6a6b9b1"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js","2a1d3172ce3411d32338e466ae507601"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js","dd4086570011e65a42a27de92e33b418"],["bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js","db7d039381f3a80c478fb67652c30155"],["bower_components/bootstrap-sass/eyeglass-exports.js","8b26e3d2a9cc5859e4ac24802d52b8f5"]];
var cacheName = 'sw-precache-v2--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {credentials: 'same-origin'}));
            }
          })
        );
      });
    }).then(function() {
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      return self.clients.claim();
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url));
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







