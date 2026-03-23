import axios from "@/axios/axios.js"
import { authStore } from "@/stores/auth.js"


export async function UpdateProfile(changes)
{
    const auth = authStore()

    try
    {
        const formData = new FormData()

        for (const key in changes)
        {
            if (changes[key] !== null && changes[key] !== undefined)
            {
                formData.append(key, changes[key])
            }
        }

        const ProfileResponse = await axios.post('/auth/profile/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        auth.SaveUserInfo(ProfileResponse.data.data.data)
    }
    catch (error)
    {
        throw error
    }
}