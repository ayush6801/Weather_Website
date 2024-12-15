const apiKey = "Enter_your_API_key";
const btn=document.getElementById("search_btn");
const cityInput = document.getElementById("city_input");
const dropdown = document.getElementById("dropdown");
const forecastDiv = document.getElementById("forecast");

//Storing at local stoarage
const loadRecentCities = () => {
    return JSON.parse(localStorage.getItem("recentCities")) || [];
  };

const saveRecentCities = (cities) => {
    localStorage.setItem("recentCities", JSON.stringify(cities));
  };

//Making dropdown box
const showDropdown = (cities) => {
    if (cities.length === 0) {
      dropdown.classList.add("hidden");
      return;
    }
    dropdown.innerHTML = cities.map(city => `<div class="p-2  hover:bg-gray-100 cursor-pointer">${city}</div>`).join("");
    
    dropdown.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        const city = item.textContent;
        cityInput.value = city; 
        fetchWeatherData(city); 
        dropdown.classList.add("hidden"); 
      });
    });
  };

//Onclick search
btn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherForecast(city);
      addCityToRecent(city);
      cityInput.value = ""; 
    }
  });

//Dropdown event Listener
cityInput.addEventListener("click", (event) => {
    event.stopPropagation();
    let cities = loadRecentCities();
    dropdown.innerHTML = cities.map(city => `<div class="p-2  hover:bg-gray-100 cursor-pointer">${city}</div>`).join("");
    dropdown.classList.remove("hidden");
    
    dropdown.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        const city = item.textContent;
        cityInput.value = city; 
        getWeatherForecast(city); 
        dropdown.classList.add("hidden"); 
      });
    });
  });

  const addCityToRecent = (city) => {
    let cities = loadRecentCities();
    if (!cities.includes(city)) {
      cities.push(city);
      saveRecentCities(cities);
    }
    showDropdown(cities); 
  };


document.addEventListener('click', function(event) {
  dropdown.classList.add("hidden");
});


// featching data
async function getWeatherForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  console.log("Fetching weather data from URL:", url);

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error("City not found. Please check the city name.");
      }

      const data = await response.json();
      console.log("Weather Data:", data);
      displayForecast(data);
  } catch (error) {
      alert(error.message);
  }
}

function displayCurrentWeather(data) {
    const city = data.city.name;
    const current = data.list[0]; 

    document.getElementById("city_name").textContent = `${city} (${new Date(current.dt * 1000).toLocaleDateString()})`;
    document.getElementById("current_temp").textContent = current.main.temp.toFixed(1);
    document.getElementById("current_wind").textContent = current.wind.speed.toFixed(1);
    document.getElementById("current_humidity").textContent = current.main.humidity;
    document.getElementById("current_description").textContent = current.weather[0].description;
    document.getElementById("current_icon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
}

function displayForecast(data) {
  forecastDiv.innerHTML = ""; 

  const forecasts = data.list.filter((item, index) => index % 8 === 0); 
  forecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const temp = forecast.main.temp.toFixed(1);
      const weather = forecast.weather[0].description;
      const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

      const forecastHTML = `
          <div class="bg-white p-4 rounded shadow-md text-center">
              <h2 class="font-bold text-lg">${date}</h2>
              <img src="${icon}" alt="${weather}" class="mx-auto my-2">
              <p class="text-gray-700 capitalize">${weather}</p>
              <p class="font-bold text-blue-500">${temp}°C</p>
          </div>
      `;

      forecastDiv.insertAdjacentHTML("beforeend", forecastHTML);
      displayCurrentWeather(data);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const city = "Delhi"; 
  getWeatherForecast(city);
});


//use current location

document.getElementById("getWeatherBtn").addEventListener("click", () => {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Fetch weather data
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();
        console.log(data);
        displayForecast(data);
        
      } catch (error) {
        alert(error);
      }
    }, (error) => {
      alert(error);
    });
  } else {
    alert(error);
  }
});