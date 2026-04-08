import { defineStore } from 'pinia'
import  {computed, ref } from "vue"
import axios from "@/axios/axios.js"


export const historyStore = defineStore('history', () => {
    const _records = ref(JSON.parse(localStorage.getItem('history') || '[]'))

    const records = computed(() => {
        return _records.value
    })

    function SaveToStorage()
    {
        localStorage.setItem('history', JSON.stringify(_records.value))
    }

    async function UpdateAllHistory(exception=false)
    {
        try
        {
            const response = await axios.get("/file_convert/history/")

            if(response.data.status === "success")
            {
                const existing = new Map(_records.value.map(r => [r.id, r]))

                _records.value = response.data.data.map(r => ({
                    ...r,
                    viewed: existing.get(r.id)?.viewed ?? false
                }))

                SaveToStorage()
            }
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function DeleteRecordFromHistory(id, exception=false)
    {
        try
        {
            const response = await axios.post("/file_convert/history/", { id })

            if(response.data.status === "success")
            {
                _records.value = _records.value.filter(r => r.id !== id)
                SaveToStorage()
            }
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function ClearHistory(exception=false)
    {
        try
        {
            const response = await axios.post("/file_convert/history/")

            if(response.data.status === "success")
            {
                _records.value = []
                localStorage.removeItem('history')
            }
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    function MarkAsViewed(id)
    {
        const record = _records.value.find(r => r.id === id)
        if (record)
        {
            record.viewed = true
            SaveToStorage()
        }
    }

    function MarkAsViewedAll()
    {
        _records.value = _records.value.map(r => ({ ...r, viewed: true }))

        SaveToStorage()
    }

    function ClearViewed()
    {
        _records.value = _records.value.map(r => ({ ...r, viewed: false }))

        SaveToStorage()
    }

    return { records, UpdateAllHistory, DeleteRecordFromHistory, ClearHistory, MarkAsViewed, ClearViewed, MarkAsViewedAll }
})