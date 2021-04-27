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
    // trip within one week: show current weather
    // trip in more than one week show forecast
    console.log(req.body);
    const response = await getWeatherbitData(req.body.lat, req.body.lng);
    //console.log(response);
});

async function getWeatherbitData (lat, lng) {
    try {
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
        return {};
    }


}