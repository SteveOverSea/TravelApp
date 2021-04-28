// the code to suggest cities on the location input and to save lat, lng to data-attribute

export async function locationInputHandler(e) {
    const datalist = document.getElementById("cities");
    const input = e.target.value;

    // clear suggestion when typing
    if (e instanceof InputEvent) {
        datalist.innerHTML = "";
    } else {
        // save data-attribute when choosing
        // this code somehow doesn't work in Safari
        const options = datalist.children;
        for (let i = 0; i < options.length; i++) {
            if(options[i].textContent == input) {
                e.target.setAttribute("data-lat", options[i].dataset.lat);
                e.target.setAttribute("data-lng", options[i].dataset.lng);
                break;
            }
        }
    }
    
    // get suggestions from geonames API
    if(input.length >= 3) {
        const response = await fetch("/cities", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input })
        });

        const responseData = await response.json();

        let location = {};
        
        // create options for data-list
        responseData.geonames.forEach(el => {
            const option = document.createElement("option");
            option.textContent = el.name + ", " + el.countryCode;
            option.setAttribute("data-lat", el.lat);
            option.setAttribute("data-lng", el.lng);
            datalist.appendChild(option);
        });
    }
}