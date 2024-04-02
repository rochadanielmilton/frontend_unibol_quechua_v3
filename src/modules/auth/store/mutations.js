
// export const myAction = ( state ) => {

// }

//mutation para cambiar el state y sus propiedades del Usuario
export const loginUser = (state, { user, idToken, user_role = '' }) => {

    if (idToken) {
        localStorage.setItem('idToken', idToken)
        state.idToken = idToken
    }

    state.user = user;
    state.status = 'authenticated';
    state.role = user_role;
}
//mutation para limpiar el state del Usuario
export const logout = (state) => {
    state.user = null
    state.idToken = null
    state.role = null
    state.status = 'not-authenticated'

    localStorage.removeItem('idToken');

}

export const ChangeIdioma = (state, idioma) => {
    if (idioma === 'español') {
        state.idioma = 'quechua'
    } else {
        state.idioma = 'español'
    }

}