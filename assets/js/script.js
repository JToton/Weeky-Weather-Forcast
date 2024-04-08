document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (city !== "") {
      fetchWeatherForecast(city);
      // *Clear the input field after search.
      cityInput.value = "";
    } else {
      alert("Please enter a city name");
    }
  });

function fetchWeatherForecast(city) {
  // *API KEY Entry and fetch URL.
  const API_KEY = "5667ef7603dd741b21df3d50b26b2900";
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // *stringify response for storage.
      localStorage.setItem("weatherObject", JSON.stringify(data.list[0]));
    })
    // *Fetch error catching.
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// *Function to grab the next 5 days from object returned (API).
function Next5Days(forecastData) {}

// *Function to display forecast data.
function displayForecast(data) {}

// *Function to convert Kelvin to Fahrenheit.
// *Noticed in object its returned in kelvin.
function KelvinToFahrenheit(kelvin) {
  return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
}

// *Function to save the current city.
function saveCity(city) {}

// *Display function to show created / appended city weather information.
function displaySavedCities() {}

// *Function to display current weather for the day.
// *From mockup provided - the information above the 5 day forecast.
function displayCurrentDayWeather(data) {}
