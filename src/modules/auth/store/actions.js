
// export const myAction = async ({ commit }) => {

import authApi from "@/api/authApi";

//action para verificar las credenciales de Usuario
export const signInUser = async ({ commit }, user) => {

    const { name, password } = user

    try {
        //la peticion va con el name y el password        
        const { data } = await authApi.post('/estudiantes/login/', {
            "username": name,
            "password": password
        })

        const { access } = data;
        const idToken = access;

        const user_role = 'ADMIN_ROLE';

        commit('loginUser', { user, idToken, user_role })
        //el error por el momento solo puede venir si las credenciales son incorrectas        
        if (!data.detail) {
            return { ok: true }
        } else {
            return { ok: false, message: data.detail }
        }
    } catch (error) {
        return { ok: false, message: 'Nombre de Usuario y/o Constraseña Incorrectos' }
    }
}
export const checkIdioma = async ({ commit }, idioma) => {
    commit('ChangeIdioma', idioma)
    return { ok: true }
}
//action para hacer un Check del IdToken del Usuario
export const checkAuthentication = async ({ commit }) => {

    const idToken = localStorage.getItem('idToken')
    //no hay idtoken salimos de la aplicacion
    if (!idToken) {
        commit('logout')
        return { ok: false, message: 'No hay token' }
    }

    try {
        //en esta seccion llamamos al endpoint que dado un idToken me retorne un usuario
        const cedula = '12778846'
        const { data } = await authApi.get('/estudiantes/estudiantes/' + cedula + '/')

        const { nombres, apellidoP, apellidoM, password: ci_estudiante } = data
        const user_role = 'ADMIN_ROLE';

        const user = {
            name: `${apellidoP} ${apellidoM} ${nombres}`,
            password: ci_estudiante,
            user_role: user_role
        }

        commit('loginUser', { user, idToken, user_role })
        return { ok: true }
    } catch (error) {
        commit('logout')
        return { ok: false, message: error }
    }
}