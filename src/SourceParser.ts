import { TimeConversion } from "./TimeConversion";

//https://stackoverflow.com/a/67846380/14502635
const TAG_REGEX = new RegExp(/^tag: [^\s]+$/);
const TIME_REGEX = new RegExp(/^time: [^\s]+$/);

export class SourceParser {
	static parseSource(source: string) {
		const sourceLines = source.split("\n");

		let modifiedTime: number | null = null;
		let tag: string | null = null;
		sourceLines.forEach((line) => {
			const trimmed = line.trim();
			if (trimmed.match(TAG_REGEX)) {
				tag = "#" + trimmed.split("tag: ")[1];
			} else if (trimmed.match(TIME_REGEX)) {
				const timeString = trimmed.split("time: ")[1];
				modifiedTime = TimeConversion.toMillis(timeString);
			}
		});
		return { tag, modifiedTime };
	}
}
