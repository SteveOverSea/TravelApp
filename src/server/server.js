const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");
const countries = require("i18n-iso-countries");

const PORT = 8080;

app.use(express.static("dist"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log("listening on port " + PORT));

let receivedData;

app.post("/submit", async (req, res) => {
    receivedData = {}; // reset

    receivedData["city"] = req.body.city;
    receivedData["countryCode"] = req.body.countryCode;
    receivedData["withinAWeek"] = req.body.withinAWeek;

    geonamesResponse = await getGeonamesData(req.body.city, req.body.countryCode);

    if (geonamesResponse.geonames) {
         receivedData["lat"] = geonamesResponse.geonames[0].lat;
         receivedData["lng"] = geonamesResponse.geonames[0].lng;
         receivedData["city"] = geonamesResponse.geonames[0].name;

        const weatherData = await getWeather();
        const imgURL = await getPicture(receivedData.city);
        const city = receivedData.city;
        const withinAWeek = receivedData.withinAWeek;
        
        res.send({weatherData, imgURL, city, withinAWeek});
    }
});

function getWeather() {
    let weather;
    if (receivedData.withinAWeek) {
        weather = getCurrentWeather(receivedData.lat, receivedData.lng);
    } else {
        weather = getWeatherForecast(receivedData.lat, receivedData.lng);
    }
    return weather;
}

async function getGeonamesData (city, countryCode) {
    city = changeVowels(city);
    try {
        const url = `http://api.geonames.org/search?name=${city}&country=${countryCode}&type=json&username=${process.env.GEONMAMES_USERNAME}`;
        const response = await fetch(url);
        
        return await response.json();
    
    } catch (error) {
        console.log(error);
        return {};
    }
}

async function getPicture(cityName) {

    cityName = changeVowels(cityName);

    try {
        // city picture
        let url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${cityName}&order=popular`
        let response = await fetch(url);
        let responseData = await response.json();

        if(responseData.hits.length > 0)
            return responseData.hits[0].webformatURL;
        else {
            // country picture
            const countryName = countries.getName(receivedData.countryCode, "en", {select: "official"});
            url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${countryName}&order=popular`;
            let response = await fetch(url);
            let responseData = await response.json();

            if(responseData.hits.length > 0)
                return responseData.hits[0].webformatURL;
            else {
                // travel picture
                url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=travel&order=popular`;
                let response = await fetch(url);
                let responseData = await response.json();
                return responseData.hits[0].webformatURL;
            }
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}

function changeVowels(string) {
    string = string.replace("ä", "ae");
    string = string.replace("ö", "oe");
    string = string.replace("ü", "ue");
    return string;
}

async function getWeatherForecast(lat, lng) {
    try {
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
        const response = await fetch(url);
        const responseData = await response.json();
        return responseData.data.map(obj => {
            return {
               date: obj.valid_date,
               temp: obj.temp,
               weather: obj.weather
            };
        });
    } catch (error) {
        console.log(error);
        return {};
    }
}

async function getCurrentWeather(lat, lng) {
    try {
        const url = `https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${lng}&units=M&lang=en&key=${process.env.WEATHERBIT_API_KEY}`;
        const response = await fetch(url);
        const responseData = await response.json();
        return {
            temp: responseData.data[0].temp,
            weather: responseData.data[0].weather
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}