<template>
  <div class="container text-center">
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE IDIOMA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody class="table-group-divider" id="contenido">
              <tr v-for="idioma, i in idiomas" :key="idioma.id">
                <td>{{ (i + 1) }}</td>
                <td>{{ idioma.nombre_idioma }}</td>
                <td>
                  <router-link :to="{ path: '/idioma-originario/edit/' + idioma.id }" class="btn btn-warning">
                    <i class="fa-solid fa-edit"></i>
                  </router-link> &nbsp;
                  <button class="btn btn-danger" v-on:click="eliminar(idioma.id, idioma.nombre_idioma)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import { confirmar } from '../../funciones';
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = process.env.VUE_APP_BASE_URL;
export default {
  name: 'OriginarioView',
  data() {
    return { idiomas: null, datos: null }
  },
  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    this.datos = this.getIdiomas();
    console.log(this.datos.result);


  },
  methods: {
    //obtener la lista de Idiomas Originarios
    async getIdiomas() {
      await axios.get(BASE_URL + '/parametros/idiomasOriginarios/')
        .then(
          response => (
            this.idiomas = response.data
          )
        );
      return this.idiomas

    }, eliminar(id, nombre) {
      confirmar(id, nombre);

    }
  }
}
</script>
