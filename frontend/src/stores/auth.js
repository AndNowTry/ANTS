import { defineStore } from 'pinia'
import { computed, ref } from "vue"
import axios from "@/axios/axios.js"


export const authStore = defineStore('auth', () => {
    const userInfo = ref(null)
    const isUserAuthenticated = ref(false)
    const keepUserLoggedIn = ref(false)
    const openLoginDialogByUser = ref(false)
    const openRegistrationDialogByUser = ref(false)
    const openProfileSidebar = ref(false)


    const info = computed(() => {
        return !userInfo?.value ? {} : userInfo.value
    })

    const access = computed(() => {
        return userInfo?.value?.level ?? 'guest'
    })

    const avatar = computed(() => {
        return userInfo?.value?.avatar ? 'http://localhost:8000/' + userInfo.value.avatar : new URL('@/icons/Unknown_person.jpg', import.meta.url).href
    })

    const registration = computed(() => {
        return openRegistrationDialogByUser.value
    })

    const login = computed(() => {
        return openLoginDialogByUser.value
    })

    const isProfileSidebarOpen = computed({
        get()
        {
            return openProfileSidebar.value
        },
        set(value)
        {
            openProfileSidebar.value = value
        }
    })


    function OpenLoginForm()
    {
        openRegistrationDialogByUser.value = false
        openLoginDialogByUser.value = true
    }

    function CloseLoginForm()
    {
        openRegistrationDialogByUser.value = false
        openLoginDialogByUser.value = false
    }

    function OpenRegisterForm()
    {
        openLoginDialogByUser.value = false
        openRegistrationDialogByUser.value = true
    }

    function CloseRegisterForm()
    {
        openLoginDialogByUser.value = false
        openRegistrationDialogByUser.value = false
    }


    function SaveUserInfo(data, isNeighbour)
    {
        userInfo.value = data
        isUserAuthenticated.value = true

        if (isNeighbour) keepUserLoggedIn.value = isNeighbour
    }

    function DeleteUserInfo()
    {
        userInfo.value = null
        isUserAuthenticated.value = false
        keepUserLoggedIn.value = false
    }


    async function RegisterUser(username, email, password, password_confirmation, exception=false)
    {
        try
        {
            const response = await axios.post("/auth/register/", {
                username: username,
                email: email,
                password: password,
                password_confirm: password_confirmation,
            })
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function LoginUser(email, password, exception=false)
    {
        try
        {
            const response = await axios.post("/auth/login/", {
                email: email,
                password: password,
            })
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function LogoutUser(exception=false)
    {
        try
        {
            const response = await axios.post("/auth/logout/")

            if (response.data.status === "success")
            {
                DeleteUserInfo()
            }
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function GetUserProfile(exception=false)
    {
        try
        {
            const response = await axios.get("/auth/profile/")

            if(response.data.status === "success")
            {
                SaveUserInfo(response.data.data.data)
            }
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }

    async function UpdateUserProfile(changes, exception=false) //{ username: 'fgdfg' }
    {
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

            const response = await axios.post('/auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            SaveUserInfo(response.data.data.data)
        }
        catch(error)
        {
            console.error(error)
            if(!exception) return error
        }
    }



    return {
        access, info, avatar, login, registration,
        keepUserLoggedIn, isProfileSidebarOpen,
        OpenLoginForm, CloseLoginForm, OpenRegisterForm,
        CloseRegisterForm, SaveUserInfo, DeleteUserInfo,
        RegisterUser, LoginUser, LogoutUser,
        GetUserProfile, UpdateUserProfile
    }
})
