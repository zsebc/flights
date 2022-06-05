const widgets = require('./widgets');

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