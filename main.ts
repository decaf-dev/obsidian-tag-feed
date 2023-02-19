import {
	App,
	Component,
	MarkdownRenderer,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { findBlocks } from "utils";

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
						const { path } = file;
						const fileContent = await this.app.vault.cachedRead(
							file
						);
						const lines = fileContent.split("\n");
						const blocks = findBlocks(source, lines);

						let box: HTMLElement | null = null;
						if (blocks.length !== 0) {
							found = true;
						}
						blocks.forEach((block, j) => {
							const content = lines
								.map((line, k) => {
									if (
										k >= block.lineStart &&
										k <= block.lineEnd
									) {
										return line;
									}
									return "";
								})
								.join("\n")
								.trim();

							box = container.createDiv();
							box.style.backgroundColor = "#f6f7f6";
							box.style.padding = "5px 20px 5px 20px";

							MarkdownRenderer.renderMarkdown(
								"[[" + path.split(".md")[0] + "]]",
								box,
								file.path,
								new Component()
							);

							MarkdownRenderer.renderMarkdown(
								content,
								box,
								file.path,
								new Component()
							);
						});
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
