var apiKey = "3de7f199adb168e35cb20780e93be5af";
var currentWeather = $('#currentWeather');
var forecast = $('#weatherForecast');
var searchHistory = $('#searchHistory');
var searchHistoryList = [];

function renderCurrentWeather(city) {
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: requestURL,
        method: 'GET'
    }).then(function(cityWeatherResponse) {
        $(currentWeather).empty();

        var weatherIcon = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${weatherIcon}.png`;

        currentWeather.append(`
            <h2>
                ${cityWeatherResponse.name} (${moment().format('L')}) 
            </h2>
            <img src='${iconURL}'>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
        `);

        $(currentWeather).css('text-align', 'center');
    });
};

function renderForecast(city) {
    requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    $.get(requestURL).then(function(forecastResponse){
        weatherForecast = forecastResponse.list;
        forecast.empty();

        $.each(weatherForecast, function(i) {
            if (!weatherForecast[i].dt_txt.includes("12:00:00")) {
                return;
            }

            forecastDate = new Date(weatherForecast[i].dt*1000);
            weatherIcon = `https://openweathermap.org/img/wn/${weatherForecast[i].weather[0].icon}.png`;

            forecast.append(`
            <div class="col-md">
                <div class="card text-white">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${weatherForecast[i].main.temp} &#176;C</p>
                        <p>Wind: ${weatherForecast[i].wind.speed} m/s</p>
                        <p>Humidity: ${weatherForecast[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)

            $(forecast).css('text-align', 'center');
        })
    })
};

renderCurrentWeather('Miami');
renderForecast('Miami');

function searchHistoryButton(city) {
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        localStorage.setItem('city', JSON.stringify(searchHistoryList));
    }

    $(searchHistory).prepend(`
        <button class="btn btn-light">${city}</button>
    `);
}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $('#cityInput').val().trim();

    renderCurrentWeather(city);
    renderForecast(city);
    searchHistoryButton(city);
});

$(document).on('click', '.btn', function() {
    var searchedCity = $(this).text();
    renderCurrentWeather(searchedCity);
    renderForecast(searchedCity);
});