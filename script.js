const apiKey = "9d892215aa42af9ae78d3f8d9778538a";

const searchBtn = $(".searchBtn");
const searchBox = $(".searchFld");

var currentDate = (moment().format("M/D/YY"));
const userSearchTitle = $(".userSearchCity");
const userSearchIcon = $(".cityIcon");
const userSearchDetails = $(".userSearchInfo");
const buttonDump = $(".buttonDump");
const forcastContain = $(".forcastContainer");
const userSearchUV = $(".uvContainer ");
const cityButton = $(".cityButton");


var buttonList = [];

$(".searchedCityColumn").hide();
storageEmpty();
clearList();

// dont freak out if local storage is empty
function storageEmpty(){
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name")) || [];

    if(!cityHistory.length){
        // nowWeather("Eugene");
    } else {
        lastSearchDisplay();
        localPost();
    }
}

// display last searched city
function lastSearchDisplay(){
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name"));
    var lastHistorySearch = cityHistory[cityHistory.length -1];

    $(".searchedCityColumn").show();
    nowWeather(lastHistorySearch);
}

// display buttons based on local storage array
function localPost(){
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name")) || [];

    for (var i = 0; i < cityHistory.length; i++){
        var newButton = $("<button class='button is-fullwidth is-rounded cityButton'>").text(cityHistory[i]);
        $(buttonDump).append(newButton);
        $(newButton).click(function() {
            var inputSave = $(this).text();
            nowWeather(inputSave);
            forcast(inputSave);
         });
    }
}

// on search button click, initiate other functions
searchBtn.click(function(){
    const searchedCity = $(searchBox).val();
    nowWeather(searchedCity);
});

// capitalize each word from user input
function cap(searchedCity){
    var array1 = searchedCity.split(' ');
    var capitalizeButton = [];
      
    for(var i = 0; i < array1.length; i++){
      capitalizeButton.push(array1[i].charAt(0).toUpperCase()+array1[i].slice(1));
    }
    return capitalizeButton.join(' ');
  }

  
// push new buttons with labels from user search
function postCityButton(searchedCity){
    var capsButton = cap(searchedCity);
    
    var newButton = $("<button class='button is-fullwidth is-rounded cityButton'>").text(capsButton);
    buttonList.push(newButton);
    
    // retrieving local storage array information
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name")) || [];

    // if local storage has the city already, don't duplicate
    if (cityHistory.indexOf(capsButton) === -1){
        cityHistory.push(capsButton);
        window.localStorage.setItem("city-name", JSON.stringify(cityHistory));
        $(buttonDump).append(newButton);
    }

    // run informative funcitons when city button clicked
    $(newButton).click(function() {
        var inputSave = $(this).text();
        nowWeather(inputSave);
    });
}

// clear local storage/ button list on clear button click
function clearList(){
    $(".buttonClear").click(function() {
        localStorage.clear();
        document.location.reload();
     });
}

// display current weather for city searched
function nowWeather(searchedCity){
    $(".searchedCityColumn").show();
    // clear previous data
    userSearchTitle.empty();
    userSearchIcon.hide();
    userSearchDetails.empty();
    userSearchUV.empty();
    $(".forcast-title").empty();
    forcastContain.empty();

    const currentCity = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: currentCity,
        method: "GET"
      }).then(function(response) {
        postCityButton(searchedCity);
        forcast(searchedCity);
          var cityName = response.name;
          var cityIconCode = response.weather[0].icon;
          var iconURL = "http://openweathermap.org/img/w/" + cityIconCode + ".png";
          var cityTemp = $("<p>").text("Temperature: " + Math.round(response.main.temp) + " °F");
          var cityHumidity =  $("<p>").text("Humidity: " + response.main.humidity + "%");
          var cityWind =  $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
          var cityUVIndex = $("<p>").text("UV Index: ");

        $(userSearchTitle).text( cityName + " " + "(" + currentDate + ")");
        userSearchIcon.show();
        $(userSearchIcon).attr("src", iconURL);
        $(userSearchDetails).append(cityTemp, cityHumidity, cityWind, cityUVIndex);
        
        // create variables for UV index function
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        currentUV(latitude, longitude);
      })
        // if invalid response, produce modal message
      .catch(function(err){
            lastSearchDisplay();
            $(".modal").addClass("is-active");
            $(document.body).click(function() {
                $(".modal").removeClass("is-active");
            })
            console.log("invalid response");
        });
    
}

// posting UV information
function currentUV(latitude, longitude){
    // creating new classes for html file
    $(".userSearchInfo").append($("<div class='box UVbox'></div>"));
    $(".UVbox").append($('<div class="has-text-centered uvText"></div>'));
    
    const cityUV = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: cityUV,
        method: "GET"
      }).then(function(response) {
          var uvIndex = response.value;
          $(".UVbox").text(uvIndex);

        // color of UV box based on response return 
        if (uvIndex < 3){
            $(".UVbox").addClass("lowUV");
        } else if (uvIndex <= 5 && uvIndex >=3){
            $(".UVbox").addClass("medUV");
        } else if (uvIndex <=7 && uvIndex >=6){
            $(".UVbox").addClass("highUV");
        } else if (uvIndex <= 10 && uvIndex >= 8){
            $(".UVbox").addClass("veryHighUV");
        } else {
            $(".UVbox").addClass("extremeUV");
        }
    });
}

// 5 day forcast
function forcast(searchedCity){
    const futureForcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: futureForcast,
        method: "GET"
      }).then(function(response) {
        var listLength = response.list;
        var iconArr = [];
        var tempArr = [];
        var humidArr = [];
        
        // create new html object and appending
        var forcastTitle = $('<h3 class="title is-3">').text("5 Day Forcast");
        $(".forcast-title").append(forcastTitle);

        // at a secific time, chose a timeframe for each day to produce content for an icon, temp and humidity
        for(var i = 0; i < listLength.length; i+= 8){
            var futureIconID = listLength[i].weather[0].icon;
            var forcastIconURL = "https://openweathermap.org/img/w/" + futureIconID + ".png";
            var forestIcomDiv = $("<img>").attr("src", forcastIconURL);
            var futureTemp = $("<p>").text("Temp: " + Math.round(listLength[i].main.temp) + " °F");
            var futureHum = $("<p>").text("Humidity: " + listLength[i].main.humidity + "%");

            iconArr.push(forestIcomDiv);
            tempArr.push(futureTemp);
            humidArr.push(futureHum);
        }

        // for teh desired amount of days(5) produce a html card element with a date
        for (var i=0 ; i < 5 ; i++){
            var date = (moment().add([i+1] , 'days').format("MM/DD/YY"));
            var forcastDate = $("<p class= boldFont>").text(date);
            var forcastColumn = $("<div>").addClass("column forcastColumn");
            var forcastCard = $("<div>").addClass("card rightColumn");
            $(forcastCard).append(forcastDate, iconArr[i], tempArr[i], humidArr[i]);
            $(forcastColumn).append(forcastCard);
            $(forcastContain).append(forcastColumn);
        }
    });
}

