interface IBlock {
	lineStart: number;
	lineEnd: number;
}

const countTabCharacters = (text: string) => {
	var count = 0;
	var index = 0;
	while (text.charAt(index++) === "\t") {
		count++;
	}
	return count;
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
