/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const widgets = __webpack_require__(3);

function getLatLon(from) {
    const place = from.city + "+airport";
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyDZgHUAYUGj_pCJxlBAe683bm7QfOJOMu0`)
        .then((resp) => resp.json())
        .then((data) => {
            return data;
        });
}

function getAirportInfo(iata) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
            'X-RapidAPI-Key': '20cc5289b2msh43190bb71df5beep112b5ajsne919f36401e5'
        }
    };

    return fetch(`https://aerodatabox.p.rapidapi.com/airports/iata/${iata}`, options)
        .then(resp => {
            if (!resp.ok) {
                return {};
            }
            else
                return resp.json();
        })
        .then(resp => resp);
}

function getAirportRoutes(icao) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
            'X-RapidAPI-Key': '20cc5289b2msh43190bb71df5beep112b5ajsne919f36401e5'
        }
    };

    return fetch(`https://aerodatabox.p.rapidapi.com/airports/icao/${icao}/stats/routes/daily`, options)
        .then(resp => resp.json())
        .then(resp => resp)
}

function getDestinations(routes) {
    let destinations = [];
    routes.forEach((val, ind, arr) => {
        let airport = [];
        if (val.destination.municipalityName != undefined) {
            airport.push(val.destination.municipalityName);
            airport.push(val.destination.icao);
            airport.push(val.destination.iata);
            destinations.push(airport);
        }
    });
    destinations.sort((a, b) => (a === b) ? 0 : (a < b) ? -1 : 1);
    return destinations;
}

function getFlightDetails(from, to, date) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com',
            'X-RapidAPI-Key': '20cc5289b2msh43190bb71df5beep112b5ajsne919f36401e5'
        }
    };

    return fetch(`https://skyscanner44.p.rapidapi.com/search?adults=1&origin=${from}&destination=${to}&departureDate=${date}&currency=EUR`, options)
        .then(resp => resp.json())
        .then(resp => resp)
}

