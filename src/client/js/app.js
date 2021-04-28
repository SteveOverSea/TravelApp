import { setMinMaxDates } from "./formChecker.js"
import { submitInputForm } from "./apiRequestHandler.js"
import { locationInputHandler } from "./locationSuggester.js"

// add eventhandler for form-submit, the location-input and sets min-max dates for date-input
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-form").addEventListener("submit", submitInputForm);
    document.getElementById("location").addEventListener("input", locationInputHandler);
    setMinMaxDates();
});

