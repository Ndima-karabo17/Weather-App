const apiKey = '2af682340b186e44c1923720521ab60f';

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weather_icon = document.getElementById('weather-icon');


async function checkWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (response.status === 404 || data.cod === "404") {
            alert("City not found!");
            return;
        }

        console.log(data);

        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML =data.main.temp + "°C";
        document.querySelector('.humadity').innerHTML = data.main.humidity + " %";
        document.querySelector('.speed').innerHTML = data.wind.speed + " km/h";
        document.querySelector('.pressure').innerHTML = data.main.pressure + " Pa";

        const weatherCondition = data.weather[0].main;

        if (weatherCondition === "Clouds") {
            weather_icon.src = "image/cloud.png";
        } else if (weatherCondition === "Rain") {
            weather_icon.src = "image/rain.webp";
        } else if (weatherCondition === "Drizzle") {
            weather_icon.src = "image/drizzle.webp";
        } else if (weatherCondition === "Mist") {
            weather_icon.src = "image/mist.jpg";
        } else if (weatherCondition === "Clear") {
            weather_icon.src = "image/clear.webp";
        } else if (weatherCondition === "Hot") {
            weather_icon.src = "image/hot.jpg";
        } else {
            weather_icon.src = "image/default.png";
        }
    } catch (error) {
        console.error("Sorry your location doesn't exist:", error);
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

                if (weatherMain === "Clouds") {
                    img.src = "image/cloud.png";
                } else if (weatherMain === "Rain") {
                    img.src = "image/rain.webp";
                } else if (weatherMain === "Drizzle") {
                    img.src = "image/drizzle.webp";
                } else if (weatherMain === "Clear") {
                    img.src = "image/clear.webp";
                } else if (weatherMain === "Mist") {
                    img.src = "image/mist.jpg";
                } else {
                    img.src = "image/default.png";
                }
            }
        });

    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
    
}
async function locationFocast(){
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${navigator.geolocation}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (response.status === 404 || data.cod === "404") {
            alert("Location is off!");
            return;
        }
const currentWeather = 
        console.log(data);
    }catch(error){
        console.log("Turn on location", error);
    }
}
searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    if (city !== "") {
        checkWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city name.");
    }
});