function getWeatherData(place) {
    const location = place.geometry.location;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=f73b29b4b5faefbd13c3902684e0be38`)
        .then((resp) => resp.json())
        .then(function (weather) {
            widgets.showAirportInfo(place, weather);
        });
}

function checkFlightDetailsResponse(resp) {
    if(typeof resp.itineraries.buckets !== "undefined") {
        const ticket = resp.itineraries.buckets[0].items[0].id;
        const priceFormatted = resp.itineraries.buckets[0].items[0].price.formatted;
        const priceRaw = resp.itineraries.buckets[0].items[0].price.raw;
        sessionStorage.setItem('ticket', ticket);
        sessionStorage.setItem('priceFormatted', priceFormatted);
        sessionStorage.setItem('priceRaw', priceRaw);
      } else {
        sessionStorage.removeItem('ticket');
        sessionStorage.removeItem('priceFormatted');
        sessionStorage.removeItem('priceRaw');
      }
  }

  function getSessionData() {
    let data = {};
    let vars = ['departure','from','destination','to','date', 'ticket', 'luggage', 'priceFormatted', 'priceRaw', 'adultsPassengers', 'teensPassengers', 'childrenPassengers', 'infantsPassengers', 'totalPassengers', 'passengers', 'username'];
    vars.map( (key) => data[key] = sessionStorage.getItem(key) );
    return data; 
  }

  function getFlighInfoTemplate(sesData) {
    return `<b>From</b>: ${sesData.departure} (${sesData.from})<br>
            <b>To</b>: ${sesData.destination} (${sesData.to})<br>
            <b>Date</b>: ${sesData.date}<br>
            <b>Ticket</b>: ${sesData.ticket}<br>
            <b>Luggage</b>: ${sesData.luggage}<br>
            <b>Price</b>: ${sesData.priceFormatted}<br>
            <b>Passengers</b>: ${sesData.passengers}
            `
  }

  function getInfoModalBody() {
    let sesData = getSessionData();
    let modal_body;
    if(sesData.priceFormatted !== null) {
      modal_body = getFlighInfoTemplate(sesData);
    } else {
     modal_body = "There is no flight. Check another date.";
    }
    return modal_body;
  }

module.exports = {
    getLatLon,
    getAirportInfo,
    getAirportRoutes,
    getDestinations,
    getFlightDetails,
    getWeatherData,
    checkFlightDetailsResponse,
    getSessionData,
    getFlighInfoTemplate,
    getInfoModalBody
};

/***/ }),
/* 3 */
/***/ ((module) => {

function showAirportInfo(place, weather) {
    const airportAddress = place.formatted_address.replaceAll(", ", "<br>");
    const location = place.geometry.location;
    const addressBox = document.getElementById('address');
    while (addressBox.firstChild) {
        addressBox.removeChild(addressBox.firstChild);
    }
    addressBox.insertAdjacentHTML('afterbegin', airportAddress);
    showWeather(weather);
    showMap(location, place.address_components[0].long_name);
}

function showWeather(weather) {
    const name = weather.name;
    const icon = weather.weather[0].icon;
    const description = weather.weather[0].description;
    const iconImg = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"></img>`;
    const temperature = kelvinToCelsius(weather.main.temp);
    const wind = Math.round(weather.wind.speed * 10) / 10 + " m/s";
    const humidity = weather.main.humidity + "%";
    const pressure = weather.main.pressure + " hPa";
    const date = new Date;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const dateFormatted = `${day}.${month}.${year}, ${hour}:${minute}`;
    const weatherBox = document.getElementById("weather");
    while (weatherBox.firstChild) {
        weatherBox.removeChild(weatherBox.firstChild);
    }
    weatherBox.insertAdjacentHTML('afterbegin', `
  <div class="weather_place left10"><h4>${name}</h4><p>${description}</p></div>
  <div class="weather_icon">${iconImg}</div>
  <div class="weather_temp">${temperature}</div>
  <div class="weather_details"><strong>Details</strong>
  <span>Temperature</span><span>${temperature}</span>
  <span>Wind</span><span>${wind}</span>
  <span>Humidity</span><span>${humidity}</span>
  <span>Pressure</span><span>${pressure}</span>
  </div>
  <div class="weather_footer">
  ${dateFormatted}
  </div>`);

}

function kelvinToCelsius(temp) {
    return Math.round(Number(temp) - 273.15) + '°C';
}

function showMap(location, airportName) {
    const mapBox = document.getElementById("map");
    const LatLng = { lat: location.lat, lng: location.lng };
    const map = new google.maps.Map(mapBox, {
        zoom: 5,
        center: { lat: 52.21951464107588, lng: 19.4593654162177 },
        disableDefaultUI: true,
    });

    const marker = new google.maps.Marker({
        position: LatLng,
        map,
        title: airportName,
    });

    const infowindow = new google.maps.InfoWindow({
        content: airportName,
    });

    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
        });
    });
}

module.exports = {
    showAirportInfo
};

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const apis = __webpack_require__(2);

function addModal(src, id, button, title, body, footer) {
  return `<div id="${id}" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          ${button}
          <h4 class="modal-title">
            ${title}
          </h4>
        </div>
        <div class="modal-body">
          ${body}
        </div>
        <div class="modal-footer">
          ${footer}
        </div>
      </div>
    </div>
  </div>`;
}

function addDeparturesModal(departures) {
  const modal_src = "#departure";
  const modal_id = "departuresModal";
  const modal_header_button = `<button type="button" class="close" data-dismiss="modal">
    <i class="fa fa-times" aria-hidden="true"></i>
  </button>`;
  const modal_title = '<i class="fa fa-plane" aria-hidden="true"></i> Departures';
  let modal_body = `<ul>`;
  departures.map((val, ind, arr) => {
    modal_body += `<li data-index="${ind}">${val.city}</li>`;
  });
  modal_body += `</ul>`;
  const modal_footer = '';
  return addModal(modal_src, modal_id, modal_header_button, modal_title, modal_body, modal_footer);
}

