<template>
  <div class="row mt-3">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          REGISTRAR NUEVA PROVINCIA
        </div>
        <div class="card-body">
          <form @submit="guardar">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-file-lines"></i>
              </span>
              <input type="text" v-model="nombre" id="nombre" class="form-control" maxlength="50"
                placeholder="Nombre de la Provincia" required>
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
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CreateProvinciaView',
  data() {
    return {
      nombre: '', url: BASE_URL + '/parametros/provincias/'
    }
  }, methods: {
    //metodo para guardar los datos para una Nueva Provincia
    guardar() {
      event.preventDefault();
      if (this.nombre.trim() === '') {
        show_alerta('El nombre no puede ser vacio', 'warning', 'nombre');
      } else {
        const parametros = { nombre_provincia: this.nombre.trim() };
        sendRequest('POST', parametros, this.url, 'Provincia Guardada Exitosamente!');
      }
    }
  }
}
</script>
