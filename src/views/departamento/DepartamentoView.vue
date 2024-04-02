<template>
  <div class="container text-center">
    <div class="row">
      <div class="mb-3">
        <div class="d-grid col-6-mx-auto offset-md-9">
          <button class="btn btn-success">
            <router-link to="/departamento/create" class="nav-link active">NUEVO DEPARTAMENTO</router-link> <i
              class="fa-solid fa-graduation-cap"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped">
          <thead class="table-light">
            <tr>
              <th>
                #
              </th>
              <th>
                NOMBRE
              </th>
              <th class="col-2">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
            <tr v-for="departamento, i in departamentos" :key="departamento.id">
              <td>{{ i + 1 }}</td>
              <td>{{ departamento.nombre_departamento }}</td>
              <td>
                <router-link :to="{ path: '/departamento/edit/' + departamento.id }" class="btn btn-outline-warning">
                  <i class="fa-solid fa-edit"></i>
                </router-link> &nbsp;
                <button class="btn btn-outline-danger"
                  @:click="eliminar(departamento.id, departamento.nombre_departamento)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import { confirmar1 } from '../../funciones';

let BASE_URL = process.env.VUE_APP_BASE_URL;
export default {
  name: 'DepartamentoView',
  data() {
    return { departamentos: null, docente: '', docs: [], principal: '' }
  },
  mounted() {
    this.getDepartamentos();
    this.principal = '/departamentos';
  },
  methods: {
    //metodo para obtener la lista de Departamentos
    getDepartamentos() {
      axios.get(BASE_URL + '/parametros/departamentos/')
        .then(
          response => (
            this.departamentos = response.data
          )
        );
    },
    eliminar(id, nombre) {
      const ruta = 'parametros/departamentos/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
      this.$router.push({ name: 'departamentos' })
    }
  }
}
</script>
