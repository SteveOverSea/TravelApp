import { setMinMaxDates } from "./formChecker.js"
import { submitInputForm } from "./apiRequestHandler.js"

// TODO: sort out api request stuff in a second js.file

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-form").addEventListener("submit", submitInputForm);
    setMinMaxDates();
});