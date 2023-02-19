import { App, PluginSettingTab } from "obsidian";
import TaggedBlocks from "./main";

export class SettingTab extends PluginSettingTab {
	plugin: TaggedBlocks;

	constructor(app: App, plugin: TaggedBlocks) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// containerEl.createEl("h2", { text: "Tagged Blocks Settings." });

		// new Setting(containerEl)
		// 	.setName("Setting #1")
		// 	.setDesc("It's a secret")
		// 	.addText((text) =>
		// 		text
		// 			.setPlaceholder("Enter your secret")
		// 			.setValue(this.plugin.settings.mySetting)
		// 			.onChange(async (value) => {
		// 				console.log("Secret: " + value);
		// 				this.plugin.settings.mySetting = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
	}
}
