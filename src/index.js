import style from "./css/index.scss";
const apis = require('./apis');
const modals = require('./modals');
const forms = require('./forms');

$('document').ready(function(){
  
  forms.loadDefaultValues();

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
});