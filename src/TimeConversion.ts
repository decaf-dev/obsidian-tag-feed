const MILLIS_SECOND = 1000;
const MILLIS_MINUTE = MILLIS_SECOND * 60;
const MILLIS_HOUR = MILLIS_MINUTE * 60;
const MILLIS_DAY = 24 * MILLIS_HOUR;
const MILLIS_WEEK = 7 * MILLIS_DAY;
const MILLIS_MONTH = 4 * MILLIS_WEEK;

const TIME_REGEX = new RegExp(
	/^([1-7]-day)|([1-4]-week)|(([1-9]|10|11|12)-month)$/
);

export class TimeConversion {
	static toMillis(text: string) {
		if (text.match(TIME_REGEX)) {
			if (text.endsWith("day")) {
				const numDays = parseInt(text.split("-day")[0]);
				return MILLIS_DAY * numDays;
			} else if (text.endsWith("week")) {
				const numWeeks = parseInt(text.split("-week")[0]);
				return MILLIS_WEEK * numWeeks;
			} else if (text.endsWith("month")) {
				const numMonths = parseInt(text.split("-month")[0]);
				return MILLIS_MONTH * numMonths;
			}
		}
		return -1;
	}
}
