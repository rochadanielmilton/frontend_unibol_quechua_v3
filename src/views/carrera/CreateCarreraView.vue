<template>
  <div class="row mt-3 justify-center">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          CREAR CARRERA
        </div>
        <div class="card-body">
          <form @submit="guardar">

            <div class="input-group mb-3">
              <input type="text" v-model="codigo_carrera" id="codigo_carrera" class="form-control" maxlength="300"
                placeholder="Codigo Carrera" required>
            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="nombre_carrera" id="nombre_carrera" class="form-control" maxlength="300"
                placeholder="Nombre Carrera" required>
            </div>


            <div class="input-group mb-3">
              <input type="text" v-model="descripcion" id="descripcion" class="form-control" maxlength="300"
                placeholder="Descripcion" required>
            </div>


            <div class="input-group mb-3">
              <select class="form-select text-center" id="estado" required v-model="estado">
                <option value="" selected>---Estado---</option>
                <option value="habilitado">Habilitado</option>
                <option value="inhabilitado">Inhabilitado</option>
              </select>
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
//variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CreateCarreraView',
  data() {
    return {
      id: 0, codigo_carrera: '', nombre_carrera: '', descripcion: '', estado: '',
      url: BASE_URL + '/parametros/carreras/',
      principal: ''
    }
  }, mounted() {

    this.principal = '/carreras';
  }
  , methods:
  {
    //metodo para guardar una Nueva Carrera
    async guardar() {
      event.preventDefault();
      if (this.nombre_carrera.trim() === '') {
        show_alerta('Los nombres no puede ser vacio', 'warning');
      }
      else {

        const parametros = {
          codigo_carrera: this.codigo_carrera,
          nombre_carrera: this.nombre_carrera,
          descripcion: this.descripcion,

          estado: this.estado,
        };
        await sendRequest('POST', parametros, this.url, 'Carrera Guardada Exitosamente!', this.principal);
        this.$router.push('/carreras')
      }
    }
  }
}
</script>
