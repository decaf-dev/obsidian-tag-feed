import {
	App,
	Component,
	MarkdownRenderChild,
	MarkdownRenderer,
} from "obsidian";
import { findBlocks, removeTabCharacters } from "utils";

export class BlockRenderer extends MarkdownRenderChild {
	app: App;
	source: string;

	constructor(app: App, source: string, containerEl: HTMLElement) {
		super(containerEl);
		this.app = app;
		this.source = source.trim();
	}

	async onload() {
		//Make a container element
		const container = this.containerEl.createDiv();
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.rowGap = "20px";

		if (this.source.startsWith("#")) {
			const files = app.vault.getMarkdownFiles();
			let found = false;
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const { name, path } = file;
				const fileContent = await this.app.vault.cachedRead(file);
				const lines = fileContent.split("\n");
				const blocks = findBlocks(this.source, lines);
				let box: HTMLElement | null = null;
				if (blocks.length !== 0) {
					found = true;
				}
				for (let j = 0; j < blocks.length; j++) {
					const block = blocks[j];
					const content = lines
						.filter((_line, k) => {
							if (k >= block.lineStart && k <= block.lineEnd) {
								return true;
							}
							return false;
						})
						.map((line, i) => {
							//Since we can display sub-lists, the number of tabs will be off depending
							//on what level of the list has a tag.
							//For example, if the 2nd list item has a tag, then it will have 1 tab.
							//- Bullet 1
							//	- Bullet 2 #tag
							//
							//We then will then render "	- Bullet 2 #tag"
							//In order for to be rendered properly by the renderMarkdown function, we should
							//remove the tab.
							//
							//The number of tabs to display should match the index of the number of line.
							return removeTabCharacters(line, i);
						})
						.join("\n");
					box = container.createDiv();
					box.style.backgroundColor = "var(--color-base-20)";
					box.style.padding = "10px 20px 10px 20px";
					box.style.display = "flex";
					box.style.flexDirection = "column";
					box.style.rowGap = "5px";
					await MarkdownRenderer.renderMarkdown(
						"[[" + name.split(".md")[0] + "]]",
						box,
						path,
						new Component()
					);
					await MarkdownRenderer.renderMarkdown(
						content,
						box,
						path,
						new Component()
					);
					for (let j = 0; j < box.children.length; j++) {
						const child = box.children[j] as HTMLElement;
						const tagName = child.tagName.toLowerCase();
						if (tagName == "ul") {
							child.style.paddingLeft = "20px";
						}
						child.style.marginTop = "0px";
						child.style.marginBottom = "0px";
					}
				}
			}
			if (!found) {
				this.containerEl.createEl("div", {
					text: "No blocks found",
				});
			}
		} else {
			this.containerEl.createEl("div", { text: "No tag specified" });
		}
	}
}