function addDestinationsModal(destinations) {
  const modal_src = "#destination";
  const modal_id = "destinationsModal";
  const modal_header_button = `<button type="button" class="close" data-dismiss="modal">
    <i class="fa fa-times" aria-hidden="true"></i>
  </button>`;
  const modal_title = '<i class="fa fa-plane" aria-hidden="true"></i> Destinations';
  let modal_body = `<ul>`;
  destinations.map((val, ind, arr) => {
    modal_body += `<li data-index="${ind}">${val[0]}</li>`;
  });
  modal_body += `</ul>`;
  const modal_footer = '';
  return addModal(modal_src, modal_id, modal_header_button, modal_title, modal_body, modal_footer);
}

function addPassengersModal() {
  const modal_src = "#passengers";
  const modal_id = "passengersModal";
  const modal_header_button = `<button type="button" class="close" data-dismiss="modal">
    <i class="fa fa-times" aria-hidden="true"></i>
  </button>`;
  const modal_title = '<i class="fa fa-users" aria-hidden="true"></i> Passengers';
  const modal_body = `<p>
    Choose passengers based on their age at the time of travel.
  </p>
  <p>
    You can choose <span id="totalPassengers">8</span> more passengers.
  </p>
  <div class="modal-number">
    <span class="passengers-label">Adults</span>
    <span class="passengers-description"
      >16+ years at the time of travel</span
    >
    <span class="passengers-number">
      <input type="number" id="adults" min="1" max="9" value="1" />
    </span>
  </div>
  <div class="modal-number">
    <span class="passengers-label">Teens</span>
    <span class="passengers-description"
      >12-15 years at the time of travel</span
    >
    <span class="passengers-number">
      <input type="number" id="teens" min="0" max="8" value="0" />
    </span>
  </div>
  <div class="modal-number">
    <span class="passengers-label">Children</span>
    <span class="passengers-description"
      >2-11 years at the time of travel</span
    >
    <span class="passengers-number">
      <input type="number" id="children" min="0" max="8" value="0" />
    </span>
  </div>
  <div class="modal-number">
    <span class="passengers-label">Infants</span>
    <span class="passengers-description"
      >Under 2 years at the time of travel</span
    >
    <span class="passengers-number">
      <input type="number" id="infants" min="0" max="8" value="0" />
    </span>
  </div>`;
  const modal_footer = `<button type="button" data-dismiss="modal">
  <i class="fa fa-check-square-o" aria-hidden="true"></i> Confirm
  </button>`;
  return addModal(modal_src, modal_id, modal_header_button, modal_title, modal_body, modal_footer);
}

function showLoginForm() {
  return `<span><input type="text" id="username" name="username" placeholder="Username" />
    <input type="password" id="password" name="password" placeholder="Password" />
    <input type="button" value="Login" /></span>`;
}

function showLoggedUser() {
  let username = sessionStorage.getItem('username');
  let email = sessionStorage.getItem('email');
  return `<span>Logged as:<br>
  ${username} (${email})<br>
  <input type="button" value="Logout" /></span>`;
}

function checkUserLogin() {
  let username = sessionStorage.getItem('username');
  let isLogged = username === null;
  let modal_body;
  if(isLogged) {
    modal_body = showLoginForm();
  } else {
    modal_body = showLoggedUser();
  }
  return modal_body;
}

function addLoginModal() {
  const modal_src = "#login";
  const modal_id = "loginModal";
  const modal_header_button = `<button type="button" class="close" data-dismiss="modal">
    <i class="fa fa-times" aria-hidden="true"></i>
  </button>`;
  const modal_title = '<i class="fa fa-user-circle-o" aria-hidden="true"></i> Login / Logout';
  let modal_body = checkUserLogin();
  const modal_footer = '';
  return addModal(modal_src, modal_id, modal_header_button, modal_title, modal_body, modal_footer);
}

