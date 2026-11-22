import {Season} from "./themes";

// Saisons météorologiques (hémisphère nord) : découpage par mois entiers.
export const getSeasonForDate = (date: Date = new Date()): Season => {
    const month = date.getMonth(); // 0 = janvier
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};
