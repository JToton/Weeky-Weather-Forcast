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
