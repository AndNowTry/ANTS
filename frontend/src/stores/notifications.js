import { defineStore } from 'pinia'


export const NotificationStore = defineStore('notifications', () => {
    () => ({
        all_notifications: [],
    })

    function AddNotification(message)
    {
        this.all_notifications.push(message)
    }

    function DeleteNotification(index)
    {
        this.all_notifications.pop(index)
    }

    return { AddNotification, DeleteNotification }
})