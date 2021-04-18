<template>
    <div>
        <div class="card">
            <v-btn color="primary" @click="grabKey">{{ locales.grabHotkey[+lang] }}</v-btn>
            <span v-if="grabbing" class="mh-15">{{ locales.pressKey[+lang] }}</span>
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
            <v-text-field :label="locales.shortcut[+lang] + locales.shortcutExample[+lang]" style="width: 0" v-model="shortcut"></v-text-field>
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
                    <v-list-item-content>
                        <table>
                            <tr>
                                <td style="width: 30%">{{ k }}</td>
                                <td>{{ v }}</td>
                            </tr>
                        </table>
                    </v-list-item-content>
                    <v-list-item-action class="mr-2">
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
        grabbing: false,
        grabbedKey: null,
        grabbed: false
    }),
    methods: {
        addShortcut() {
            this.shortcuts[this.shortcut] = this.command;
            fwgui.runCmd(`kbind ${this.shortcut} ${this.command}`);
            this.$forceUpdate();
            this.clearAdd();
        },
        clearAdd() {
            this.shortcut = '';
            this.command = '';
        },
        removeShortcut(shortcut) {
            this.$delete(this.shortcuts, shortcut);
            fwgui.runCmd(`kunbind ${shortcut}`);
        },
        editShortcut(shortcut) {
            this.shortcut = shortcut;
            this.command = this.shortcuts[shortcut];
        },
        async fetchShortcuts() {
            let tshortcuts = (await fwgui.runCmd('kbinds')).map(v => v.split(' => '));
            for (let v of tshortcuts) {
                let [name, ...other] = v;
                this.shortcuts[name] = other.join(' => ');
            }
            this.$forceUpdate();
        },
        async grabKey() {
            this.grabbing = true;
            this.grabbedKey = await fwgui.runCmd('getkey');
            this.grabbed = true;
            this.grabbing = false;
        }
    },
    components: {
    },
    mounted() {
        this.fetchShortcuts();
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