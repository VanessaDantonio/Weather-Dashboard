// Commented Geocode code - run out of credits
//let APIkeyGeocode = '315331413024549227211x95562';
let APIkeyOpenWeather = '45ecf5127bc13b481a29c95b7dc21e20';

let city = $('#search-input');
let searchBtn = $('#search-button');
let cityListEl = $('#history');
let formEl = $('#search-form');
let searchHist = JSON.parse(localStorage.getItem('search'));
// Create a function to handle the form submission event that captures the form's `<input>` value and prints it to the `cityListEl` as a `<li>`
function handleFormSubmit(event) {
    event.preventDefault();

// Select form element by its `name` attribute and get its value
 let cityName = city.val();
 console.log(cityName);
 
// if there's nothing in the form entered, don't print to the page
if (!cityName) {
  return;
}

// Clear input fields
city.val('');

//let cityEl = "'" + cityName + "'";
//console.log(cityEl)
//$.ajax({
//    url: 'https://geocode.xyz/',
//    data: {
//      auth: '901884379011558898601x111552',
//      locate: cityEl,
//      json: '1'
 //   }
//  }).then(function(data) {
//    console.log(data);
//  let latitude = data.latt;
//  let longitude = data.longt;
//  console.log(latitude)
 // console.log(longitude)
 
 let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + APIkeyOpenWeather;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    let latitude = response.city.coord.lat;
    let longitude = response.city.coord.lon;
    console.log(latitude)
    console.log(longitude)
let cityTitle = response.city.name;
    console.log(cityTitle);
    let currentTimeUTC = moment();
    let currentWeatherIcon = "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
    let currentTemp = "Temperature: " + response.list[0].main.temp + "°C";
    let currentWind = "Wind: " + response.list[0].wind.speed + " KPH";
    let currentHumidity = "Humidity: " + response.list[0].main.humidity + "%";
    
    
    let currentWeatherHTML = `
        <h2><strong>${cityTitle} ${currentTimeUTC.format("(DD/MM/YYYY)")} <img src="${currentWeatherIcon}"/></strong></h2>
            <p>${currentTemp}</p>
            <p>${currentHumidity}</p>
            <p>${currentWind}</p>`
    
    $('#today').append(currentWeatherHTML);
   

 

let queryURL2 = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + APIkeyOpenWeather;
  
  $.ajax({
    url: queryURL2,
    method: "GET"
  })
      .then(function (weatherForecast) {
        console.log(weatherForecast)

  const forecastDayEl = $('.forecast');
  console.log(forecastDayEl);
  for(let i = 0; i < forecastDayEl.length; i=+8) {
    
    let forecastDate = weatherForecast.list[i].dt_txt;
    let weatherIcon = "https://openweathermap.org/img/w/" + weatherForecast.list[i].weather[0].icon + ".png";
    let temperature = "Temperature: " + weatherForecast.list[i].main.temp + "°C";
    let windSpeed = "Wind: " + weatherForecast.list[i].wind.speed + " KPH";
    let humidity = "Humidity: " + weatherForecast.list[i].main.humidity + "%";

    let forecastDay = `<p>${forecastDate}</p>
            <img src="${weatherIcon}"/>
            <p>${temperature}</p>
            <p>${humidity}</p>
            <p>${windSpeed}</p>`;
    (forecastDayEl).append(forecastDay);
  }          
});  
});
}

localStorage.setItem('search', JSON.stringify(searchHist));
renderHistory;

// Submit event on the form
formEl.on('submit', handleFormSubmit);

function renderHistory(){
  cityListEl.innerHTML = '';
  const listItem = $('<button btn-primary type=text class=form-control d-block bg-white>');
listItem.text(cityName);
$('#history').append(listItem);
}