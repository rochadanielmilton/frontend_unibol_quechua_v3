<template>
  <div class="row mt-3 justify-center">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          EDITAR DEPARTAMENTO
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
import { useRoute } from "vue-router";
import axios from 'axios';
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
  name: 'EditDepartamentoView',
  data() {
    return {
      id: 0, nombre_departamento: '',
      departamentos: null, anios_asignados: null, principal: '',
      url: BASE_URL + '/parametros/departamentos'
    }
  },
  mounted() {
    const route = useRoute();
    //obtencion del id del departamento
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';
    //obtener el departamento por su id
    this.getDepartamento();

    this.principal = '/departamentos';
  },
  methods: {
    //metodo para obtener el Departamento previamente seleccionado
    getDepartamento() {
      axios.get(this.url).then(
        response => (
          this.nombre_departamento = response.data['nombre_departamento']
        )
      ).catch(error => {
        show_alerta(error, 'error')
      });
    },
    //guardar la edicion de un Departamento
    async guardar() {
      event.preventDefault();
      if (this.nombre_departamento.trim() === '') {
        show_alerta('El nombre no puede ser vacio', 'warning', 'nombre_departamento');
      } else {
        const parametros = {
          nombre_departamento: this.nombre_departamento
        }
        await sendRequest('PUT', parametros, this.url, 'Departamento Actualizado Exitosamente!', this.principal);
        this.$router.push('/departamentos')
      }
    }
  }
}
</script>
