const apiKey = "9d892215aa42af9ae78d3f8d9778538a"

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

localPost()
clearList();
$(".searchedCityColumn").hide();

function localPost(){
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name")) || [];
    console.log("this cart:",cityHistory)


    for (var i = 0; i < cityHistory.length; i++){
 
        var newButton = $("<button class='button is-fullwidth is-rounded cityButton'>").text(cityHistory[i]);
    
        $(buttonDump).append(newButton);
        
        $(newButton).click(function() {
            console.log("clicked",this);
            var inputSave = $(this).text();
            nowWeather(inputSave);
            forcast(inputSave);
            console.log("value", inputSave);
            
         })
       
    }
}


searchBtn.click(function(){

    const searchedCity = $(searchBox).val();
    console.log("this is the city entered:", searchedCity);
    postCityButton(searchedCity);
    nowWeather(searchedCity);
    forcast(searchedCity);

});


var fuck = [];
function postCityButton(searchedCity){
    var capitalizeButton = searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1);    

    var newButton = $("<button class='button is-fullwidth is-rounded cityButton'>").text(capitalizeButton);

    fuck.push(searchedCity);
    console.log("fuck: ", fuck)
    buttonList.push(newButton);
        
    var cityHistory = JSON.parse(window.localStorage.getItem("city-name")) || [];
    
    if (cityHistory.indexOf(capitalizeButton) === -1){
        cityHistory.push(capitalizeButton);
        window.localStorage.setItem("city-name", JSON.stringify(cityHistory));
        $(buttonDump).append(newButton);
    }

    $(newButton).click(function() {
        var inputSave = $(this).text();
        nowWeather(inputSave);
        forcast(inputSave);
    })


}

function clearList(){
    $(".buttonClear").click(function() {
        console.log( this);
        localStorage.clear();
        document.location.reload();
     })
}



function nowWeather(searchedCity){
    $(".searchedCityColumn").show();
    userSearchTitle.empty();
    userSearchIcon.empty();
    userSearchDetails.empty();
    userSearchUV.empty();
    $(".forcast-title").empty();
    forcastContain.empty();
   
    
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
    
    $(".userSearchInfo").append($("<div class='box UVbox'></div>"));
    
    $(".UVbox").append($('<div class="has-text-centered uvText"></div>'));
    
    
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
          
        
       
        var iconArr = [];
        var tempArr = [];
        var humidArr = [];
      
        var forcastTitle = $('<h3 class="title is-3">').text("5 Day Forcast");
        $(".forcast-title").append(forcastTitle);

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
    
          console.log("future:",response)
        

    });
}

