import axios from "@/axios/axios.js"


export async function UpdateProfile(changes)
{
    try
    {
        if(typeof changes === "object")
        {
            await axios.post('/auth/profile/',{
                ...changes,
            })
        }
        else
        {
            throw new Error("Error while updating profile")
        }
    }
    catch(error)
    {
        console.error(error)
    }
}