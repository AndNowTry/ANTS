import { defineStore } from "pinia"
import { computed, watch } from "vue"
import { useTheme } from "vuetify/framework"
import { authStore } from "@/stores/auth.js"


export const themeStore = defineStore('theme', () => {
    const _auth = authStore()
    const _theme = useTheme()

    const current = computed(() => {
        return _theme.global.current.value.dark ? 'dark' : 'light'
    })

    watch(() => _auth?.info?.theme, (newTheme) => {
        if (newTheme && newTheme !== current.value)
        {
            _theme.change(newTheme)
            localStorage.setItem('theme', newTheme)
        }
        }, { immediate: true }
    )

    function InitTheme()
    {
        const backendTheme = _auth?.info?.theme
        const localTheme = localStorage.getItem('theme')

        if(backendTheme)
        {
            _theme.change(backendTheme)
        }
        else if(localTheme)
        {
            _theme.change(localTheme)
        }
    }

    function UpdateTheme(theme, exception=false)
    {
        try
        {
            if (current.value !== theme)
            {
                _theme.change(theme)

                localStorage.setItem('theme', theme)

                if (_auth?.info?.username)
                {
                    _auth.UpdateUserProfile({ theme })
                }
            }
        }
        catch (error)
        {
            console.error(error)
            if (!exception) return error
        }
    }

    return { current, UpdateTheme, InitTheme }
})