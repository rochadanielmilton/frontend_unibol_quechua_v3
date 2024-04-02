<!-- Layout principal para el Login de Usuario -->
<template>
    <div class="limiter">
        <div class="container-login100" style="background-image: url('./assets/fondo.JPG');">
            <div class="wrap-login100 p-t-30 p-b-50">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            userForm: {}
        }
    },
}
</script>

<style lang="scss" scoped>
// estilos personalizados para la vista Login De Usuario
@import '@/modules/auth/css/util.css';
@import '../css/auth.css';
@import '../css/util.css';
</style>