# TravelApp

This website is part of the Udacity Frontend Developer Nanodegree. It is the final project to include buidling a web-page from server and client side, API calls, webpack and unit tests.

## Project Description

The user provides a location name and a destination date for an ongoing trip. If the date is in less than a week the curren weather of the location should be shown. Otherwise a 16-day forecast should be visible on the screen. Also a picture of the location should be present.

I also included icons for the weather, an alternative picture if there is nothing found from the city search and also a suggestion list during the location input.

## Technology

Backwards Engineering:
To be able to use the Weatherbit.io API, you need the coordinates of the location, which you get from Geonames API. The picture is provided by Pixabay API.

Testing used: Jest and Supertest
Loaders: Babel and MiniCSSExtract

## Credits

weather icons from https://www.weatherbit.io/api/meta
