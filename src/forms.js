const apis = require('./apis');
const modals = require('./modals');

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

function loadDefaultValues() {
  let sesData = apis.getSessionData();
  for (let field in sesData) {
    switch (true) {
      case field === 'departure' && sesData[field] !== null:
        $('#'+field).val(sesData[field]);
        break;
      case field === 'date' && sesData[field] !== null:
        $('#'+field).val(sesData[field]);
        break;
      case field === 'destination' && sesData[field] !== null:
        $('#'+field).val(sesData[field]);
        break;
      case field === 'passengers' && sesData[field] !== null:
        $('#'+field).val(sesData[field]);
        break;
    }
        
    console.log();
    
  }
}

module.exports = {
    addPassengersListners,
    updateMaxPassengersValues,
    checkPassengers,
    savePassengers,
    fillDate,
    fillLuggages,
    getUserByAjax,
    validateFlightsForm,
    loadDefaultValues
};