function addInfoModal(modal_body) {
  const modal_src = "#info";
  const modal_id = "infoModal";
  const modal_header_button = `<button type="button" class="close" data-dismiss="modal">
    <i class="fa fa-times" aria-hidden="true"></i>
  </button>`;
  const modal_title = '<i class="fa fa-info-circle" aria-hidden="true"></i> Flight info';
  const modal_footer = '';
  return addModal(modal_src, modal_id, modal_header_button, modal_title, modal_body, modal_footer);
}

function validateFlightsForm() {
  let sesData = apis.getSessionData();
  const from = sesData.from;
  const to = sesData.to;
  const date = sesData.date;
  switch (true) {
    case from === null:
      $('#departure').click();
      break;
    case date === null:
        $('#date').focus();
        break;
    case to === null:
      $('#destination').click();
      break;
    case sesData.totalPassengers === null:
      $('#passengers').click();
      break;
    case sesData.luggage === null:
      showInfoModal('Please select luggage option.');
      break;
  }
  return sesData;
}

function addDeparturesListners(departures) {
  let flight = {};
  const departuresOpts = document.querySelectorAll('#departuresModal ul li');
  for (let i = 0; i < departuresOpts.length; i++) {
    departuresOpts[i].addEventListener("click", function() {
      document.querySelector("#airport_info").classList.add("show-details");
      document.querySelector("#departuresModal .modal-header .close").click();
      let depart = this.innerText;
      document.getElementById('departure').value = depart;
      sessionStorage.setItem('departure', depart);
      const ind = this.dataset.index;
      const from = departures[ind];
      flight.from = from;
      sessionStorage.setItem('from', from.iata);
      apis.getLatLon(from).then(resp => { flight.maps = resp.results[0]; apis.getWeatherData(resp.results[0]); });
      apis.getAirportInfo(from.iata).then(resp => flight.airport = resp);
      apis.getAirportRoutes(from.icao).then(resp => {
        flight.routes = resp.routes;
        let destinations = [];
        destinations = apis.getDestinations(resp.routes);
        $("#destinationsModal").remove();
        $("#destination").val('');
        sessionStorage.removeItem('to');
        sessionStorage.removeItem('destination');
        sessionStorage.removeItem('ticket');
        sessionStorage.removeItem('priceFormatted');
        sessionStorage.removeItem('priceRaw');
        flights_form.insertAdjacentHTML('beforeend', addDestinationsModal(destinations));
        const destinationsOpts = document.querySelectorAll('#destinationsModal ul li');
        for (let i = 0; i < destinationsOpts.length; i++) {
          destinationsOpts[i].addEventListener("click", function () {
            document.querySelector("#destinationsModal .modal-header .close").click();
            let dest = this.innerText;
            document.getElementById('destination').value = dest;
            sessionStorage.setItem('destination', dest);
            const ind = this.dataset.index;
            const to = destinations[ind];
            flight.to = to;
            sessionStorage.setItem('to', to[2]);
            const date = document.getElementById('date').value;
            sessionStorage.setItem('date', date);
            validateFlightsForm();
          });
        }
      });
    });
  }
}

function showInfoModal(modal_body) {
  $("#infoModal").remove();
  flights_form.insertAdjacentHTML('beforeend', addInfoModal(modal_body));
  $('#info').click();
}

module.exports = {
  addDeparturesModal,
  addPassengersModal,
  addDestinationsModal,
  addInfoModal,
  addDeparturesListners,
  showLoginForm,
  showLoggedUser,
  checkUserLogin,
  addLoginModal,
  showInfoModal
};

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const apis = __webpack_require__(2);
const modals = __webpack_require__(4);

