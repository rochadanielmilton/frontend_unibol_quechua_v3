<template>
  <router-view />
</template>
<script>
import useAuth from './modules/auth/composables/useAuth';

export default {
  name: 'App',
  data() {
    return {

    }
  },
  setup() {
    const { authStatus, checkAuthStatus } = useAuth();
    //LLAMANDO A LA VERIFICACION SI EL USUARIO TIENE UN IDTOKEN VALIDO
    //si tiene ingresa al Sistema sino redirige al Login de Usuario
    checkAuthStatus();
    return {
      //estado del Usuario:authenticated, 'non-authenticated'
      authStatus
    }
  }
}
</script>

<style scoped></style>
