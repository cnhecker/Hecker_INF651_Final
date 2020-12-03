const currentLocation = (data) => {
    let defaultLocation = document.getElementById("defaultLocation");
    let dateObj = new Date((data.dt + data.timezone) * 1000);
    let dateDescription = {weekday:'long', month:'numeric', day:'numeric', year:'numeric'};
    let currentDate= document.getElementById("currentDate");
    defaultLocation.innerText = `${data.name}`;
    dateDescription.timeZone = 'UTC';
    currentDate.innerText = dateObj.toLocaleString('en-US', dateDescription);
}

const currentForecast = (data) => {
    let currentTemperature = document.getElementById("currentTemperature");
    let weatherIcon = document.getElementById("weatherIcon");
    let currentWeatherCondition = document.getElementById("currentWeatherCondition")
    currentTemperature.innerHTML=`${Math.round(data.main.temp)}&deg`;
    weatherIcon.src=`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentWeatherCondition.innerHTML = `${data.weather[0].main}`;
}

const getWeatherData = async (zipCode) => {
    let cityEntry = document.getElementById('cityEntry')
    cityEntry.innerText = '';
    const dataFetch = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=38e0a9ef316b3691afe852734d7c68d9`);
    const data = await dataFetch.json(); {
        if(data.cod != "200") {
            let searchStatusMessage = document.getElementById('searchStatusMessage')
            searchStatusMessage.innerHTML = "We could not find that city. Please try again.";
        }
        else {
            document.getElementById('searchStatusMessage')
            searchStatusMessage.innerHTML = "";
            currentLocation(data);
            currentForecast(data);
            return data;
        }
    }
}

window.onload = () => {
    let saveCitySearch = document.getElementById("saveCitySearch");
    saveCitySearch.addEventListener("click", function()  {
        let defaultLocation = document.getElementById("cityEntry").value;
        if(defaultLocation != "") {
            localStorage.setItem('savedCity', defaultLocation);
            let searchStatusMessage = document.getElementById('searchStatusMessage');
            searchStatusMessage.innerText = `We saved ${defaultLocation} as your default location.`;
        }
    });

    let searchCity = document.getElementById("searchCity");
    searchCity.addEventListener("click", function() {
        getWeatherData(document.getElementById('cityEntry').value);
    });

    let savedCity = localStorage.getItem('savedCity');
    getWeatherData(savedCity === null ? '90210' : savedCity);    
}