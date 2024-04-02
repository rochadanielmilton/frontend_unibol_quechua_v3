<template>
    <span class="login100-form-title p-b-41">

    </span>
    <form class="login100-form validate-form p-b-33 p-t-5" @submit.prevent="onSubmit">

        <div class="wrap-input100 validate-input" data-validate="Enter username">
            <input v-model="userForm.name" class="input100" type="text" placeholder="Nombre" required>
            <span class="focus-input100" data-placeholder="&#xe82a;"></span>
        </div>

        <div class="wrap-input100 validate-input" data-validate="Enter password">
            <input v-model="userForm.password" class="input100" type="password" placeholder="Contraseña" required>
            <span class="focus-input100" data-placeholder="&#xe80f;"></span>
        </div>

        <div class="container-login100-form-btn m-t-32">
            <button class="login100-form-btn">
                Ingresar
            </button>

        </div>

    </form>
</template>

<script>
import { ref } from 'vue'
import Swal from "sweetalert2";

import useAuth from '../composables/useAuth';
import { useRouter } from "vue-router";

export default {
    data() {
        return {
            //userForm:{}
        }
    },
    setup() {

        const router = useRouter();
        const { loginUser } = useAuth();

        const userForm = ref({
            name: '',
            password: ''
        })
        return {
            userForm,
            onSubmit: async () => {
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false,
                    timer: 2000
                })
                Swal.showLoading()
                //llamada a la funcion  loginUser para verificar las credenciales
                const { ok, message } = await loginUser(userForm.value)

                if (!ok) Swal.fire('Error', message, 'error')
                //redireccion hacia la pantalla principal del Sistema
                else router.push({ name: 'estudiantes' })
            }
        }
    }
}
</script>
<style scoped>
@import '../css/auth.css';
@import '../css/util.css';
</style>