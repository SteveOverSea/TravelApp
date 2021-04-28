export async function locationInputHandler(e) {
    const datalist = document.getElementById("cities");
    const input = e.target.value;

    if (e instanceof InputEvent) {
        datalist.innerHTML = "";
    } else {
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
        
        responseData.geonames.forEach(el => {
            const option = document.createElement("option");
            option.textContent = el.name + ", " + el.countryCode;
            option.setAttribute("data-lat", el.lat);
            option.setAttribute("data-lng", el.lng);
            datalist.appendChild(option);
        });
    }
}