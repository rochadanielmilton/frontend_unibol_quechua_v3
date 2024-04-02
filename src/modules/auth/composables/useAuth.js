import { computed } from 'vue';
import { useStore } from 'vuex';


const useAuth = () => {
    const store = useStore()

    //llamada al action loginUser
    const loginUser = async (user) => {

        const resp = await store.dispatch('auth/signInUser', user)
        return resp
    }

    //llamada al action checkSAuthStatus
    const checkAuthStatus = async () => {
        const resp = await store.dispatch('auth/checkAuthentication')
        return resp
    }


    const cambiarIdioma = async (idioma) => {
        const resp = await store.dispatch('auth/checkIdioma', idioma)
        return resp
    }

    //llamada al getter getStatus para conocer si el usuario esta autenticado
    const getStatus = async () => {
        const resp = await store.getters['auth/currentState']
        return resp
    }

    //llamada al mutation logout para limpiar el LocalStorage
    const logout = () => {

        store.commit('auth/logout');
    }

    //exponiendo actions y mutations respectivamente
    return {
        loginUser,
        checkAuthStatus,
        authStatus: computed(() => store.getters['auth/currentStatus']),
        username: computed(() => store.getters['auth/username']),
        authIdioma: computed(() => store.getters['auth/currentIdioma']),
        getStatus,
        logout,
        cambiarIdioma
    }
}


export default useAuth
