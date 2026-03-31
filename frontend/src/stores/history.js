import { defineStore } from 'pinia'
import { ref } from "vue"
import axios from "@/axios/axios.js"


export const historyStore = defineStore('history', () => {
    const records = ref(JSON.parse(localStorage.getItem('history') || '[]'))

    function SaveToStorage()
    {
        localStorage.setItem('history', JSON.stringify(records.value))
    }

    async function UpdateAllHistory()
    {
        const response = await axios.get("/file_convert/history/")

        if(response.data.status === "success")
        {
            const existing = new Map(records.value.map(r => [r.id, r]))

            records.value = response.data.data.map(r => ({
                ...r,
                viewed: existing.get(r.id)?.viewed ?? false
            }))

            SaveToStorage()
        }
    }

    async function DeleteRecordFromHistory(id)
    {
        const response = await axios.post("/file_convert/history/", { id })

        if(response.data.status === "success")
        {
            records.value = records.value.filter(r => r.id !== id)
            SaveToStorage()
        }
    }

    async function ClearHistory()
    {
        const response = await axios.post("/file_convert/history/")

        if(response.data.status === "success")
        {
            records.value = []
            localStorage.removeItem('history')
        }
    }

    function MarkAsViewed(id)
    {
        const record = records.value.find(r => r.id === id)
        if (record)
        {
            record.viewed = true
            SaveToStorage()
        }
    }

    function MarkAsViewedAll()
    {
        records.value = records.value.map(r => ({ ...r, viewed: true }))

        SaveToStorage()
    }

    function ClearViewed()
    {
        records.value = records.value.map(r => ({ ...r, viewed: false }))

        SaveToStorage()
    }


    return { records, UpdateAllHistory, DeleteRecordFromHistory, ClearHistory, MarkAsViewed, ClearViewed, MarkAsViewedAll }
})