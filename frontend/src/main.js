import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import { russian } from '@/languages/ru.js'
import { english } from '@/languages/en.js'

import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import VueHighlightJS from 'vue3-highlightjs'

import './styles/vuetify/_external.css'

import App from './App.vue'
import router from '@/router/index.js'

const app = createApp(App)

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        ru: { ...russian },
        en: { ...english }
    },
})

const vuetify = createVuetify({
    defaults: {
        global: {
            style: {
                fontFamily: 'Nunito, sans-serif',
            },
        },
    },
    locale: {
        adapter: {
            t: (key, ...params) => i18n.global.t(key, params)
        }
    },
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        themes: {
            light: {},
            dark: {}
        }
    }
})

app.use(createPinia())
app.use(vuetify)
app.use(i18n)
app.use(router)
app.use(VueHighlightJS)
app.mount('#app')
