import {
	App,
	Component,
	MarkdownRenderer,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { findBlocks, removeTabCharacters } from "utils";

// Remember to rename these classes and interfaces!

interface TaggedBlocksSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: TaggedBlocksSettings = {
	mySetting: "default",
};

export default class TaggedBlocks extends Plugin {
	settings: TaggedBlocksSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			"tagged-blocks",
			async (source, el, ctx) => {
				const container = el.createDiv();
				container.style.display = "flex";
				container.style.flexDirection = "column";
				container.style.rowGap = "20px";

				if (source.startsWith("#")) {
					const files = app.vault.getMarkdownFiles();
					let found = false;
					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const { name, path } = file;
						const fileContent = await this.app.vault.cachedRead(
							file
						);
						const lines = fileContent.split("\n");
						const blocks = findBlocks(source, lines);

						let box: HTMLElement | null = null;
						if (blocks.length !== 0) {
							found = true;
						}

						for (let j = 0; j < blocks.length; j++) {
							const block = blocks[j];
							const content = lines
								.filter((_line, k) => {
									if (
										k >= block.lineStart &&
										k <= block.lineEnd
									) {
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

							console.log(content);

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
						el.createEl("div", {
							text: "No blocks found",
						});
					}
				} else {
					el.createEl("div", { text: "No tag specified" });
				}
			}
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class SampleSettingTab extends PluginSettingTab {
	plugin: TaggedBlocks;

	constructor(app: App, plugin: TaggedBlocks) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
