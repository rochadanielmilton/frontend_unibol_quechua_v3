import store from "@/store"

//Guard para definir si el Usuario tiene un idToken
const isAuthenticatedGuard = async (to, from, next) => {

    const { ok } = await store.dispatch('auth/checkAuthentication')
    if (ok) next()
    else next({ name: 'login' })
}

export default isAuthenticatedGuard