function addPassengersListners(passengersArr) {
    passengersArr.map((name, ind, arr) => {
      const el = document.querySelector('#' + name);
      const val = Number(el.value);
      el.addEventListener("change", function () {
        checkPassengers(this, passengersArr);
      });
    });
  }
  
  function updateMaxPassengersValues(fields, newVal) {
    fields.map((field, ind, arr) => {
      const el = document.querySelector('#' + field);
      const val = Number(el.value);
      el.setAttribute("max", val + newVal);
    });
  }
  
  function checkPassengers(curr, passengersArr) {
    let currVal = Number(curr.value);
    savePassengers(passengersArr);
    const totalPassengers = Number(sessionStorage.getItem('totalPassengers'));
    if (totalPassengers == 9) {
      curr.setAttribute("max", currVal);
      const otherFields = passengersArr.filter((el, ind, arr) => el != curr.id);
      updateMaxPassengersValues(otherFields, 9 - totalPassengers);
    }
    else {
      updateMaxPassengersValues(passengersArr, 9 - totalPassengers);
    }
    document.querySelector('#totalPassengers').innerText = 9 - totalPassengers;
  }
  
  function getPassengersCount() {
    let passengers = '';
    let vars = ['adultsPassengers', 'teensPassengers', 'childrenPassengers', 'infantsPassengers', 'totalPassengers'];
    vars.map( (key) => {
      let qty = parseInt(sessionStorage.getItem(key));
      if( qty > 0 )
        passengers += key + ": " + qty + ", ";
    } );
    return passengers.split("Passengers").join("");
  }

  function savePassengers(passengersArr) {
    let totalPassengers = 0;
    passengersArr.map((field, ind, arr) => {
      const val = Number(document.querySelector('#' + field).value);
      totalPassengers += val;
      sessionStorage.setItem(field + 'Passengers', val);
    });
    sessionStorage.setItem('totalPassengers', totalPassengers);
    let passengersCount = getPassengersCount();
    sessionStorage.setItem('passengers', passengersCount);
    document.querySelector('#passengers').value = passengersCount;
  }
  
  function fillDate() {
    const date = new Date;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const today = year + '-' + month + '-' + day;
    const max = year + '-12-31';
    const el = document.querySelector('#date');
    el.value = today;
    el.setAttribute("min", today);
    el.setAttribute("max", max);
  }
  
  function fillLuggages() {
    const luggages = [
      "1 Small Bag (40cm x 20cm x 25cm)",
      "2 Cabin Bags (10kg Cabin Bag and 1 Small Bag)",
      "1 Small Bag (40cm x 20cm x 25cm), 20kg Check-in Bag"
    ];
    const bags = document.querySelector("#luggage");
    luggages.map((val, ind, arr) => {
      const opt = document.createElement("option");
      opt.innerText = val;
      opt.value = ind;
      bags.appendChild(opt);
    });
  }

  function getUserByAjax(el) {
      $.post( "http://flights.lukaszhalat.pl/api.php", $(el[0].children).serialize() )
      .done( (data) => logInUser(data) )
      .fail( () => "error" );
  }

  function logInUser(data) {
    if(data !== "error") {
      let userData = JSON.parse(data);
      for (let field in userData) {
        sessionStorage.setItem(field, userData[field]);
      }
      modals.showInfoModal(apis.getInfoModalBody());
    }
  }

  function validateFlightsForm() {
    let sesData = apis.getSessionData();
    const from = sesData.from;
    const to = sesData.to;
    const date = sesData.date;
    switch (true) {
      case from === null:
        $('#departure').click();
        break;
      case date === null:
        $('#date').focus();
        break;
      case to === null:
        $('#destination').click();
        break;
      case sesData.totalPassengers === null:
        $('#passengers').click();
        break;
      case sesData.luggage === null:
        modals.showInfoModal('Please select luggage option.');
        break;
      default:
        if(sesData.username !== null) {
          apis.getFlightDetails(from, to, date)
          .then(resp => apis.checkFlightDetailsResponse(resp))
          .then(() => modals.showInfoModal( apis.getInfoModalBody() ));
        } else {
          apis.getFlightDetails(from, to, date)
          .then(resp => {
            apis.checkFlightDetailsResponse(resp);
          });
        }
    }
    return sesData;
  }

