$(document).ready(function() {
    
    // starts the process of calling info from server side api
    function getWeatherInfo(cityName){

        let apiKey = "d282be14845c0a8c7288a667fe6dc06d"
        let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
        
        // first ajax call handles current day weather details and renders info on the page
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            let today = $('<div>');
            let date = new Date(response.list[0].dt * 1000);
            let local = date.toLocaleDateString("en-US");
            let city = $('<h2>').text(`${response.city.name} ${local}`);
            $('#present').append(today);
            today.append(city);
            let tempF = ((response.list[0].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            let temperature = $('<p>').text(`Temperature: ${tempF} °F`);
            today.append(temperature);
            let humidity = response.list[0].main.humidity;
            let hum = $('<p>').text(`Humidity: ${humidity}%`);
            today.append(hum);
            let wind = response.list[0].wind.speed;
            let windSpeed = $('<p>').text(`Wind Speed: ${wind} MPH`);
            today.append(windSpeed);

            let uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${response.city.coord.lat}&lon=${response.city.coord.lon}&appid=${apiKey}`;
            
            // this ajax handles the UV index value
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(response){
                let uv = $('<div>').text(`UV Index: `);
                let color = $('<span>').text(response.value)
                if (response.value < 3) {
                    color.addClass("btn-success");
                  }
                  else if (response.value < 6) {
                    color.addClass("btn-warning");
                  }
                  else {
                    color.addClass("btn-danger");
                  }
          
                uv.addClass('uvClass');
                $('#present').append(uv);
                uv.append(color)

            });
        
            // looping through to render the five day forecast on the page
            let array = [2, 10, 18, 26, 34];
            let body = $('#future');
            let header = $('<h2>').text("5-Day Forecast");
            body.append(header);
            array.forEach(function(i){
                let five = $('<div>').addClass('col futureStyle');
                let date1 = new Date(response.list[i].dt * 1000);
                let local1 = date1.toLocaleDateString("en-US");
                let time = $('<p>').text(local1);
                $('#future').append(five);
                five.append(time);
                let icon = $('<p class= icon>')
                let icon1 = $('<i class="fas fa-sun fa-7x sun"></i>')
                icon.append(icon1)
                five.append(icon);
                let tempFiveF = ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2);
                let temperature1 = $('<p>').text(`Temp: ${tempFiveF} °F`);
                five.append(temperature1);
                let humidity1 = response.list[i].main.humidity;
                let hum1 = $('<p>').text(`Humidity: ${humidity1}%`);
                five.append(hum1)
            });
        });
    };
    // event listener for searching a city
    $('#searchBtn').on('click', function(e){
        e.preventDefault();
        $('#present').empty();
        $('#future').empty();
        let weather = $('#search').val().trim();
        if (weather === ""){
            alert('Please enter a city');
        } else {
            let newList = $('<p>').text(weather);
            newList.addClass('listCities');
            $('#list').append(newList);
            getWeatherInfo(weather);
        }
        $('.listCities').on('click', function(e) {
            e.preventDefault();
            $('#present').empty();
            $('#future').empty();
            getWeatherInfo(weather)
        })
    });
});