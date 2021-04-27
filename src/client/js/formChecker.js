export function setMinMaxDates () {
    const dateInput = document.getElementById("date");

    const today = new Date();
    const lastDay = new Date();
    lastDay.setDate(today.getDate() + 16);

    dateInput.min = formatHTMLDate(today);
    dateInput.max = formatHTMLDate(lastDay);
    // still need JS validation for Safari!
}

function formatHTMLDate(date) {
    const year = date.getFullYear();
    const month = make2Digit(date.getMonth() + 1);
    const day = make2Digit(date.getDate());

    return year + "-" + month + "-" + day;
}

function make2Digit (number) {
    if (number < 10)
        return "0" + number;
    return number;
}

export function validateDate (date) {
    return isDateWithinDuration(date, 16);
}

function isDateWithinDuration (date, days) {
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];

    const todayDate = new Date();
    const inputDate = new Date(year, month - 1, day);


    for (let i = 0; i<=days; i++) {
        if(todayDate.getFullYear() == inputDate.getFullYear()
        && todayDate.getMonth() == inputDate.getMonth()
        && todayDate.getDate() == inputDate.getDate())
            return true;
        
        todayDate.setDate(todayDate.getDate() + 1);
    }
    return false;
}

export function isWithinAWeek (date) {
    return isDateWithinDuration(date, 7);
}