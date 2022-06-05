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