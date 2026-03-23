import { defineStore } from 'pinia'


export const historyStore = defineStore('history', () => {
    () => ({
        history: []
    })

    function UpdateAllHistory(history)
    {
        this.history = []
        this.history = history
    }

    return { UpdateAllHistory }
})