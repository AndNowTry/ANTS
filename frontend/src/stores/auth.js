import { defineStore } from 'pinia'
import { ref } from "vue"
import axios from "@/axios/axios.js"


export const authStore = defineStore('auth', () => {
    const userInfo = ref(null)
    const isUserAuthenticated = ref(false)
    const keepUserLoggedIn = ref(false)
    const openLoginDialogByUser = ref(false)
    const openRegistrationDialogByUser = ref(false)

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



    async function RegisterUser(username, email, password, password_confirmation )
    {
        const response = await axios.post("/auth/register/", {
            username: username,
            email: email,
            password: password,
            password_confirm: password_confirmation,
        })
    }

    async function LoginUser(email, password)
    {
        const response = await axios.post("/auth/login/", {
            email: email,
            password: password,
        })
    }

    async function LogoutUser()
    {
        const response = await axios.post("/auth/logout/")

        if (response.data.status === "success")
        {
            DeleteUserInfo()
        }
    }



    async function GetUserProfile()
    {
        const response = await axios.get("/auth/profile/")

        if(response.data.status === "success")
        {
            SaveUserInfo(response.data.data.data)
        }
    }

    async function UpdateUserProfile(changes) //{ username: 'fgdfg' }
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



    return {
        userInfo, isUserAuthenticated, keepUserLoggedIn,
        openLoginDialogByUser, openRegistrationDialogByUser,
        OpenLoginForm, CloseLoginForm, OpenRegisterForm,
        CloseRegisterForm, SaveUserInfo, DeleteUserInfo,
        RegisterUser, LoginUser, LogoutUser,
        GetUserProfile, UpdateUserProfile,
    }
})