module.exports = {
    addPassengersListners,
    updateMaxPassengersValues,
    checkPassengers,
    savePassengers,
    fillDate,
    fillLuggages,
    getUserByAjax,
    validateFlightsForm
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const apis = __webpack_require__(2);
const modals = __webpack_require__(4);
const forms = __webpack_require__(5);

const departures = [
  { city: 'Bydgoszcz', icao: 'EPBY', iata: 'BZG' },
  { city: 'Gdansk', icao: 'EPGD', iata: 'GDN' },
  { city: 'Katowice', icao: 'EPKT', iata: 'KTW' },
  { city: 'Krakow', icao: 'EPKK', iata: 'KRK' },
  { city: 'Lublin', icao: 'EPLB', iata: 'LUZ' },
  { city: 'Lodz', icao: 'EPLL', iata: 'LCJ' },
  { city: 'Olsztyn', icao: 'EPSY', iata: 'SZY' },
  { city: 'Poznan', icao: 'EPPO', iata: 'POZ' },
  { city: 'Rzeszow-Jasionka', icao: 'EPRZ', iata: 'RZE' },
  { city: 'Szczecin-Goleniow', icao: 'EPSC', iata: 'SZZ' },
  { city: 'Warszawa-Modlin', icao: 'EPWA', iata: 'WMI' },
  { city: 'Warszawa-Okecie', icao: 'EPMO', iata: 'WAW' },
  { city: 'Wroclaw', icao: 'EPWR', iata: 'WRO' },
  { city: 'Zielona Gora', icao: 'EPZG', iata: 'IEG' }

];
const passengersArr = ['adults', 'teens', 'children', 'infants'];
const flights_form = document.querySelector('#flights_form');
flights_form.insertAdjacentHTML('beforeend', modals.addDeparturesModal(departures));
modals.addDeparturesListners(departures);
flights_form.insertAdjacentHTML('beforeend', modals.addPassengersModal());
flights_form.insertAdjacentHTML('beforeend', modals.addLoginModal());
flights_form.insertAdjacentHTML('beforeend', modals.addInfoModal());

const dateInput = document.querySelector('#date');
dateInput.addEventListener("focus", function () {
  if (this.getAttribute("type") === "date") {
    this.showPicker();
  }
});
forms.addPassengersListners(passengersArr);
forms.fillDate();
forms.fillLuggages();

document.querySelector('.modal-footer button').addEventListener("click", function () {
  forms.savePassengers(passengersArr);
});

document.querySelector('#date').addEventListener("change", function () {
  sessionStorage.setItem("date", this.value);
});

document.querySelector('#luggage').addEventListener("change", function () {
  sessionStorage.setItem("luggage", this.options[this.selectedIndex].text);
});

const flightFormFields = ['departure', 'date', 'destination', 'passengers', 'luggage'];
flightFormFields.map( (key) => {
  document.querySelector('#'+key).addEventListener("change",  () => forms.validateFlightsForm());
});

document.querySelector('#confirm').addEventListener("click", function () {
  let sesData = forms.validateFlightsForm();
  if(sesData.priceRaw !== null) {
    if(sesData.username === null)
      document.querySelector('#login').click();
    else
      modals.showInfoModal(apis.getInfoModalBody());
  }
  else
    modals.showInfoModal(apis.getInfoModalBody());
});


document.querySelector('#loginModal input[type=button]').addEventListener("click", function () {
    if(this.value == "Logout") {
      let userVars = ['id','username','password','email'];
      userVars.map( (key) => sessionStorage.removeItem(key) );
      $('#loginModal .modal-body span').remove();
      document.querySelector('#loginModal .modal-body').insertAdjacentHTML('beforeend', modals.checkUserLogin());
    }
    else {
      forms.getUserByAjax($(this).parent());
      $('#loginModal .modal-body span').remove();
      document.querySelector('#loginModal .modal-body').insertAdjacentHTML('beforeend', modals.checkUserLogin());
    }
});

})();

/******/ })()
;