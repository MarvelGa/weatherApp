let apiKey = "25b374b9eb471f1d081d7663d3ba9153";
let currentButton = document.querySelector("#current-location-button");
let description = document.querySelector("#description");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let searchElement = document.querySelector("#search-id");
let iconElement = document.querySelector("#icon");
let celsiusTemperature = null;

function changeDate() {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    let timeLine = document.querySelector("li#time");
    console.log(timeLine);
    let date = new Date();
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    timeLine.innerHTML = `Last updated: ${
        days[date.getDay()]
    } ${date.getHours()}:${minutes}`;
}

function formatDay(timeStamp) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date(timeStamp * 1000);
    let day = date.getDay();
    return days[day];
}

function displayForecast(response) {

    let forecast = response.data.daily;
    console.log(forecast);
    let forecastElement = document.querySelector("#forecast");
    let days = ["Thu", "Fri", "Sat", "Sun"];

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            forecastHTML =
                forecastHTML +
                `
             <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}° </span>
        </div>
      </div>
  `;
        }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
    console.log(forecastHTML);
}

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(getWeatherData);

function getForecast(coordinates) {
    let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
    let part = "minutely";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${part}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function getWeatherData(response) {
    let cityElement = document.querySelector("#displayed-city");
    cityElement.innerHTML = response.data.name;
    let temperature = document.querySelector(".temperature");
    let temp = Math.round(response.data.main.temp);
    celsiusTemperature = Math.round(response.data.main.temp);
    temperature.innerHTML = celsiusTemperature;
    /*    precipitationData.innerHTML = `Precipitation:${response.data.main.temp}%`;*/
    humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    wind.innerHTML = `Wind: ${response.data.wind.speed}mph`;
    searchElement.innerHTML = '';
    description.innerHTML =
        response.data.weather[0].main;

    iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
    getForecast(response.data.coord);

}

function search(event) {
    event.preventDefault();

    let city = searchElement.value;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(getWeatherData);
}

function getInCelsius(event) {
    event.preventDefault();
    toCelsius.classList.add("active");
    toFahrenheit.classList.remove("active");
    let temperature = document.querySelector(".temperature");
    temperature.innerHTML = Math.round(celsiusTemperature);
}

function getInFahrenheit(event) {
    event.preventDefault();
    toCelsius.classList.remove("active");
    toFahrenheit.classList.add("active");
    let temperature = document.querySelector(".temperature");
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperature.innerHTML = Math.round(fahrenheitTemperature);
}

changeDate();
let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

let toFahrenheit = document.querySelector("#fahrenheit");
toFahrenheit.addEventListener("click", getInFahrenheit);

let toCelsius = document.querySelector("#celsius");
toCelsius.addEventListener("click", getInCelsius);


function showCurrentData(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    let apiKey = "25b374b9eb471f1d081d7663d3ba9153";

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(getWeatherData);
}

function getCurrentData() {
    navigator.geolocation.getCurrentPosition(showCurrentData);
}

currentButton.addEventListener("click", getCurrentData);
