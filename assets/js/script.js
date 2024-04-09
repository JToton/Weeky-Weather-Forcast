// * Search Button Listener.
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (city !== "") {
      fetchWeatherForecast(city);
      // *Clear the input field.
      cityInput.value = "";
    } else {
      // * No entry check.
      alert("Please enter a city name");
    }
  });

// *API KEY Entry and fetch URL.
function fetchWeatherForecast(city) {
  const API_KEY = "5667ef7603dd741b21df3d50b26b2900";
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // *Filter forecast data, next 5 days.
      const next5DaysData = Next5Days(data.list);
      // *Save forecast data to local storage.
      localStorage.setItem("weatherForecast", JSON.stringify(next5DaysData));
      // *Display cards.
      displayForecast(next5DaysData);
      // *Save city to local storage.
      saveCity(city);
      // *Display saved cities.
      displaySavedCities();
      // *Display current day weather details.
      // *Pass city name as argument.
      displayCurrentDayWeather(data.list[0], city);
      // *Display current day weather title.
      displayCurrentDayTitle(city);
      // *Save current day city to local storage.
      localStorage.setItem("currentCityName", city);
      // *Save current day weather to local storage.
      localStorage.setItem("currentDayWeather", JSON.stringify(data.list[0]));
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// *Function to grab the next 5 days from object returned (API).
function Next5Days(forecastData) {
  // *Today's date at midnight.
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const next5Days = [];
  let count = 0;
  // *Next 5 Days.
  for (const item of forecastData) {
    const forecastDate = dayjs(item.dt_txt);
    if (forecastDate.isAfter(tomorrow) && count < 5) {
      next5Days.push(item);
      count++;
    }
  }
  return next5Days;
}

// *Function to display forecast data.
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastContainer");
  // *Clear previous content.
  forecastContainer.innerHTML = "";

  // *Title.
  const title = document.createElement("h2");
  title.textContent = "Five Day Forecast Information";
  // *Bootstrap classes / center alignment and margin bottom.
  title.classList.add("text-center", "mb-4");
  forecastContainer.appendChild(title);

  const cardRow = document.createElement("div");
  cardRow.classList.add("card-row");
  forecastContainer.appendChild(cardRow);

  // *Loop filtered forecast data and create Bootstrap cards.
  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("card", "m-2");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // *Calculate the date for the current card.
    const currentDate = dayjs()
      .add(index + 1, "day")
      .format("dddd, MMMM D");
    // *Create Title Element.
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = currentDate;
    // *Convert Temp.
    // *Create temp Paragraph container.
    const tempInFahrenheit = KelvinToFahrenheit(item.main.temp);
    const tempParagraph = document.createElement("p");
    tempParagraph.textContent = `Temperature: ${tempInFahrenheit} °F`;
    // *Create wind Paragraph container.
    const windParagraph = document.createElement("p");
    windParagraph.textContent = `Wind: ${item.wind.speed} m/s`;
    // *Create humid Paragraph container.
    const humidityParagraph = document.createElement("p");
    humidityParagraph.textContent = `Humidity: ${item.main.humidity}%`;

    // *Add weather icon from object data.
    const weatherIcon = document.createElement("img");
    weatherIcon.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    weatherIcon.alt = item.weather[0].main;
    weatherIcon.classList.add("weather-icon");
    // *Append elements.
    cardBody.appendChild(weatherIcon);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(tempParagraph);
    cardBody.appendChild(windParagraph);
    cardBody.appendChild(humidityParagraph);

    card.appendChild(cardBody);
    cardRow.appendChild(card);
  });
}

// *Function to convert Kelvin to Fahrenheit.
// *Noticed in object its returned in kelvin.
function KelvinToFahrenheit(kelvin) {
  return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
}

function saveCity(city) {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCities.push(city);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

// *Function to display saved cities as buttons.
function displaySavedCities() {
  // *Retrieve saved cities from local storage, or initialize an empty array if none are saved.
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  // *Get the container where city buttons will be appended.
  const cityButtonsContainer = document.getElementById("cityButtonsContainer");
  // *Clear previous content.
  cityButtonsContainer.innerHTML = "";

  // *Loop through saved cities.
  savedCities.forEach((city) => {
    // *Check if a button for this city already exists.
    const existingButton = document.querySelector(
      `#cityButtonsContainer button[data-city="${city}"]`
    );
    // *If the button doesn't already exist, create it.
    if (!existingButton) {
      // *Create a list item for the button.
      const listItem = document.createElement("li");
      listItem.classList.add("nav-item");

      // *Create the button element.
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "mr-2");
      button.textContent = city;
      // *Set data attribute to identify the city.
      button.setAttribute("data-city", city);
      // *Add click event listener to the button to fetch weather forecast for the city.
      button.addEventListener("click", function () {
        fetchWeatherForecast(city);
      });

      // *Append the button to the list item.
      listItem.appendChild(button);
      // *Append the list item to the container.
      cityButtonsContainer.appendChild(listItem);
    }
  });
}

// *Function to display current day weather details.
// *From mockup provided - the information above the 5 day forecast.
function displayCurrentDayWeather(data, cityName) {
  // *Get the container where current day weather will be displayed.
  const currentDayContainer = document.getElementById("currentDayContainer");
  // *Clear previous content.
  currentDayContainer.innerHTML = "";

  // *Create elements for displaying current day weather.
  const card = document.createElement("div");
  card.classList.add("card", "m-2");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // *Include weather icon.
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherIcon.alt = data.weather[0].main;
  weatherIcon.classList.add("weather-icon");

  // *Calculate the date for the current card.
  const currentDate = dayjs(data.dt_txt).format("dddd, MMMM D");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = currentDate;

  // *Convert temperature from Kelvin to Fahrenheit.
  const tempInFahrenheit = KelvinToFahrenheit(data.main.temp);
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  // *Format current day weather information.
  cardText.innerHTML = `<p>Temperature: ${tempInFahrenheit} °F</p><p>Wind: ${data.wind.speed} m/s</p><p>Humidity: ${data.main.humidity}%</p>`;

  // *Append elements to create the current day weather card.
  cardBody.appendChild(weatherIcon);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  card.appendChild(cardBody);
  currentDayContainer.appendChild(card);
}

// *Function to display the title for the current day weather.
function displayCurrentDayTitle(cityName) {
  const currentDayTitleContainer = document.getElementById("currentDayTitle");
  // *Clear previous content.
  currentDayTitleContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = `Current Weather in ${cityName}`;
  title.classList.add("text-center", "mb-4");
  currentDayTitleContainer.appendChild(title);
}

// *Check if there's saved forecast data in local storage and display it.
const savedForecast = localStorage.getItem("weatherForecast");
if (savedForecast) {
  displayForecast(JSON.parse(savedForecast));
}

// *Check if there's saved cities in local storage and display them.
displaySavedCities();

// *Check if there's current day weather in local storage and display it.
const currentDayWeather = localStorage.getItem("currentDayWeather");
if (currentDayWeather) {
  const parsedData = JSON.parse(currentDayWeather);
  // *Retrieve city name from local storage.
  const cityName = localStorage.getItem("currentCityName") || "Unknown";
  // *Display the weather data along with the city name.
  displayCurrentDayWeather(parsedData, cityName);
  // *Display the title with the city name.
  displayCurrentDayTitle(cityName);
}
