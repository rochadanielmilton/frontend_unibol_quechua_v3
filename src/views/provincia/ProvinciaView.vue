<template>
  <div class="container text-center">
    <div class="row">
      <div class="mb-3">
        <div class="d-grid col-6-mx-auto offset-md-9">
          <button class="btn btn-success">
            <router-link to="/provincia/create" class="nav-link active">NUEVA PROVINCIA</router-link>
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>NOMBRE</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody class="table-group-divider" id="contenido">
              <tr v-for="prov, i in provincias" :key="prov.id">
                <td>{{ (i + 1) }}</td>
                <td>{{ prov.nombre_provincia }}</td>
                <td>
                  <router-link :to="{ path: '/provincia/edit/' + prov.id }" class="btn btn-outline-warning">
                    <i class="fa-solid fa-edit"></i>
                  </router-link> &nbsp;
                  <button class="btn btn-outline-danger" v-on:click="eliminar(prov.id, prov.nombre_provincia)">
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
  name: 'ProvinciaView',
  data() {
    return { provincias: null, datos: null }
  },
  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    this.datos = this.getProvincias();
    console.log(this.datos.result);


  },
  methods: {
    //metodo para obtener la lista de Provincias
    async getProvincias() {
      await axios.get(BASE_URL + '/parametros/provincias/')
        .then(
          response => (
            this.provincias = response.data
          )
        );
      return this.provincias

    }, eliminar(id, nombre) {
      confirmar(id, nombre);
    }
  }
}
</script>
