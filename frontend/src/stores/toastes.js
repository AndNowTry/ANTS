import { defineStore } from 'pinia'
import { computed, ref } from "vue"


export const toastStore = defineStore('toastes', () => {
    const _messages = ref([])

    function AddToast(color, message, icon)
    {
        _messages.value.push({
            text: message,
            color: color,
            prependIcon: icon,
            success: {
                color: color,
                prependIcon: icon,
            }
        })
    }

    const messages = computed({
        get()
        {
            return _messages.value
        },
        set(value)
        {
            _messages.value = value
        }
    })

    return { messages, AddToast }
})