const apiKey = '2af682340b186e44c1923720521ab60f';


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weather_icon = document.getElementById('weather-icon');
const theme = document.getElementById("mode-toggle");


searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    if (city !== "") {
        checkWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city name.");
    }
});


async function checkWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (response.status === 404 || data.cod === "404") {
            alert("City not found!");
            return;
        }

        document.querySelector('.city').textContent = data.name;
        document.querySelector('.temp').textContent = `${data.main.temp}°C`;
        document.querySelector('.humadity').textContent = `${data.main.humidity} %`;
        document.querySelector('.speed').textContent = `${data.wind.speed} km/h`;
        document.querySelector('.pressure').textContent = `${data.main.pressure} Pa`;

        const weatherCondition = data.weather[0].main;

        switch (weatherCondition) {
            case "Clouds":
                weather_icon.src = "https://openweathermap.org/img/wn/03d@2x.png";
                break;
            case "Rain":
                weather_icon.src = "https://openweathermap.org/img/wn/10d@2x.png";
                break;
            case "Drizzle":
                weather_icon.src = "https://openweathermap.org/img/wn/09d@2x.png";
                break;
            case "Mist":
                weather_icon.src = "https://openweathermap.org/img/wn/50d@2x.png";
                break;
            case "Clear":
                weather_icon.src = "https://openweathermap.org/img/wn/01d@2x.png";
                break;
            default:
                weather_icon.src = "image/default.png";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data.");
    }
}


const forecastDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function getForecast(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (response.status === 404 || data.cod === "404") {
            alert("City not found!");
            return;
        }

        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        const forecastContainers = document.querySelectorAll(".card1 > div");

        forecastContainers.forEach((container, index) => {
            if (dailyData[index]) {
                const forecast = dailyData[index];
                const date = new Date(forecast.dt_txt);
                const dayName = forecastDays[date.getDay()];
                const temp = Math.round(forecast.main.temp);
                const weatherMain = forecast.weather[0].main;

                container.querySelector("h2").textContent = dayName;
                container.querySelector("h3").textContent = `${temp}°C`;

                const img = container.querySelector("img");

                switch (weatherMain) {
                    case "Clouds":
                        img.src = "https://openweathermap.org/img/wn/03d@2x.png";
                        break;
                    case "Rain":
                        img.src = "https://openweathermap.org/img/wn/10d@2x.png";
                        break;
                    case "Drizzle":
                        img.src = "https://openweathermap.org/img/wn/09d@2x.png";
                        break;
                    case "Clear":
                        img.src = "https://openweathermap.org/img/wn/01d@2x.png";
                        break;
                    case "Mist":
                        img.src = "https://openweathermap.org/img/wn/50d@2x.png";
                        break;
                    default:
                        img.src = "image/default.png";
                }
            }
        });

    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

async function locationForecast() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiURL);
            const data = await response.json();

            if (response.status === 404 || data.cod === "404") {
                alert("Could not fetch weather data!");
                return;
            }

            document.querySelector(".temp").textContent = `${data.main.temp}°C`;
            document.querySelector(".city").textContent = data.name;
            document.querySelector("#weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.querySelector(".weather-pic .material-symbols-outlined").textContent = data.weather[0].main;

            getForecast(data.name);

        } catch (error) {
            console.error("Failed to fetch weather data", error);
        }
    }, (error) => {
        alert("Please enable location access.");
        console.error(error);
    });
}

function toggleTheme() {
    const body = document.querySelector("body");
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
}

window.onload = function () {
    const modeToggle = document.getElementById("mode-toggle");
    const body = document.querySelector("body");

    if (localStorage.getItem("mode") === "dark") {
        body.classList.add("dark-mode");
        modeToggle.checked = true;
    }

    modeToggle.addEventListener("change", toggleTheme);

    locationForecast();
};
