<template>
    <span class="login100-form-title p-b-41">
        Registrar
    </span>
    <form class="login100-form validate-form p-b-33 p-t-5" @submit.prevent="onSubmit">

        <div class="wrap-input100 validate-input" data-validate="Ingrese su nombre">
            <input v-model="userForm.name" class="input100" type="text" placeholder="Nombre" required>
            <span class="focus-input100" data-placeholder="&#xe82a;"></span>
        </div>

        <div class="wrap-input100 validate-input" data-validate="Ingrese correo">
            <input v-model="userForm.email" class="input100" type="email" placeholder="Correo" required>
            <span class="focus-input100" data-placeholder="&#xe818;"></span>
        </div>

        <div class="wrap-input100 validate-input" data-validate="Ingrese Contraseña">
            <input v-model="userForm.password" class="input100" type="password" placeholder="Contraseña" required>
            <span class="focus-input100" data-placeholder="&#xe80f;"></span>
        </div>

        <div class="container-login100-form-btn m-t-32">
            <button class="login100-form-btn">
                Crear Cuenta
            </button>

        </div>

        <div class="container-login100-form-btn m-t-32">
            <router-link :to="{ name: 'login' }">¿Ya tienes cuenta?</router-link>
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
            // userForm:{}
        }
    }, setup() {

        const router = useRouter();
        const { createUser } = useAuth();

        const userForm = ref({
            name: 'Johnny',
            email: '',
            password: ''
        })
        return {
            userForm,
            onSubmit: async () => {
                const { ok, message } = await createUser(userForm.value)
                if (!ok) Swal.fire('Error', message, 'error')
                else router.push({ name: 'about' })
            }


        }
    }
}
</script>
<style scoped>
@import '../css/auth.css';
@import '../css/util.css';
</style>