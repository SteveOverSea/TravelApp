import { setMinMaxDates } from "./formChecker.js"
import { submitInputForm } from "./apiRequestHandler.js"
import { locationInputHandler } from "./locationSuggester.js"

// TODO: sort out api request stuff in a second js.file

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-form").addEventListener("submit", submitInputForm);
    document.getElementById("location").addEventListener("input", locationInputHandler);
    setMinMaxDates();
});

