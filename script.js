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

var currentDate = (moment().format("M/D/YY"));
const userSearchTitle = $(".userSearchCity");
const userSearchIcon = $(".cityIcon");
const userSearchDetails = $(".userSearchInfo");
const buttonDump = $(".buttonDump");


searchBtn.click(handleSearch);

function handleSearch() {
    const searchedCity = $(searchBox).val();
    console.log("this is the city entered:", searchedCity);
    saveCity(searchedCity);
    nowWeather(searchedCity);
    forcast(searchedCity);
    addClearBtn();
}

function addClearBtn(){
    // if list is 1 or above, run funciton
    $(".addBtn").append('<button class="button is-danger is-light buttonClear">Clear List</button>');
}
var buttonList = [];
var cityArr = [];
function saveCity(searchedCity){
    
    var capitalizeButton = searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1);
    
    var newButton = $("<button class='button is-fullwidth is-rounded'>").text(capitalizeButton);
    
    buttonList.push(newButton);
    cityArr.push(searchedCity);

    localStorage.setItem("buttonList", JSON.stringify(cityArr));
    


    
    $(".buttonClear").click(function() {
        console.log(this);
        localStorage.clear();
        document.location.reload();
     })


    // localStorage.setItem("userButtons", buttonList);
    

    $(buttonDump).append(buttonList);
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
          var cityTemp = $("<p>").text("Temperature: " + Math.round(response.main.temp) + " °F");
          var cityHumidity =  $("<p>").text("Humidity: " + response.main.humidity + "%");
          var cityWind =  $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
          var cityUVIndex = $("<p>").text("UV Index: ");

        $(userSearchTitle).text( cityName + " " + "(" + currentDate + ")");
        $(userSearchIcon).attr("src", iconURL);
        $(userSearchDetails).append(cityTemp, cityHumidity, cityWind, cityUVIndex);
        
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        currentUV(latitude, longitude);

      });
}

function currentUV(latitude, longitude){
    const userSearchUV = $(".uvContainer ");
    userSearchUV.html($("<div class='box UVbox'></div>"));
    
    $(".UVbox").html($('<div class="has-text-centered uvText"></div>'));
    
    const cityUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: cityUV,
        method: "GET"
      }).then(function(response) {
          var uvIndex = response.value;
          $(".UVbox").text(uvIndex)
        console.log("uv:",uvIndex)
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

function forcast(searchedCity){
    
    const futureForcast = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: futureForcast,
        method: "GET"
      }).then(function(response) {
          var listLength = response.list;
          var forcastContain = $(".forcastContainer");
        
       
        var iconArr = [];
        var tempArr = [];
        var humidArr = [];
      

        for(var i = 0; i < listLength.length; i+= 8){
            console.log("forloop resonse:", listLength[i]);
            var futureIconID = listLength[i].weather[0].icon;
            var forcastIconURL = "http://openweathermap.org/img/w/" + futureIconID + ".png";
            var forestIcomDiv = $("<img>").attr("src", forcastIconURL);
            var futureTemp = $("<p>").text("Temp: " + Math.round(listLength[i].main.temp) + " °F");
            var futureHum = $("<p>").text("Humidity: " + listLength[i].main.humidity + "%");

            
            iconArr.push(forestIcomDiv);
            tempArr.push(futureTemp);
            humidArr.push(futureHum);
            console.log("temparr first: ", tempArr)


        }

        for (var i=0 ; i < 5 ; i++){
            
            var date = (moment().add([i+1] , 'days').format("MM/DD/YY"));
            var forcastDate = $("<p class= boldFont>").text(date);

            
            var forcastColumn = $("<div>").addClass("column forcastColumn");
            var forcastCard = $("<div>").addClass("card rightColumn");
            $(forcastCard).append(forcastDate, iconArr[i], tempArr[i], humidArr[i]);
            $(forcastColumn).append(forcastCard);
            $(forcastContain).append(forcastColumn);
        }
        // console.log("date arr", dateArr)




        //   for(var i = 0; i < listLength.length; i+= 8){
            

        //     var forcastDate = $("<p class= boldFont>").text(funcitonDate[i++]);
        //     var forcastIconCode = listLength[i].weather[0].icon;
        //     var forcastIconURL = "http://openweathermap.org/img/w/" + forcastIconCode + ".png";
        //     var forestIcomDiv = $("<img>").attr("src", forcastIconURL);
        //     var forcastTemp = $("<p>").text("Temp: " + Math.round(listLength[i].main.temp) + " °F");
        //     var forcastHum = $("<p>").text("Humidity: " + listLength[i].main.humidity);

        //     var forcastColumn = $("<div>").addClass("column forcastColumn");
        //     var forcastCard = $("<div>").addClass("card rightColumn");

        //     $(forcastCard).append(forcastDate, forestIcomDiv, forcastTemp, forcastHum);
        //     $(forcastColumn).append(forcastCard);
        //     $(forcastContain).append(forcastColumn);


            
        //       console.log("forloop resonse:", listLength[i]);
        //       console.log("date:", listLength[i].dt_txt);
        //       console.log("icon:", listLength[i].weather[0].icon);
        //       console.log("temp:", listLength[i].main.temp);
        //       console.log("humidity:", listLength[i].main.humidity);

        //   }
          console.log("future:",response)
        

    });
}

