import { setMinMaxDates, validateDate, isWithinAWeek } from "./formChecker.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-form").addEventListener("submit", apiRequestHandler);

    setMinMaxDates();
});

async function apiRequestHandler (event) {
    event.preventDefault();

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
    console.log(withinAWeek);

    button.addEventListener("click", async () => {
        
        fetch ("/geodata", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lng, date, withinAWeek })
        });
    })
}