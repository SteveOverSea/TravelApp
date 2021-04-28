import { validateDate, isWithinAWeek } from "./formChecker.js"

// on click event handler for submit-button
export async function submitInputForm (event) {
    event.preventDefault();

    // empty result container and date-error if there
    resetDOM();

    // collect inputs
    const city = document.getElementById("city").value;
    const countryCode = document.getElementById("country").value;

    const dateInput = document.getElementById("date");
    dateInput.classList.remove("error");

    const date = dateInput.value;

    await checkDateAndSendGeoData(date, city, countryCode);  
}

async function checkDateAndSendGeoData(date, city, countryCode) {
    try {
        if(!validateDate(date))
            throw new Error("invalid date");
        
        const withinAWeek = isWithinAWeek(date);

        // send city and country code to server -> geonames API
        // and get weather results
       const response =  await fetch("/submit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city, countryCode, withinAWeek})
        });

        const responseData = await response.json();

        showResult(responseData);

    } catch (error) {
        if(error.message == "invalid date") {
            document.getElementById("error-date").textContent = "not a valid date";
            document.getElementById("date").classList.add("error");
        }
        else
            console.log(error);
    }
}

// create Results
function showResult(data) {
    const img = document.createElement("img");
    img.src = data.imgURL;

    const div = document.createElement("div");
    div.id = "result-div";
    div.appendChild(img);

    if (data.withinAWeek) {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Current weather in " + data.city;
        div.appendChild(h2);

        createWeatherResult(data.weatherData.temp, data.weatherData.weather.description, data.weatherData.weather.icon, div, null);
        
    } else {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Weather forecast for " + data.city;
        div.appendChild(h2);

        const weatherResultDiv = document.createElement("div");
        weatherResultDiv.classList.add("forecast");
        data.weatherData.forEach(el => {
            createWeatherResult(el.temp, el.weather.description, el.weather.icon, weatherResultDiv, el.date);
        });

        div.appendChild(weatherResultDiv);
    }

    document.body.appendChild(div);
}

function createWeatherResult(temp, weather, imgSrc, container, date) {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("weather-entry");
    
    if(date) {
        const dateParts = date.split("-");
        const h3 = document.createElement("h3");
        h3.textContent = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toLocaleDateString("de-DE");
        h3.classList.add("weather-date-heading");
        entryDiv.appendChild(h3);
    }

    const icon = document.createElement("img");
    icon.classList.add("weather-icon");
    icon.src = "./assets/icons/" + imgSrc + ".png";

    const weatherP = document.createElement("p");
    weatherP.innerHTML = weather;

    const tempP = document.createElement("p");
    tempP.innerHTML = temp + " °C";
    
    entryDiv.appendChild(icon);
    entryDiv.appendChild(weatherP);
    entryDiv.appendChild(tempP);
    container.appendChild(entryDiv);
}

function resetDOM () {
    const div = document.getElementById("result-div");
    if(div) {
        div.remove();
    }

    document.getElementById("error-date").textContent = "";
}