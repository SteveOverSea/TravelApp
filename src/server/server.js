const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");

const PORT = 8080;

app.use(express.static("dist"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log("listening on port " + PORT));

app.post("/submit", async (req, res) => {

    geonamesResponse = await getGeonamesData(req.body.zipCode, req.body.countryCode);

    if (geonamesResponse.postalCodes) {
        res.send(geonamesResponse.postalCodes);
    }
        

});

async function getGeonamesData (zipCode, countryCode) {
    try {
        const url = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipCode}&country=${countryCode}&username=${process.env.GEONMAMES_USERNAME}`;
        const response = await fetch(url);
        
        return await response.json();
    
    } catch (error) {
        console.log(error);
        return {};
    }
}

app.post("/geodata", async (req, res) => {
    let response;
    if(req.body.withinAWeek) {
        response = await getCurrentWeather(req.body.lat, req.body.lng);
    } else {
        response = { weatherData: await getWeatherForecast(req.body.lat, req.body.lng) };
    }

    const imgUrl = await getPicture(req.body.city);
    response["imgURL"] = imgUrl;

    res.send(response);
});

async function getPicture(cityName) {

    cityName = changeVowels(cityName);
    try {
        const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${cityName}&order=popular`
        const response = await fetch(url);
        const responseData = await response.json();
        return responseData.hits[0].webformatURL;
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