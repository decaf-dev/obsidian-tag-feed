interface IBlock {
	lineStart: number;
	lineEnd: number;
}

const countTabCharacters = (text: string, count = 0): number => {
	if (text.charAt(0) === "\t") {
		return countTabCharacters(text.substring(1), count + 1);
	}
	return count;
};

export const removeTabCharacters = (
	text: string,
	desiredTabs: number
): string => {
	const numTabs = countTabCharacters(text);
	if (numTabs > desiredTabs) {
		//Remove one of the tabs and call the function again
		return removeTabCharacters(text.substring(1), desiredTabs);
	}
	return text;
};

export const findBlocks = (tag: string, lines: string[]) => {
	const blocks: IBlock[] = [];
	let lineStart = -1;
	let lineEnd = -1;
	let previousTabCount = 0;

	lines.forEach((line, i) => {
		if (lineStart !== -1) {
			const numTabs = countTabCharacters(line);
			if (numTabs === previousTabCount) {
				lineEnd = i - 1;
			}
		} else if (line.contains(tag)) {
			lineStart = i;
			//If it's the last line
			if (i === lines.length - 1) lineEnd = i;
		}

		if (lineEnd !== -1) {
			blocks.push({
				lineStart,
				lineEnd,
			});
			lineStart = -1;
			lineEnd = -1;
			previousTabCount = 0;
		}
	});

	return blocks;
};
