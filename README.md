# Travel Weather App

This website is part of the Udacity Frontend Developer Nanodegree. It is the final project to include buidling a web-page from server and client side, API calls, webpack and unit tests.

## Project

### Install

Install the node-modules.

```
npm install
```

Provide your person API-Keys in a .env file in the project root. (dotenv) 

Start the server (default port: 8080)

```
npm run start
```

Build the project - then a dist folder should appear in your root folder

```
npm run build-prod
```

Run the test
```
npm run test
```

### Description

The user provides a location name and a destination date for a desired trip. If the date is in less than a week the current weather of the location should be shown. Otherwise a 16-day forecast should be visible on the screen. Also a picture of the location should be present.

## Implementation

### Structure

- [test](https://github.com/SteveOverSea/TravelApp/tree/master/__test__)
  - [app.test.js](https://github.com/SteveOverSea/TravelApp/tree/master/__test__/app.test.js)
  - [server.test.js](https://github.com/SteveOverSea/TravelApp/tree/master/__test__/server.test.js)
- src
  - [client](https://github.com/SteveOverSea/TravelApp/tree/master/src/client)
    - js
      - [app.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/js/app.js)
      - [apiRequestHandler.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/js/apiRequestHandler.js)
      - [formChecker.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/js/formChecker.js)
      - [locastionSuggester.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/js/locationSuggester.js)
    - styles
      - [base.scss](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/styles/base.scss)
      - [form.scss](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/styles/form.scss)
      - [result.scss](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/styles/result.scss)
    - views
      - [index.html](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/views/index.html)
    - [index.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/client/index.js)
  - [server](https://github.com/SteveOverSea/TravelApp/tree/master/src/server)
    - [server.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/server/server.js)
    - [app.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/server/server.js)

### App Functionality

#### Server-side

The server is based on Node.js. It is split up between [app.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/server/server.js)and [server.js](https://github.com/SteveOverSea/TravelApp/tree/master/src/server/server.js) to separate the listening server from the functionality of the API.

##### app.js

There are two POST routes implemented:
- /cities
- /submit

/cities is provided with at least the first three letters of the user's location input, makes a request to Geonames API and returns five suggestion of the location, including all the detailed data which is needed later on (like latitude and longitude).

/submit transforms the collected data on the client side (city, country, isWithinAWeek, latitude, longitude) and makes depending on the isWithinAWeek condition either a call to Weatherbit.io for the current weather or a 16-day forecast. And it also makes a request to Pixabay API for the given city. If no picture was found for the city a search for the country is followed and otherwise a search for the term "travel".

#### Client-side

##### app.js

This is the starting point of the app, which sets the eventHandlers for the location-input and the submit button and sets the acceptable min-max-dates for the date-input.

##### apiRequestHandler.js

Three things. First collect and prepare the user's input before the submit-form is sent to the server. Then doing the request and afterwards preparing the DOM for printing the results.

##### formChecker.js

As some browser don't have a date picker which restricts the user's input by setting the min-max attributes, the app needs to check the date-input in the format YYY-MM-DD. This is done here. JavaScript Date Objects are transformed to this format and functionality is given to check if the given date is in a certain duration from the current date.

##### locationSuggester.js

This event-handler function is called every time the user makes an input on the location input. It should decide whether the input is selected or it's just another entered letter for the location search. I implemented this by checking if the event is an instance of InputEvent. If it is an InputEvent, reset the datalist options and make a new call to the /cities route to get another five suggestions and adding them to the datalist. 

If the user selected an option, the latitude and longitude data-attributes should be written on the input itself, to be later read off.

### Additional Notes

The scss styles could be more refactored and the test files could be more specific. For this project I decided to focus more on the app functionality.

Also somehow the Input-Event detection and the datalist suggestion in locationSuggester.js doesn't work fully in Safari. It's interesting that the suggested options are only shown after adding a space or backspace on the input.

## Technology

**Webpack**
- MiniCSSExtract
- BabelLoader
- FileLoader (for the weather icons)
- WorkboxPlugin (service workers)

**Testing**
- Jest
- supertest

**API**:
- Weatherbit.io
- Geonames
- Pixabay

## Credits

weather icons from https://www.weatherbit.io/api/meta
