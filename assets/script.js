  const inputEl = $('#search-input');
  const searchEl = $('#search-button');
  const clearEl = $('#clear-history');
  let historyEl = $('#history');
  let searchHistory = JSON.parse(localStorage.getItem('search')) || [];

  searchEl.on('click', function(event) {
    event.preventDefault();
    $("#today").empty();
    $("#forecast").empty();
    const searchCity = inputEl.val();
    renderWeather(searchCity);
    searchHistory.push(searchCity);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  })

  clearEl.on('click', function() {
    searchHistory = [];
    renderSearchHistory();
  })

  function renderWeather() {
    const searchCity = inputEl.val();
    const APIkeyOpenWeather = '45ecf5127bc13b481a29c95b7dc21e20';
    const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchCity + '&units=metric&appid=' + APIkeyOpenWeather;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).
      then(function (response) {
        console.log(response);
        const latitude = response.city.coord.lat;
        const longitude = response.city.coord.lon;
        console.log(latitude);
        console.log(longitude);

        const cityName = response.city.name;
        console.log(cityName);
        const currentTimeUTC = moment();
        const currentWeatherIcon = "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
        const currentTemp = "Temperature: " + response.list[0].main.temp + "°C";
        const currentWind = "Wind: " + response.list[0].wind.speed + " KPH";
        const currentHumidity = "Humidity: " + response.list[0].main.humidity + "%";
        
        const currentWeatherHTML = `
          <h2><strong>${cityName} ${currentTimeUTC.format("(DD/MM/YYYY)")} <img src="${currentWeatherIcon}"/></strong></h2>
              <p>${currentTemp}</p>
              <p>${currentWind}</p>
              <p>${currentHumidity}</p>`
      
      $('#today').append(currentWeatherHTML);
      const lat = latitude;
      const lon = longitude;
      const queryURL2 = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + APIkeyOpenWeather;

    $.ajax({
      url: queryURL2,
      method: "GET"
    })
      .then(function (response) {
        console.log(response);

        let forecastDayEl = $('.forecast');
          const div = $("<div class='col-12'>");
          const h2 = $('<h2><strong>5-Day forecast</strong></h2>');
          div.append(h2);
          $('#forecast').prepend(div);
        for (let i = 0; i < forecastDayEl.length; i++) {
          forecastDayEl[i].innerHTML = '';
          const index = i*8 + 4;
          const cityName = response.city.name;
          const forecastDate = response.list[index].dt_txt.split(',');
          const forecastWeatherIcon = "https://openweathermap.org/img/w/" + response.list[index].weather[0].icon + ".png";
          const forecastTemp = "Temperature: " + response.list[index].main.temp + "°C";
          const forecastWind = "Wind: " + response.list[index].wind.speed + " KPH";
          const forecastHumidity = "Humidity: " + response.list[index].main.humidity + "%";
          
          const forecastWeatherHTML = `
          <h5><strong>${cityName} ${forecastDate}</strong></h5>
          <img src="${forecastWeatherIcon}"/>
              <p>${forecastTemp}</p>
              <p>${forecastWind}</p>
              <p>${forecastHumidity}</p>`
      
      $(forecastDayEl[i]).append(forecastWeatherHTML);

        }
      });  
  });
}
  
  function renderSearchHistory() {
    historyEl.innerHTML = '';
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = $('<button btn-primary type=text class=form-control d-block bg-white>');
      historyItem.value($(searchHistory[i]))
      historyItem.on('click', function() {
        renderWeather(historyItem.value());
      })
      historyEl.append(historyItem);
    }
  }

renderSearchHistory();
if (searchHistory.length > 0) {
    renderWeather(searchHistory[searchHistory.lenght - 1]);
  }