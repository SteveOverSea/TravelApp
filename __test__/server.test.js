const app = require("../src/server/app");
const supertest = require("supertest");

const request = supertest(app);

describe("testing server: app.js", () => {
    test("testing submit endpoint", async done => {
        const res = await request.post("/submit").send({
            city: "Linz",
            countryCode: "AT",
            withinAWeek: true,
            lat: 42,
            lng: 12
        });

        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("weatherData")
        expect(res.body).toHaveProperty("imgURL");

        done();
    });

    test("testing submit endpoint", async done => {
        const res = await request.post("/cities").send({
            input: "Vienna"
        });

        expect(res.body).toBeDefined();
        expect(res.body.geonames[1].name).toEqual("Vienna");
        expect(res.body.geonames.length).toEqual(5);

        done();
    });
});
