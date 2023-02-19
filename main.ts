import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { BlockRenderer } from "BlockRenderer";

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
				ctx.addChild(new BlockRenderer(this.app, source, el));
			}
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		//this.addSettingTab(new SampleSettingTab(this.app, this));
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
