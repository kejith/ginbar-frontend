export function readPostIdFromUrl() {
    var pathName = window.location.pathname;
    var pathComponents = pathName.split("/");

    // if a post is specified in the url
    // set this post as current shown
    var curPost = 0;
    if (pathComponents.length > 0) {
        if (pathComponents[1] === "post") {
            curPost = parseInt(pathComponents[2]);
        }
    }

    return curPost;
}

export function getDimensionsOfElement(tagName) {
    var w = window;
    var d = document;
    var documentElement = d.documentElement;
    var body = d.getElementsByTagName(tagName)[0];
    var width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    var height =
        w.innerHeight || documentElement.clientHeight || body.clientHeight;

    return { width: width, height: height };
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

// Calculates the Diffrence Between two dates and returns a string
// that is humanly readable in the form of
// "1 Jahr" or "3 Months" or "56 Seconds"
export function howLongAgoHumanReadable(earlierDate) {
    var nowDate = new Date();
    var now = nowDate.getTime();
    var earlier = earlierDate.getTime();

    // we will use the bitwise or "|" operator to floor numbers
    var diff = now - earlier;
    if (diff < MINUTE) {
        return "einem Moment";
    }
    if (diff < HOUR) {
        var minuteCount = (diff / MINUTE) | 0;
        if (minuteCount > 1) {
            return minuteCount + " Minuten";
        }

        return "einer Minute";
    }
    if (diff < DAY) {
        var hoursCount = (diff / HOUR) | 0;
        if (hoursCount > 1) {
            return hoursCount + " Stunden";
        }

        return "einer Stunde";
    }
    if (diff < WEEK) {
        var dayCount = (diff / DAY) | 0;
        if (dayCount > 1) {
            return dayCount + " Tagen";
        }

        return "einem Tag";
    }

    var oneMonthAfterEarlierDate = new Date(
        earlierDate.getFullYear(),
        earlierDate.getMonth() + 1,
        earlierDate.getDate()
    );

    var oneYearAfterEarlierDate = new Date(
        earlierDate.getFullYear() + 1,
        earlierDate.getMonth(),
        earlierDate.getDate()
    );

    const ONE_MONTH = oneMonthAfterEarlierDate.getTime() - earlier;
    const ONE_YEAR = oneYearAfterEarlierDate.getTime() - earlier;

    if (diff < ONE_MONTH) {
        var weekCount = (diff / WEEK) | 0;
        if (weekCount > 1) {
            return weekCount + " Wochen";
        }

        return "einer Woche";
    }

    if (diff < ONE_YEAR) {
        var monthCount = nowDate.getMonth() - earlierDate.getMonth();
        if (monthCount > 1) {
            return monthCount + " Monaten";
        }

        return "einem Monat";
    }

    var yearCount = nowDate.getFullYear() - earlierDate.getFullYear();
    if (yearCount > 1) {
        return yearCount + " Jahren";
    }

    return "einem Jahr";
}
