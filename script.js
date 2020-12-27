// api call to weather api
// form box/ search box for city
// on click for search, return
    // current weather: include-
        // city name, 
        // the date, 
        // an icon representation of weather conditions, 
        // the temperature, 
        // the humidity, 
        // the wind speed, 
        // and the UV index: include-
            // color that indicates whether the conditions are favorable, moderate, or severe

    // 5 day weather outlook: include- 
        // displays the date, 
        // an icon representation of weather conditions, 
        // the temperature, 
        // the humidity

// save city search as button to panel (local storage)
// when the page is opened, its opened to the last searched city

const apiKey = "9d892215aa42af9ae78d3f8d9778538a"

const searchBtn = $('.searchBtn');
const searchBox = $('.searchFld');


searchBtn.click(handleSearch);

function handleSearch() {
    const searchedCity = $(searchBox).val();
    console.log("this is the city entered:", searchedCity);
    nowWeather(searchedCity);

}

function nowWeather(searchedCity){
    const currentCity = "http://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + apiKey;
    $.ajax({
        url: currentCity,
        method: "GET"
      }).then(function(response) {
        console.log("searched city response: ", response);
        console.log("searched city name: ", response.name);
        console.log("searched city icon: ", response.weather[0].icon);
        console.log("searched city temp: ", response.main.temp);
        console.log("searched city humidity: ", response.main.humidity);
        console.log("searched city wind: ", response.wind.speed);
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        currentUV(latitude, longitude);

      });
}

function currentUV(latitude, longitude){
    const cityUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

    $.ajax({
        url: cityUV,
        method: "GET"
      }).then(function(response) {
        console.log("uv:",response)
    });
}

