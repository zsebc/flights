const apis = require('./apis');

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