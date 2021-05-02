import moment from 'moment';
import _ from 'lodash';
import {DateExtractor} from "./DateExtractor";
import {CALENDAR_COLORCODE, CALENDAR_LOCATION, CALENDAR_NAME, FOLDERID, USERNAME} from "./Config";

function pollChanges() {
    checkForChangedFiles();
}

function setupCalendar() {
    const calendars = CalendarApp.getCalendarsByName(CALENDAR_NAME);
    let eventCal;

    if (calendars.length == 0) {
        eventCal = CalendarApp.createCalendar(CALENDAR_NAME);
    } else {
        eventCal = calendars[0];
    }
    eventCal.setColor(CALENDAR_COLORCODE);
    eventCal.setSelected(true);
    return eventCal;
}

function extractDates(sheetUrl) {
    const ss = SpreadsheetApp.openByUrl(sheetUrl);
    const sheet = ss.getSheets()[0];

    const range = sheet.getDataRange();
    const values = range.getValues();

    const dateExtractor = new DateExtractor(values);
    const dates = dateExtractor.extractDates();
    const usersRow = dateExtractor.extractUsersRow(USERNAME, dates.length);
    return _.zip(dates, usersRow);
}

function createEvents(eventCal, dates) {
    _.values(dates).forEach(i => createEvent(eventCal, i[0], i[1]));
}

function createEvent(eventCal, date, shiftType) {
    let startMoment = moment(date).hour(8)
    let endMoment = moment(date).hour(12)
    let title = shiftType;
    if (shiftType.includes("ND")) {
        startMoment.hour(20);
        endMoment.add(1, 'day').hour(8).minute(30);
    } else if (shiftType.includes("ZNAS")) {
        title = `🚑🌃 ${shiftType}`
        startMoment.hour(14);
        endMoment.hour(22);
    } else if (shiftType.includes("ZNAF")) {
        title = `🚑🌅 ${shiftType}`
        startMoment.hour(8);
        endMoment.hour(16);
    } else if (shiftType.includes("A53")) {
        title = `☀️ ${shiftType}`
        startMoment.hour(8);
        endMoment.hour(16).minute(30);
    } else if (shiftType.includes("12/SD")) {
        title = `🌆 ${shiftType}`
        startMoment.hour(13).minute(30);
        endMoment.hour(22);
    } else if (shiftType.includes("TD")) {
        title = `☀️ ${shiftType}`
        startMoment.hour(8);
        endMoment.hour(20).minute(30);
    } else if (shiftType.includes("df")) {
        title = "⭐ df"
    } else if (shiftType === "U") {
        title = "Urlaub"
    } else if (shiftType.includes("")) {
        return;
    } else {
        title = "(???) " + shiftType;
        Logger.log('shiftType not known: ' + shiftType);
    }

    Logger.log('startMoment: ' + startMoment.format());
    Logger.log('endMoment: ' + endMoment.format());
    Logger.log('title: ' + title);

    if (eventIsPresentInTimeslot(eventCal, startMoment.toDate(), endMoment.toDate())) {
        Logger.log('event seems to be already there.');
    } else {
        const event = eventCal.createEvent(title, startMoment.toDate(), endMoment.toDate(), {location: CALENDAR_LOCATION});
        Logger.log('created event');
    }
}

function eventIsPresentInTimeslot(eventCal, startDate, endDate) {
    return eventCal.getEvents(startDate, endDate).length > 0;
}

function processSheet(sheetUrl) {
    const eventCal = setupCalendar();
    const dates = extractDates(sheetUrl);
    createEvents(eventCal, dates);
}

function checkForChangedFiles() {
    const folderSearch = `"${FOLDERID}" in parents`;
    const oneDayAgo = moment().subtract(1, "day");
    const startTime = oneDayAgo.toISOString();
    const search = 'trashed = false and ' + folderSearch + ' and (modifiedDate > "' + startTime + '")';
    const files = DriveApp.searchFiles(search);

    let row = "";
    let fileURL = "";
    let count = 0;

    while (files.hasNext()) {
        const file = files.next();
        const fileName = file.getName();
        fileURL = file.getUrl();
        const lastUpdated = file.getLastUpdated().toISOString();
        const dateCreated = file.getDateCreated().toISOString();
        row += "<li>" + lastUpdated + " <a href='" + fileURL + "'>" + fileName + "</a></li>";
        count++;
    }

    if (row !== "") {
        Logger.log("New document was added. " + row);
        processSheet(fileURL);
    } else {
        Logger.log("Nothing new");
    }
}
