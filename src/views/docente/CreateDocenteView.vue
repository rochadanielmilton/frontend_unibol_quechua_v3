<template>
  <div class="row mt-3 justify-center">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          CREAR DOCENTE
        </div>
        <div class="card-body">
          <form @submit="guardar">

            <div class="input-group mb-3">
              <input type="text" v-model="nombres" id="nombres" class="form-control" maxlength="50" placeholder="Nombres"
                required>
            </div>


            <div class="input-group mb-3">
              <input type="text" v-model="apellidop" id="apellidop" class="form-control" maxlength="50"
                placeholder="Apellido Paterno" required>
              <input type="text" v-model="apellidom" id="apellidom" class="form-control" maxlength="50"
                placeholder="Apellido Materno" required>
            </div>


            <div class="input-group mb-3 ">
              <span class="input-group-text"><i class="fa-solid fa-user"></i>
              </span>
              <input type="number" v-model="ci" id="ci" class="form-control col-md-4" maxlength="50" placeholder="C.I."
                required>
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-phone"></i>
              </span>
              <input type="number" v-model="celular" id="celular" class="form-control" maxlength="50"
                placeholder="Celular" required>
              <span class="input-group-text"><i class="fa-solid fa-location-dot"></i>
              </span>
              <input type="text" v-model="direccion" id="direccion" class="form-control" maxlength="50"
                placeholder="Direccion" required>
            </div>


            <div class="input-group mb-3">
              <input type="text" v-model="profesion" id="profesion" class="form-control" maxlength="50"
                placeholder="Profesion" required>
            </div>

            <div class="input-group mb-3">
              <input type="email" v-model="correo" id="correo" class="form-control" maxlength="50" placeholder="Correo"
                required>
            </div>

            <div class="input-group mb-3">
              <input type="number" v-model="numero_item" id="numero_item" class="form-control" maxlength="50"
                placeholder="Número Item" required>
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
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CreateDocenteView',
  data() {
    return {
      id: 0, nombres: '', apellidop: '', apellidom: '', ci: '', celular: 0, direccion: '', profesion: '', estado: '', principal: '', correo: '', numero_item: '',
      url: BASE_URL + '/docentes/docentes/'
    }
  }, mounted() {

    this.principal = '/docentes';
  }
  , methods:
  {
    //metodo para guardar un Nuevo Docente
    async guardar() {

      event.preventDefault();
      if (this.nombres.trim() === '') {
        show_alerta('Los nombres no puede ser vacio', 'warning');
      }
      else {

        const parametros = {
          nombres: this.nombres,
          apellidop: this.apellidop,
          apellidom: this.apellidom,
          ci: this.ci,
          celular: this.celular,
          direccion: this.direccion,
          profesion: this.profesion,
          correo: this.correo,
          numero_item: this.numero_item,

          estado: this.estado,
        };

        await sendRequest('POST', parametros, this.url, 'Docente Guardado Exitosamente!', this.principal);
        this.$router.push('/docentes')
      }
    }
  }
}
</script>
