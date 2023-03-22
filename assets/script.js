  const inputEl = $('#search-input');
  const searchEl = $('#search-button');
  const clearEl = $('#clear-history');
  let historyEl = $('#history');
  let searchHistory = [];
  if (localStorage.getItem('search')) {
    searchHistory = JSON.parse(localStorage.getItem('search'));
  }

  searchEl.on('click', function(event) {
    event.preventDefault();
    $('#today').empty();
    $('#icon').empty();
    $('#forecast').empty();
    const searchCity = inputEl.val();
    if (!searchHistory.includes(searchCity)) {
      searchHistory.push(searchCity);
      renderWeather(searchCity);
      renderSearchHistory();
    } else {
      renderWeather(searchCity);
    }
    localStorage.setItem('search', JSON.stringify(searchHistory));
    $(inputEl).val('');
  })

  clearEl.on('click', function(event) {
    event.preventDefault();
    localStorage.clear();
    searchHistory = [];
    $("#history").empty();
  })
  const searchCity = inputEl.val();
  function renderWeather(searchCity) {
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
        const currentWeatherIcon = "https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@4x.png";
        const currentTemp = "Temperature: " + response.list[0].main.temp.toFixed(1) + "°C";
        const currentWind = "Wind: " + response.list[0].wind.speed.toFixed(1) + " KPH";
        const currentHumidity = "Humidity: " + response.list[0].main.humidity + "%";
        
        const currentWeatherHTML = `
          <h2><strong>${cityName} ${currentTimeUTC.format("(DD/MM/YYYY)")}</strong></h2>
              <p>${currentTemp}</p>
              <p>${currentWind}</p>
              <p>${currentHumidity}</p>`

        const icon = `<img src="${currentWeatherIcon}"/>`
        $('#icon').append(icon);
      
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

          const div = $("<div class='col-12'>");
          const h2 = $('<h2 class="text-left"><strong>5-Day forecast</strong></h2>');
          div.append(h2);
          $('#forecast').prepend(div);
        for (let i = 0; i < 5; i++) {
          const index = i*8 + 4;
          const cityName = response.city.name;
          const forecastDate = "(" + moment().add('days', i+1).format('DD/MM/YYYY') + ")";
          const forecastWeatherIcon = "https://openweathermap.org/img/wn/" + response.list[index].weather[0].icon + "@2x.png";
          const forecastTemp = "Temp: " + response.list[index].main.temp.toFixed(1) + "°C";
          const forecastWind = "Wind: " + response.list[index].wind.speed.toFixed(1) + " KPH";
          const forecastHumidity = "Humidity: " + response.list[index].main.humidity + "%";
          
          const forecastWeatherHTML = `
          <h5>${cityName}<br>${forecastDate}</h5>
          <img src="${forecastWeatherIcon}"/>
              <p class="text-left">${forecastTemp}</p>
              <p class="text-left">${forecastWind}</p>
              <p class="text-left">${forecastHumidity}</p>`
      
          const cardDiv = $('<div>').addClass('card col-10 col-sm-2 m-2');
          cardDiv.append(forecastWeatherHTML);
          $("#forecast").append(cardDiv);
        }
      });  
  });
}
  
  function renderSearchHistory() {
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = $('<button>');
      historyItem.text(inputEl.val().toUpperCase());
      historyItem.addClass("city-button btn btn-secondary mt-2");
      historyEl.append(historyItem);
      historyItem.addEventListener("click", function () {
        $('#today').empty();
        $('#icon').empty();
        $('#forecast').empty();
        renderWeather(historyItem.value);
      })
    }
  }