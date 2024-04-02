
// export const myGetter = ( state ) => {
//  return state
// }

//getter para obtener el stado de autenticacion del Usuario
export const currentStatus = (state) => {
    return state.status
}

//getter para obtener el nombre de Usuario
export const username = (state) => {
    return state.user?.name
}

export const currentIdioma = (state) => {
    return state.idioma
}
