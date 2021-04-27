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
    let date = document.getElementById("date").value;

    const placesDiv = document.getElementById("possible-places");
    placesDiv.innerHTML = "";

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

        placesDiv.appendChild(select);
        placesDiv.appendChild(selectButton);

    } catch (error) {
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
    button.addEventListener("click", async () => {
        const select = document.getElementById("city-select");
        const city = select.selectedOptions[0].textContent.split(",")[0];
        console.log(select.selectedOptions[0].textContent);

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
    const img = document.createElement("img");
    img.src = data.imgURL;

    const div = document.createElement("div");
    div.id = "result";
    div.appendChild(img);

    if(withinAWeek) {
        const h2 = document.createElement("h2");
        h2.textContent = "Current weather in " + city;
        const p = document.createElement("p");
        p.innerHTML = `Temp: ${data.temp}°C, Weather: ${data.weather.description}`;
        div.appendChild(h2);
        div.appendChild(p);
    } else {
        const h2 = document.createElement("h2");
        h2.textContent = "Weather forecast for " + city;
        div.appendChild(h2);
        data.weatherData.forEach(el => {
            const p = document.createElement("p");
            p.innerHTML = `Date: ${el.date}, Temp: ${el.temp}°C, Weather: ${el.weather.description}`;
            div.appendChild(p);
        });
    }

    document.body.appendChild(div);
}

function resetDOM () {
    const div = document.getElementById("result");
    if(div) {
        div.remove();
    }
}