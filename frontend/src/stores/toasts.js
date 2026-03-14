import { defineStore } from 'pinia'


export const ToastStore = defineStore('toasts', () => {
    () => ({
        all_toasts: [],
    })

    function AddNotification(message)
    {
        this.all_toasts.push(message)
    }

    function DeleteNotification(index)
    {
        this.all_toasts.pop(index)
    }

    return { AddNotification, DeleteNotification }
})