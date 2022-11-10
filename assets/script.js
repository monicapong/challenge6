var apiKey = "3de7f199adb168e35cb20780e93be5af";
var currentWeather = $('#currentWeather');
var forecast = $('#weatherForecast');
var searchHistory = $('#searchHistory');
var searchHistoryList = [];

//Request current weather for local city 
function renderCurrentWeather(city) {
    //Weather API link
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    //Request weather data
    $.ajax({
        url: requestURL,
        method: 'GET'
        //Weather API response
    }).then(function(cityWeatherResponse) {
        //Clear current weather section
        $(currentWeather).empty();

        //Link to weather icon
        var weatherIcon = `https://openweathermap.org/img/w/${cityWeatherResponse.weather[0].icon}.png`;

        //Display current weather for local city 
        currentWeather.append(`
            <h2>
                ${cityWeatherResponse.name} (${moment().format('L')}) 
            </h2>
            <img src='${weatherIcon}'>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
        `);

        //Center text
        $(currentWeather).css('text-align', 'center');
    });
};

//Request weather forecast for local city
function renderForecast(city) {
    //Weather API link
    requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    //Request weather forecast data and weather API response
    $.get(requestURL).then(function(forecastResponse){
        //Forecast list
        weatherForecast = forecastResponse.list;
        //Clear forecast section
        forecast.empty();

        //Display data for 5 day weather forecast 
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

//Display Miami weather as default
renderCurrentWeather('Miami');
renderForecast('Miami');

//Add search history button to search section
function searchHistoryButton(city) {
    if (city == '') {
        return;
    }else if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        localStorage.setItem('city', JSON.stringify(searchHistoryList));
    }

    $(searchHistory).prepend(`
        <button class="btn btn-light">${city}</button>
    `);
}

//When the search button is clicked, then the current weather and forecast for the local city is displayed
$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $('#cityInput').val().trim();

    renderCurrentWeather(city);
    renderForecast(city);
    searchHistoryButton(city);
});

//Current weather and forecast for previous search history city is displayed 
$(document).on('click', '.btn', function() {
    var searchedCity = $(this).text();
    renderCurrentWeather(searchedCity);
    renderForecast(searchedCity);
});

//Retrieve past search history and display
function init() {
    if (localStorage.getItem("city")) {
        citiesArray = JSON.parse(localStorage.getItem('city'));
        $.each(citiesArray, function(i) {
            searchHistoryButton(citiesArray[i]);
        });
    };
};

//Display previous searches when page loads 
init();