import { defineStore } from "pinia"
import { computed, watch } from "vue"
import { authStore } from "@/stores/auth.js"
import { useI18n } from 'vue-i18n'


export const languageStore = defineStore('language', () => {
    const _auth = authStore()
    const { locale } = useI18n()


    const current = computed(() => locale.value)


    watch(() => _auth?.info?.language, (newLang) => {
            if (newLang && newLang !== locale.value)
            {
                locale.value = newLang
                localStorage.setItem('language', newLang)
            }
        }, { immediate: true }
    )


    function InitLanguage()
    {
        const backendLang = _auth?.info?.language
        const localLang = localStorage.getItem('language')

        if (backendLang)
        {
            locale.value = backendLang
        }
        else if (localLang)
        {
            locale.value = localLang
        }
    }

    function UpdateLanguage(language, exception=false)
    {
        try
        {
            if (locale.value !== language)
            {
                locale.value = language
                localStorage.setItem('language', language)

                if (_auth?.info?.language)
                {
                    _auth.UpdateUserProfile({ language })
                }
            }
        }
        catch (error)
        {
            console.error(error)
            if (exception) return error
        }
    }

    return { current, UpdateLanguage, InitLanguage }
})