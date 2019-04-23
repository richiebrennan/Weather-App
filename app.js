let appId = '318f3920b08233d2c5eb895a5bcefc13';
let units = 'metric';
let searchMethod;
const weeklyForecast = document.getElementById('weeklyForecast');
const overlay = document.querySelector('.overlay');

//Set Today's Date
let now = new Date();

let options = {  
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

 

function getSearchMethod(searchTerm) {
  //Check if search term value is all numbers i.e a zipcode
  if(searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm){
    searchMethod = 'zip';
  } else{
    searchMethod = 'q';
  }
}

//Get the weather for today
function searchWeather(searchTerm) {
  getSearchMethod(searchTerm);
  fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
  .then(result => {
    return result.json();
  })
  .then(result => {
    init(result);
  });
}

//Get the weather for the next five days
function forecast(searchTerm) {
  getSearchMethod(searchTerm);
  fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast/?q=${searchTerm}&appid=${appId}&units=${units}`)
  .then(result => {
    return result.json();
  })
  .then(result => {
    fiveDayForecast(result);
  });
}


//Get the five day forecast
function fiveDayForecast(serverResult) {
  let dates = serverResult.list;
  let test;
  
  //Map the data and get the days 
  var midday = dates.map(function (date) {
    //Get just the time from the dates
    let times = date.dt_txt.substring(10);
    //Get the weather data at midday of each day
    if(times.indexOf("12:00:00") > -1){
      test = date;
      //console.log(test.main.temp_max);
      //console.log(test.weather[0].main);
      let daily_temp = test.main.temp_max;
      let day = new Date(date.dt * 1000);
      let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat','Sun'];
      let name = days[day.getDay() + 1];
      
      let dayStats = document.createElement('div');
      dayStats.className = 'forecastItem';
      dayStats.innerHTML = 
      `<div class="forecast-item">${name}</div>
      <div class="forecast-item info">${Math.round(daily_temp) + '&deg;'}</div>
      `;

      weeklyForecast.appendChild(dayStats);
    }
  });
  
}

function init(resultFromServer) {
  console.log(resultFromServer);
  let appBackground = document.getElementById('app'),
      cityHeader = document.getElementById('cityHeader'),
      date = document.getElementById('date'),
      weatherDesc = document.getElementById('weatherDesc'),
      temp = document.getElementById('temp'),
      tempMax = document.getElementById('tempMax'),
      tempMin = document.getElementById('tempMin'),
      humidity = document.getElementById('humidity'),
      pressure = document.getElementById('pressure'),
      windSpeed = document.getElementById('windSpeed'),
      mainWeatherIcon = document.querySelector('.main-weather-icon');

  

  //Get responses from server and assign to DOM
  cityHeader.textContent = resultFromServer.name;
  date.textContent = now.toLocaleString('en-us', options);
  weatherDesc.textContent = resultFromServer.weather[0].description;
  temp.innerHTML = Math.round(resultFromServer.main.temp) + '<span>&deg;</span>';
  mainWeatherIcon.innerHTML = resultFromServer.weather[0].icon;
  //tempMax.innerHTML = Math.floor(resultFromServer.main.temp_max) + '<span>&deg;</span>';
  //tempMin.innerHTML = Math.floor(resultFromServer.main.temp_min) + '<span>&deg;</span>';
  let resultHumid = resultFromServer.main.humidity;
  //humidity.innerHTML = `${resultHumid}<br>Humidity`;
  let resultPressure = resultFromServer.main.pressure;
  //pressure.innerHTML = `${resultPressure}<br>Pressure`;
  let resultWind = resultFromServer.wind.speed;
  //windSpeed.innerHTML = `${resultWind}<br>Wind Speed`;

  //Set background image
  switch(resultFromServer.weather[0].main){
      case 'Rain':
      case 'Drizzle':
        appBackground.style.backgroundImage = 'url("./img/rain-drk.jpg")';
      break;

      case 'Thunderstorm':
      appBackground.style.backgroundImage = 'url("./img/lightening.jpeg")';
      break;

      case 'Snow':
      appBackground.style.backgroundImage = 'url("./img/snow-drk.jpeg")';
      break;

      case 'Clear':
      appBackground.style.backgroundImage = 'url("./img/sunny-drk.jpg")';
      break;

      case 'Fog':
      case 'Mist':
      case 'Smoke':
      appBackground.style.backgroundImage = 'url("./img/foggyroad.jpg")';
      break;

      case 'Haze':
      appBackground.style.backgroundImage = 'url("./img/haze.jpg")';
      break;

      case 'Clouds':
      appBackground.style.backgroundImage = 'url("./img/clouds.jpeg")';
      break;
  }
  
  //Set weather icons
  switch(resultFromServer.weather[0].icon){
      case '01n':
      case '01d':
      mainWeatherIcon.innerHTML = '<i class="wi wi-day-sunny"></i>';
      break;

      case '02d':
      case '02n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-day-cloudy"></i>';
      break;

      case '03d':
      case '03n':
      case '04d':
      case '04n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-cloudy"></i>';
      break;

      case '09d':
      case '09n':
      case '10d':
      case '10n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-rain"></i>';
      break;

      case '11d':
      case '11n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-thunderstorm"></i>';
      break;

      case '13d':
      case '13n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-snow"></i>';
      break;

      case '50d':
      case '50n':
      mainWeatherIcon.innerHTML = '<i class="wi wi-fog"></i>';
      break;
  }
}

//Get city entered
document.getElementById('searchBtn').addEventListener('click', function(){
  const searchInput = document.getElementById('searchControl').value,
        overlay = document.querySelector('.overlay');
  if(searchInput){
    searchWeather(searchInput);
    forecast(searchInput);
    overlay.classList.add('open');
  };
  if(weeklyForecast.innerHTML){
    weeklyForecast.innerHTML = "";
  }
  
});

//Close menu overlay
document.getElementById('toggleMenu').addEventListener('click', function(){
  const searchInput = document.getElementById('searchControl');
  overlay.classList.remove('open');
  searchInput.value = " ";
});


