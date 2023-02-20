import { App, PluginSettingTab } from "obsidian";
import TagFeed from "./main";

export class SettingTab extends PluginSettingTab {
	plugin: TagFeed;

	constructor(app: App, plugin: TagFeed) {
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
