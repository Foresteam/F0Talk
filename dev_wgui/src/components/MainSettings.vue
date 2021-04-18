<template>
	<div class="card">
		<v-card-title primary-title>
			{{ locales.mainTitle[+lang] }}
		</v-card-title>
		<v-divider></v-divider>
		<div class="entries-buttons">
			<v-select :items="devices" v-model="device" :label="locales.device[+lang]" @change="kek()"></v-select>
			<v-switch label="En/Ru" class="langSwitch" :value="lang" @change="$emit('langChange', $event)"></v-switch>
		</div>
		<div class="entries-buttons">
			<v-text-field :label="interpretedLabel" v-model="command" @keydown="$event.which == 13 && runOnEnter()"></v-text-field>
			<v-btn color="primary" @click="runOnEnter()">{{ locales.run[+lang] }}</v-btn>
		</div>
		<i>{{ locales.popupText[+lang] }}</i>

		<v-card-title primary-title>
			{{ locales.configTitle[+lang] }}
		</v-card-title>
		<v-divider></v-divider>
		<table style="margin: auto">
			<tr v-for="(v, i) in config" :key="i">
				<td class="pr-4">{{ i }}</td>
				<td style="width: 500px">
					<v-text-field :label="configHelp[i]" v-model="config[i]" @keydown="$event.which == 13 && applyParam(i)"></v-text-field>
				</td>
				<td class="pl-4">
					<v-btn color="primary" @click="applyParam(i)">
						{{ locales.apply[+lang] }}
					</v-btn>
				</td>
			</tr>
		</table>

		<v-dialog v-model="dialog" scrollable max-width="600px" transition="dialog-transition">
			<v-card>
				<v-card-title primary-title class="fc headline secondary">
					{{ locales.execResult[+lang] }}
				</v-card-title>
				<v-card-text>
					<div v-for="(v, i) in dialogOut" :key="i">{{ v }}</div>
				</v-card-text>
				<v-card-actions class="fc">
					<v-btn color="primary" @click="dialog = false">{{ locales.close[+lang] }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	props: ['help', 'lang', 'locales'],
	data: () => ({
		devices: [],
		config: null,
		device: null,
		command: null,
		interpretedLabel: '',
		dialog: false,
		configHelp: {},
		dialogOut: ''
	}),
	methods: {
		async runOnEnter() {
			let rs = await fwgui.runCmd(this.command)
			rs = rs.filter(v => v);
			this.command = '';
			if (rs.length > 0) {
				this.dialogOut = rs;
				this.dialog = true;
			}
		},
		async setConfigHelp() {
			this.configHelp = Object.fromEntries((await fwgui.runCmd('cfghelp')).map(v => {
				let [first, ...rest] = v.split(' - ');
				return [first, rest.join(' - ')];
			}));
		},
		setCommandLabel(v) {
			const text = this.locales.interpretedLabel_0[+this.lang];
			v = v.split(' ')[0];
			if (!v) {
				this.interpretedLabel = text;
				return;
			}
			for (let cmd of this.help) {
				let cmdSelf = cmd.split(' - ')[0];
				if (cmdSelf.indexOf(v) >= 0) {
					this.interpretedLabel = this.locales.interpretedLabel_1[+this.lang] + cmd;
					return;
				}
			}
		},
		applyParam(k) {
			console.log(k);
			fwgui.runCmd(`set ${k} ${this.config[k]}`);
		}
	},
	watch: {
		command(v) {
			this.setCommandLabel(v);
		},
		device(device, old) {
			if (!old)
				return;
			fwgui.runCmd(`set device ${device}`);
		},
		lang(nlang, olang) {
			this.setConfigHelp();
			this.setCommandLabel(this.command);
		}
	},
	async created() {
		await fwgui.exposeEnd();
		this.config = await fwgui.getConfig();
		this.devices = await fwgui.getMPVDeviceList();
		this.device = this.config.device;
		this.$emit('langChange', this.config.lang, false);
		this.setConfigHelp();
		this.command = '';
	}
}
</script>

<style>
.langSwitch {
	float: right;
}
.fc {
	display: flex;
	justify-content: center;
}
</style>