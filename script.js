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
        console.log("searched city resonse: ", response);
      });
}