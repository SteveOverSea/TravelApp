import { setMinMaxDates, validateDate, isWithinAWeek } from "./formChecker.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-form").addEventListener("submit", apiRequestHandler);

    setMinMaxDates();
});

async function apiRequestHandler (event) {
    event.preventDefault();

    resetDOM();

    const zipCode = document.getElementById("zip").value;
    const countryCode = document.getElementById("country").value;
    const dateInput = document.getElementById("date");
    dateInput.classList.remove("error");
    let date = dateInput.value;
    const dateError = document.getElementById("error-date");
    dateError.textContent = "";

    const inputContainer = document.getElementsByClassName("input-container")[0];

    try {
        if(!validateDate(date))
            throw new Error("invalid date");

        const response = await fetch("/submit", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zipCode, countryCode })
        });

        const responseData = await response.json();

        const selectDiv = document.createElement("div");
        selectDiv.id = "select-div";
        const selectHeading = document.createElement("h2");
        selectHeading.textContent = "select the correct city";
        const selectForm = document.createElement("form");
        const select = document.createElement("select");
        select.id = "city-select";
        const selectButton = document.createElement("button");
        selectButton.innerHTML = "select";

        responseData.forEach(el => {
            const option = document.createElement("option");
            option.value = el.lat + "," + el.lng;
            option.innerHTML = el.placeName;
            select.appendChild(option);
        });

        initSendGeoData(selectButton, select, date);

        selectDiv.appendChild(selectHeading);
        selectForm.appendChild(select);
        selectForm.appendChild(selectButton);
        selectDiv.appendChild(selectForm);
        
        document.getElementById("submit-form").remove();

        inputContainer.appendChild(selectDiv);

    } catch (error) {
        if(error.message == "invalid date") {
            dateError.textContent = "not a valid date";
            dateInput.classList.add("error");
        }
        else
            console.log(error);
    }
}

function initSendGeoData (button, select, date) {
    const value = select.value;
    const lat = value.split(",")[0];
    const lng = value.split(",")[1];

    const withinAWeek = isWithinAWeek(date);

    let responseData;

    // write function instead!
    button.addEventListener("click", async (e) => {
        e.preventDefault();

        const select = document.getElementById("city-select");
        const city = select.selectedOptions[0].textContent.split(",")[0];

        try {
            const response = await fetch ("/geodata", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat, lng, date, withinAWeek, city })
            });
    
            responseData = await response.json();
        } catch (error) {
            console.log(error);
        }

        updateDOM(responseData, withinAWeek, city);
    });
}

function updateDOM (data, withinAWeek, city) {
    document.getElementById("select-div").remove();
    const img = document.createElement("img");
    img.src = data.imgURL;

    const div = document.createElement("div");
    div.id = "result-div";
    div.appendChild(img);

    if(withinAWeek) {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Current weather in " + city;
        div.appendChild(h2);

        createWeatherResult(data.temp, data.weather.description, data.weather.icon, div, null);
        
    } else {
        const h2 = document.createElement("h2");
        h2.classList.add("weather-heading");
        h2.textContent = "Weather forecast for " + city;
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
    const div = document.getElementById("result");
    if(div) {
        div.remove();
    }
}