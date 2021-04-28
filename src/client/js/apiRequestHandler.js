import { validateDate, isWithinAWeek } from "./formChecker.js"

// handles the form-submit

export async function submitInputForm (event) {
    event.preventDefault();

    // empty result container and date-error if there
    resetDOM();

    // collect inputs
    const location = document.getElementById("location");
    const city = location.value.split(",")[0];
    const countryCode = location.value.split(",")[1];
    const lat = location.dataset.lat;
    const lng = location.dataset.lng;

    const dateInput = document.getElementById("date");
    dateInput.classList.remove("error");

    const date = dateInput.value;

    const withinAWeek = isWithinAWeek(date);

    // prepare primary object to send data to server

    const dataObject = {
        city,
        countryCode,
        lat,
        lng,
        withinAWeek
    };

    try {
        if(!validateDate(date)) 
            throw new Error("invalid date");
        
        await sendData(dataObject); 
    } catch (error) {
        if (error.message == "invalid date") {
            document.getElementById("error-date").textContent = "not a valid date";
            document.getElementById("date").classList.add("error");
        } else 
            console.log(error);
    } 
}

// send data to server, response is an object with all necessary information (weather, imgURL, ...)
async function sendData(data) {
    try {
       const response =  await fetch("/submit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        showResult(responseData);

    } catch (error) {
        console.log(error);
    }
}

// create results
function showResult(data) {
    document.getElementById("submit-form").classList.add("hidden");

    const img = document.createElement("img");
    img.src = data.imgURL;

    const resultDiv = document.createElement("div");
    resultDiv.id = "result-div";
    resultDiv.appendChild(img);

    const weatherCard = document.createElement("div");
    weatherCard.id = "weather-card";

    // different representation if only current weather or forecast (=array)
    if (data.withinAWeek) {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Current weather in " + data.city;
        weatherCard.appendChild(h2);

        createWeatherResult(data.weatherData.temp, data.weatherData.weather.description, data.weatherData.weather.icon, weatherCard, null);
        
    } else {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Weather forecast for " + data.city + ", " + data.countryCode;
        weatherCard.appendChild(h2);

        const weatherResultDiv = document.createElement("div");
        weatherResultDiv.classList.add("forecast");
        data.weatherData.forEach(el => {
            createWeatherResult(el.temp, el.weather.description, el.weather.icon, weatherResultDiv, el.date);
        });

        weatherCard.appendChild(weatherResultDiv);
    }

    resultDiv.appendChild(weatherCard);
    document.body.appendChild(resultDiv);

    // reset button
    const resetButton = document.createElement("button");
    resetButton.id = "reset-button";
    resetButton.textContent = "new trip";
    resetButton.addEventListener("click", resetForm);
    document.body.appendChild(resetButton);
}

function resetForm() {
    resetDOM();
    document.getElementById("submit-form").classList.remove("hidden");
    document.getElementById("reset-button").remove();
}

function resetDOM () {
    const div = document.getElementById("result-div");
    if(div) {
        div.remove();
    }

    document.getElementById("error-date").textContent = "";
}

// create a weather entry with date (if there), temp, icon and description
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