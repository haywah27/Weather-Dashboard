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

const searchBtn = $(".searchBtn");
const searchBox = $(".searchFld");

const userSearchTitle = $(".userSearchCity");
const userSearchIcon = $(".cityIcon");
const userSearchDetails = $(".userSearchInfo");
var currentDate = (moment().format("M/D/YY"));


searchBtn.click(handleSearch);

function handleSearch() {
    const searchedCity = $(searchBox).val();
    console.log("this is the city entered:", searchedCity);
    nowWeather(searchedCity);
    forcast(searchedCity);

}

function nowWeather(searchedCity){
    userSearchTitle.empty();
    userSearchIcon.empty();
    userSearchDetails.empty();
    const currentCity = "http://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: currentCity,
        method: "GET"
      }).then(function(response) {
          
          var cityName = response.name;
          var cityIconCode = response.weather[0].icon;
          var iconURL = "http://openweathermap.org/img/w/" + cityIconCode + ".png";
          var cityTemp = response.main.temp;
          var cityHumidity = response.main.humidity;
          var cityWind = response.wind.speed;
        $(userSearchTitle).text( cityName + " " + "(" + currentDate + ")");
        $(userSearchIcon).attr("src", iconURL);
        console.log("searched city response: ", response);
        console.log("name: ", response.name);
        console.log("icon: ", response.weather[0].icon);
        console.log("temp: ", response.main.temp);
        console.log("humidity: ", response.main.humidity);
        console.log("wind: ", response.wind.speed);
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        currentUV(latitude, longitude);

      });
}

function currentUV(latitude, longitude){
    const cityUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: cityUV,
        method: "GET"
      }).then(function(response) {
        console.log("uv:",response)

    });
}

function forcast(searchedCity){
    
    const futureForcast = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: futureForcast,
        method: "GET"
      }).then(function(response) {
          var listLength = response.list
          for(var i = 0; i < listLength.length; i+= 8){
              console.log("forloop resonse:", listLength[i]);
              console.log("date:", listLength[i].dt_txt);
              console.log("icon:", listLength[i].weather[0].icon);
              console.log("temp:", listLength[i].main.temp);
              console.log("humidity:", listLength[i].main.humidity);

          }
          console.log("future:",response)
        

    });
}

