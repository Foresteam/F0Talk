import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import colors from 'vuetify/lib/util/colors'

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: colors.blue.darken2,
                secondary: colors.grey.darken3,
                accent: colors.shades.black,
                error: colors.red.accent3
            }
        },
        dark: true
    }
});
