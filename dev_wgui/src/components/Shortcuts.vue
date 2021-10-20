<template>
    <div>
        <div class="card">
            <v-btn v-if="isHotkeys" color="primary" @click="grabKey" style="margin-right: 10px;">{{ locales.grabKey[+lang] }}</v-btn>
            <span v-if="grabbing" class="mh-15">{{ locales.pressKey[+lang] }}</span>
            <v-btn color="primary" @click="chooseFile">{{ locales.chooseFile[+lang] }}</v-btn>
        </div>
        <v-snackbar v-model="grabbed">
            {{ locales.grabbed[+lang] }} {{ grabbedKey }}
            <template v-slot:action="">
                <v-btn color="primary" text @click="grabbed = false">
                    {{ locales.close[+lang] }}
                </v-btn>
            </template>
        </v-snackbar>
        <div class="entries-buttons">
            <v-text-field :label="locales.shortcut[+lang] + (isHotkeys ? locales.shortcutExample[+lang] : '')" style="width: 0" v-model="shortcut"></v-text-field>
            <v-text-field :label="locales.command[+lang]" v-model="command"></v-text-field>
            <v-btn color="success" @click="addShortcut()">
                {{ locales.add[+lang] }}
            </v-btn>
            <v-btn color="primary" @click="clearAdd()">
                {{ locales.clear[+lang] }}
            </v-btn>
        </div>
        <div class="entries-buttons">
            <v-text-field :label="locales.search[+lang]" v-model="search"></v-text-field>
        </div>
        <v-list>
            <v-card class="card" color="secondary" v-for="[k, v] of Object.entries(shortcuts).filter(V => (V[0] + V[1]).indexOf(search) >= 0)" :key="k">
                <v-list-item>
                    <v-list-item-content class="">
                        <table>
                            <tr>
                                <td style="width: 30%">{{ k }}</td>
                                <td>{{ v }}</td>
                            </tr>
                        </table>
                    </v-list-item-content>
                    <v-list-item-action class="mr-2">
                        <v-btn color="primary" @click="runShortcut(k)">
                            {{ locales.run[+lang] }}
                        </v-btn>
                    </v-list-item-action>
                    <v-list-item-action class="mr-2 ml-2">
                        <v-btn color="primary" @click="editShortcut(k)">
                            {{ locales.edit[+lang] }}
                        </v-btn>
                    </v-list-item-action>
                    <v-list-item-action class="ml-2">
                        <v-btn color="error" @click="removeShortcut(k)">
                            {{ locales.remove[+lang] }}
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card>
        </v-list>
    </div>
</template>

<script>

export default {
    props: ['locales', 'lang', 'isHotkeys'],
    data: () => ({
        shortcut: '',
        command: '',
        shortcuts: {},
        search: '',
        grabbing: false,
        grabbedKey: null,
        grabbed: false,
        bindCmd: 'bind'
    }),
    methods: {
        addShortcut() {
            if (!this.shortcut || !this.command)
                return;
            this.shortcuts[this.shortcut] = this.command;
            fwgui.runCmd(`${this.bindCmd} ${this.shortcut} ${this.command}`);
            this.$forceUpdate();
            this.clearAdd();
        },
        clearAdd() {
            this.shortcut = '';
            this.command = '';
        },
        removeShortcut(shortcut) {
            this.$delete(this.shortcuts, shortcut);
            fwgui.runCmd(`un${this.bindCmd} ${shortcut}`);
        },
        editShortcut(shortcut) {
            this.shortcut = shortcut;
            this.command = this.shortcuts[shortcut];
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        },
        async setShortcuts(_shortcuts) {
            let names = Object.keys(this.shortcuts) || [];
            for (let [name, value] of Object.entries(_shortcuts)) {
                this.shortcuts[name] = value;
                let i = names.indexOf(name);
                if (i >= 0)
                    names.splice(i, 1);
            }
            for (let name of names)
                delete this.$delete(this.shortcuts, name);
            this.$forceUpdate();
        },
        async fetchShortcuts() {
            let tshortcuts = (await fwgui.runCmd(`${this.bindCmd}s`))
                .map(v => v.split(' => '))
                .filter(([name, ...other]) => [name, other.join(' => ')]);
            this.setShortcuts(Object.fromEntries(tshortcuts));
        },
        async grabKey() {
            this.grabbing = true;
            this.grabbedKey = await fwgui.runCmd('getkey');
            this.grabbed = true;
            this.grabbing = false;
        },
        runShortcut(bind) {
            fwgui.runCmd(bind);
        },
        async chooseFile() {
            this.command += await fwgui.chooseFile() || '';
        }
    },
    components: {
    },
    mounted() {
        if (this.isHotkeys)
            this.bindCmd = 'k' + this.bindCmd;
        this.fetchShortcuts();
        fwgui.on(this.isHotkeys ? 'keyBindsChange' : 'shortcutsChange', this.setShortcuts);
    }
}
</script>
<style>
.mh-15 {
    margin-left: 15px;
    margin-right: 15px;
    display: inline-block;
}
</style>