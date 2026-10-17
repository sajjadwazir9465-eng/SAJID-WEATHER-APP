
/* ==========================
    DOM references
========================== */

const placeholder = document.getElementById("placeholder");
const errorMessage = document.getElementById("errorMessage");
const weatherIconImg = document.getElementById("weatherIconImg");
const cityInput = document.getElementById("cityInput");
const timeZone = document.getElementById("timeZone");
const searchBtn = document.getElementById("searchBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const resultParagraph = document.getElementById("resultParagraph");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weather = document.getElementById("weather");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

function showError(message){

    errorMessage.innerText = message;
    errorMessage.style.display = "block";

}

function hideError(){

    errorMessage.style.display = "none";

}

function getWeatherIcon(code) {

    switch (code) {

        // Clear
        case 0:
            return "icons/clear-sky.svg";

        // Mainly Clear
        case 1:
            return "icons/mainly-clear.png";

        // Partly Cloudy
        case 2:
            return "icons/partly-cloudy.png";

        // Overcast
        case 3:
            return "icons/overcast.png";

        // Fog
        case 45:
        case 48:
            return "icons/fog.png";

        // Drizzle
        case 51:
        case 53:
        case 55:
            return "icons/drizzle.png";

        // Rain
        case 61:
        case 63:
        case 65:
            return "icons/rain.png";

        // Rain Showers
        case 80:
        case 81:
        case 82:
            return "icons/rain-shower.png";

        // Snow
        case 71:
        case 73:
        case 75:
            return "icons/snow.png";

        // Snow Grains
        case 77:
            return "icons/snow-grain.png";

        // Snow Showers
        case 85:
        case 86:
            return "icons/snow-shower.png";

        // Thunderstorm
        case 95:
            return "icons/thunderstorm.png";

        // Thunderstorm with Hail
        case 96:
        case 99:
            return "icons/thunderstormhill.png";

        default:
            return "icons/cloud.png";
    }
}

function displayWeatherIcon(iconUrl) {

    weatherIconImg.src = iconUrl;
    weatherIconImg.style.display = "block";

}

function changeBackground(code){

    let background;

    switch(code){

        // Clear Sky
        case 0:
        case 1:
            background = "backgrounds/clear.jpg";
            break;

        // Cloudy
        case 2:
        case 3:
            background = "backgrounds/cloudy.jpg";
            break;

        // Fog
        case 45:
        case 48:
            background = "backgrounds/fog.jpg";
            break;

        // Drizzle + Rain
        case 51:
        case 53:
        case 55:

        case 61:
        case 63:
        case 65:

        case 80:
        case 81:
        case 82:

            background = "backgrounds/rain.jpg";
            break;

        // Snow
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:

            background = "backgrounds/snow.jpg";
            break;

        // Thunderstorm
        case 95:
        case 96:
        case 99:

            background = "backgrounds/storm.jpg";
            break;

        default:

            background = "backgrounds/cloudy.jpg";

    }

    document.body.style.backgroundImage = `url("${background}")`;

}

function getWeatherDescription(code) {

    switch (code) {

        // Clear
        case 0:
            return "Clear Sky ☀️";

        // Mainly Clear
        case 1:
            return "Mainly Clear 🌤️";

        // Partly Cloudy
        case 2:
            return "Partly Cloudy ⛅";

        // Overcast
        case 3:
            return "Overcast ☁️";

        // Fog
        case 45:
        case 48:
            return "Fog 🌫️";

        // Drizzle
        case 51:
        case 53:
        case 55:
            return "Drizzle 🌦️";

        // Rain
        case 61:
        case 63:
        case 65:
            return "Rain 🌧️";

        // Rain Showers
        case 80:
        case 81:
        case 82:
            return "Rain Showers 🌦️";

        // Snow
        case 71:
        case 73:
        case 75:
            return "Snow ❄️";

        // Snow Grains
        case 77:
            return "Snow Grains ❄️";

        // Snow Showers
        case 85:
        case 86:
            return "Snow Showers 🌨️";

        // Thunderstorm
        case 95:
            return "Thunderstorm ⛈️";

        // Thunderstorm with Hail
        case 96:
        case 99:
            return "Thunderstorm with Hail ⛈️";

        default:
            return "Unknown Weather 🌍";
    }
}


async function getCityCoordinates(city) {

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch city data.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
    }

    return data.results[0];
}

async function getWeatherData(latitude, longitude) {

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
    }

    const weatherData = await response.json();
    return weatherData;
}

function displayWeather(cityData, weatherData) {

    cityName.innerText =
        cityData.name + ", " + cityData.country;

    timeZone.innerText =
        cityData.timezone;

    temperature.innerText =
        weatherData.current.temperature_2m + " °C";

    windSpeed.innerText =
        weatherData.current.wind_speed_10m + " km/h";

    humidity.innerText =
        weatherData.current.relative_humidity_2m + " %";

    const weatherCode = weatherData.current.weather_code;

    weather.innerText =
        getWeatherDescription(weatherCode);

    const weatherIconUrl =
        getWeatherIcon(weatherCode);

    displayWeatherIcon(weatherIconUrl);

    changeBackground(weatherCode);

    placeholder.style.display = "none";
    resultParagraph.style.display = "block";
    
}



function showLoading() {
    loadingOverlay.style.display = "flex";
}

function hideLoading() {
    loadingOverlay.style.display = "none";
}

function hideWeatherResult() {

    resultParagraph.style.display = "none";

    placeholder.style.display = "block";
}


async function searchWeather() {
    
    const city = cityInput.value.trim();

    if(city===""){

        hideWeatherResult();
        showWeatherPlaceholder();
        showError("Please enter a city name.");
        return;

    }

    hideError();
    showLoading();

    try {

        const cityData = await getCityCoordinates(city);

        const weatherData = await getWeatherData(
          cityData.latitude,
          cityData.longitude
        );

        displayWeather(cityData, weatherData);

        hideLoading();
        
        console.log(weatherData)


    } catch (error) {

      console.error(error);

      hideLoading();
      hideWeatherResult();
      showWeatherPlaceholder();
      showError(error.message);

    }
    
}

searchBtn.addEventListener("click", searchWeather);

// Enter Key Event //

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchWeather();
    }

});


   


















