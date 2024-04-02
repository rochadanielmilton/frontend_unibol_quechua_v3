<template>
  <div class="row mt-3 justify-center">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          CREAR DEPARTAMENTO
        </div>
        <div class="card-body">
          <form @submit="guardar">

            <div class="input-group mb-3">
              <input type="text" v-model="nombre_departamento" id="nombres" class="form-control" maxlength="50"
                placeholder="Nombre Departamento" required>
            </div>


            <div class="d-grid col-6-mx-auto">
              <button class="btn btn-success">
                <i class="fa-solid fa-floppy-disk"></i> Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { show_alerta, sendRequest } from "../../funciones";
import axios from 'axios';
//definicion de variable global
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CreateDepartamentoView',
  data() {
    return {
      id: 0, nombre_departamento: '',
      departamentos: null, principal: '',
      url: BASE_URL + '/parametros/departamentos/'
    }
  },
  mounted() {
    this.principal = '/materias';
  }
  , methods:
  {
    //metodo para guardar la informacion de un nuevo departamento
    async guardar() {

      event.preventDefault();
      if (this.nombre_departamento.trim() === '') {
        show_alerta('El nombre del departamento no puede ser vacio', 'warning');
      }
      else {
        const parametros = {
          nombre_departamento: this.nombre_departamento
        };
        await sendRequest('POST', parametros, this.url, 'Departamento Guardado Exitosamente!', this.principal);
        this.$router.push('/departamentos')
      }
    }
  }
}
</script>
