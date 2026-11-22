import {getSeasonForDate} from './season';

test.each([
    ['2026-02-28', 'winter'],
    ['2026-03-01', 'spring'],
    ['2026-05-31', 'spring'],
    ['2026-06-01', 'summer'],
    ['2026-08-31', 'summer'],
    ['2026-09-01', 'autumn'],
    ['2026-11-30', 'autumn'],
    ['2026-12-01', 'winter'],
    ['2026-12-31', 'winter'],
    ['2027-01-15', 'winter'],
])('le %s est en %s', (date, season) => {
    expect(getSeasonForDate(new Date(`${date}T12:00:00`))).toBe(season);
});
