<template>
	<v-app>
		<v-app-bar app>
			<div class="d-flex align-center">
				<v-img
					alt="F0Talk logo"
					class="shrink mr-2"
					contain
					:src="require('@/assets/logo.svg')"
					transition="scale-transition"
					width="55"
				/>
				<h1>F0Talk</h1>
			</div>

			<v-spacer></v-spacer>

			<v-tabs color="white" style="margin-left: 30px" v-model="tab">
				<v-tabs-slider color="white"></v-tabs-slider>
				<v-tab>{{ locales.mainSettingsTab[+lang] }}</v-tab>
				<v-tab>{{ locales.commandShortcutsTab[+lang] }}</v-tab>
				<v-tab>{{ locales.hotkeysTab[+lang] }}</v-tab>
				<v-tab>{{ locales.aboutTab[+lang] }}</v-tab>
			</v-tabs>
			
			<v-btn @click="openMyGit" target="_blank" text>
				<span class="mr-2">GitHub</span>
				<v-icon>mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<v-tabs-items v-model="tab"><!-- style="background: none" -->
				<v-tab-item><MainSettings :help="help" :lang="lang" @langChange="langChange" :locales="locales"/></v-tab-item>
				<v-tab-item><Shortcuts :locales="locales" :lang="lang"/></v-tab-item>
				<v-tab-item><Hotkeys :locales="locales" :lang="lang"/></v-tab-item>
				<v-tab-item><About :help="help" :locales="locales" :lang="lang" /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-app>
</template>

<script>
import MainSettings from './components/MainSettings';
import Shortcuts from './components/Shortcuts';
import Hotkeys from './components/Hotkeys';
import About from './components/About';

export default {
	name: 'App',
	components: {
		MainSettings,
		Shortcuts,
		Hotkeys,
		About
	},
	data: () => ({
		tab: 0,
		config: null,
		help: [],
		locales: require('./../../src/shared/locales'),
		lang: false
	}),
	methods: {
		openMyGit() {
			fwgui.openMyGitHub();
		},
		langChange(v, send = true) {
			this.lang = v || false;
			if (send)
				fwgui.runCmd(`set lang ${this.lang}`);
		}
	},
	async mounted() {
		await fwgui.exposeEnd();
		this.help = await fwgui.runCmd('help');
	}
};
</script>

<style>
body::-webkit-scrollbar {
	display: none;
}
.entries-buttons {
    display: flex;
}
.entries-buttons > * {
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
}
.card {
    /* background: #000; */
	margin: 4px;
}
.v-list-item__action, .v-list-item__content {
	padding: 0px !important;
	margin: 0px !important;
}
</style>