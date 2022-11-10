var apiKey = "3de7f199adb168e35cb20780e93be5af";
var currentWeather = $('#currentWeather');

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
                ${cityWeatherResponse.name} (${moment().format('L')}) <img src='${iconURL}'> 
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
        `);
    });
};

renderCurrentWeather('Miami');

$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $('#cityInput').val().trim();
    renderCurrentWeather(city);
});