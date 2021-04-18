<template>
    <div>
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
        <v-list>
            <v-card class="card" color="secondary" v-for="[k, v] of Object.entries(shortcuts)" :key="k">
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
        shortcuts: {}
    }),
    methods: {
        addShortcut() {
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
        },
        async fetchShortcuts() {
            let tshortcuts = (await fwgui.runCmd('binds')).map(v => v.split(' => '));
            for (let v of tshortcuts) {
                let [name, ...other] = v;
                this.shortcuts[name] = other.join(' => ');
            }
            this.$forceUpdate();
        },
        runShortcut(bind) {
            fwgui.runCmd(bind);
        }
    },
    components: {
    },
    mounted() {
        this.fetchShortcuts();
    }
}
</script>