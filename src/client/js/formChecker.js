// all the formchecker functions for input-validation

// sets min max dates on the date-input
export function setMinMaxDates () {
    const dateInput = document.getElementById("date");

    const today = new Date();
    const lastDay = new Date();
    lastDay.setDate(today.getDate() + 16);

    dateInput.min = formatHTMLDate(today);
    dateInput.max = formatHTMLDate(lastDay);
}

// format Date obj to yyyy-mm-dd format
export function formatHTMLDate(date) {
    const year = date.getFullYear();
    const month = make2Digit(date.getMonth() + 1);
    const day = make2Digit(date.getDate());

    return year + "-" + month + "-" + day;
}

// helper: create leading zeroes to make 1-digit to 2-digit number
function make2Digit (number) {
    if (number < 10)
        return "0" + number;
    return number;
}

export function validateDate (date) {
    return isDateWithinDuration(date, 16);
}

export function isWithinAWeek (date) {
    return isDateWithinDuration(date, 7);
}

// returns if a given date is in the timespan between now and now+days
export function isDateWithinDuration (date, days) {
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