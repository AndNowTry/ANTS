import { defineStore } from 'pinia'


export const authStore = defineStore('auth', () => {
    () => ({
        userInfo: null,
        isUserAuthenticated: false,

        keepUserLoggedIn: false,

        openLoginDialogByUser: false,
        openRegistrationDialogByUser: false,
    })

    function OpenLoginForm()
    {
        this.openRegistrationDialogByUser = false
        this.openLoginDialogByUser = true
    }

    function CloseLoginForm()
    {
        this.openRegistrationDialogByUser = false
        this.openLoginDialogByUser = false
    }

    function OpenRegisterForm()
    {
        this.openLoginDialogByUser = false
        this.openRegistrationDialogByUser = true
    }

    function CloseRegisterForm()
    {
        this.openLoginDialogByUser = false
        this.openRegistrationDialogByUser = false
    }



    function SaveUserInfo(data, isNeighbour)
    {
        this.userInfo = data
        this.isUserAuthenticated = true

        if (isNeighbour) this.keepUserLoggedIn = isNeighbour
    }

    function DeleteUserInfo()
    {
        this.userInfo = null
        this.isUserAuthenticated = false
        this.keepUserLoggedIn = false
    }

    return { OpenLoginForm, CloseLoginForm, OpenRegisterForm,
        CloseRegisterForm, SaveUserInfo, DeleteUserInfo }
})
