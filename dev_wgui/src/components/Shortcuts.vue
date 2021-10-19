<template>
    <div>
        <div class="card">
            <v-btn color="primary" @click="chooseFile">{{ locales.chooseFile[+lang] }}</v-btn>
        </div>
        <div class="entries-buttons">
            <v-text-field :label="locales.shortcut[+lang]" style="width: 0" v-model="shortcut"></v-text-field>
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
    props: ['locales', 'lang'],
    data: () => ({
        shortcut: '',
        command: '',
        shortcuts: {},
        search: ''
    }),
    methods: {
        addShortcut() {
            if (!this.shortcut || !this.command)
                return;
            this.shortcuts[this.shortcut] = this.command;
            fwgui.runCmd(`bind ${this.shortcut} ${this.command}`);
            this.$forceUpdate();
            this.clearAdd();
        },
        clearAdd() {
            this.shortcut = '';
            this.command = '';
        },
        removeShortcut(shortcut) {
            this.$delete(this.shortcuts, shortcut);
            fwgui.runCmd(`unbind ${shortcut}`);
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
                let i;
                if (i = names.indexOf(name))
                    names.splice(i, 1);
            }
            for (let name of names)
                delete this.$delete(this.shortcuts, name);
            this.$forceUpdate();
        },
        async fetchShortcuts() {
            let tshortcuts = (await fwgui.runCmd('binds'))
                .map(v => v.split(' => '))
                .filter(([name, ...other]) => [name, other.join(' => ')]);
            this.setShortcuts(Object.fromEntries(tshortcuts));
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
        this.fetchShortcuts();
        fwgui.on('shortcutsChange', this.setShortcuts);
    }
}
</script>