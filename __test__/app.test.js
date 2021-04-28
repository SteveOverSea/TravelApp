import { setMinMaxDates, isDateWithinDuration, formatHTMLDate } from "../src/client/js/formChecker";


describe("testing client side functionality", () => {
    test("testing form validation", () => {
        document.body.innerHTML = `<input id="date">`;

        setMinMaxDates();

        const dateInput = document.getElementById("date");
        expect(dateInput.min).toBeTruthy();
        expect(dateInput.max).toBeTruthy();

        const today = new Date();
        const seventhDay = new Date();
        seventhDay.setDate(today.getDate() + 7);
        
        expect(isDateWithinDuration(formatHTMLDate(seventhDay), 7)).toEqual(true);
        expect(isDateWithinDuration(formatHTMLDate(seventhDay), 6)).toEqual(false);   
    });
});