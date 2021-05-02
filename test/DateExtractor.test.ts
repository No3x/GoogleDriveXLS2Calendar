import {DateExtractor} from '../src/DateExtractor';



const dates = [new Date(2021, 5, 1), new Date(2021, 5, 2), new Date(2021, 5, 3), new Date(2021, 5, 4)];
const userM1 = ["M1", "A", "B", "C"];
const userM2 = ["M2", "K", "L", "M"];

const data = [
    ["Mitarbeiter", "Mai", "Mai", "Mai"],
    dates,
    userM1,
    userM2
];

const dataExtrator = new DateExtractor(data);

test('extractsDatesFromData', () => {
    expect(dataExtrator.extractDates()).toEqual(dates);
});

test('extractUsersRowFromData', () => {
    expect(dataExtrator.extractUsersRow('M1', 3)).toEqual(["A", "B", "C"]);
});
