import { zip } from "lodash";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit").addEventListener("click", apiRequestHandler);
});

async function apiRequestHandler (event) {
    event.preventDefault();

    const zipCode = document.getElementById("zip").value;
    const countryCode = document.getElementById("country").value;

    const placesDiv = document.getElementById("possible-places");
    placesDiv.innerHTML = "";

    try {
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

        initSendGeoData(selectButton, select);

        placesDiv.appendChild(select);
        placesDiv.appendChild(selectButton);

    } catch (error) {
        console.log(error);
    }
}

function initSendGeoData (button, select) {
    const value = select.value;
    const lat = value.split(",")[0];
    const lng = value.split(",")[1];

    button.addEventListener("click", async () => {
        
        fetch ("/geodata", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lng })
        });
    })
}