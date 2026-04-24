import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VPie } from "vuetify/labs/VPie"
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

import { authStore } from "@/stores/auth.js"
import { themeStore } from "@/stores/theme.js"
import { languageStore } from "@/stores/language.js"
import { historyStore } from "@/stores/history.js"
import { VFileUpload, VFileUploadDropzone, VFileUploadItem, VFileUploadList } from "vuetify/labs/components";

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
            VTextField: {
                height: 40,
            },
        },
    },
    locale: {
        adapter: {
            t: (key, ...params) => i18n.global.t(key, params)
        }
    },
    components: {
        VFileUpload,
        VFileUploadDropzone,
        VFileUploadItem,
        VFileUploadList,
        VPie,
        ...components,
    },
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
            light: {
                colors: {
                    primary: '#7a4efc',
                },
            },
            dark: {
                colors: {
                    primary: '#7a4efc',
                },
            }
        }
    }
})

app.use(createPinia())
app.use(vuetify)
app.use(i18n)
app.use(router)
app.use(VueHighlightJS)
app.mount('#app')

const auth = authStore()
const theme = themeStore()
const language = languageStore()
const history = historyStore()

try
{
    theme.InitTheme()
    language.InitLanguage()

    await auth.GetUserProfile()
    await history.UpdateAllHistory()
}
catch(error)
{
    console.error(error)
}
