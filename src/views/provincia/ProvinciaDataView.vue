<template>
  <div class="container ">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            LISTA DE PROVINCIAS:
          </div>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success  float-end ">
            <router-link to="/provincia/create" class="nav-link active"><i class="fa-solid fa-user-plus"></i>NUEVA
              PROVINCIA</router-link>
          </button>
          <button class="btn btn-warning rounded   me-1" @click="editarSeleccionado()">
            Editar
            <i class="fa-solid fa-user-plus"></i>
          </button>
          <button class="btn btn-danger  rounded   me-1" @click="eliminarSeleccionado()">
            Eliminar
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="datatable" :data="provincias" :columns="columns" v-if="provincias"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 5,
            columnDefs: [{
              width: '30%', target: [0],
              width: '70%', target: [1],
            },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }">
          <thead>
            <tr>
              <th>#</th>
              <th>NOMBRE</th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
          </tbody>
        </DataTable>
        <div v-else>
          <div class="row justify-content-md-center">
            <div class="col-3 alert-info text-center mt-5">
              Cargando...
              <h3 class="mt-2">
                <i class="fa fa-spin fa-sync"></i>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ref } from 'vue';
import axios from "axios";
import { confirmar, confirmar1, show_alerta } from '../../funciones';

//librerias para el Uso de Datatables
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';


DataTable.use(DataTableLib);
DataTable.use(Select);
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'ProvinciaDataView',
  components: { DataTable },
  data() {
    return {
      provincias: null, datos: null,
      //columnas de datos del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'nombre_provincia' }
      ]
    }
  },
  //inicializacion de metodos y argumentos antes de renderizacion de la vista.
  setup() {
    const table = ref(null)
    // ...
    return {
      table
    }
  },

  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    this.datos = this.getProvincias();
    console.log(this.datos.result);
    this.principal = '/provincias';


  },
  methods: {
    //metodo para verificar que se haya seleccionado una Provincia
    verificarSeleccion() {
      let datos = this.provincias;
      let identificador = '';
      let nombres = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();
        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombre_provincia}`;
        let clave = datos[idx].id;

        identificador = clave;
      });
      return { identificador, nombres };
    },
    //editar provincia seleccionada
    async editarSeleccionado() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/provincia/edit/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Una Provincia!';
        show_alerta(error, 'info')
      }
    },
    //eliminar provincia seleccionada
    eliminarSeleccionado() {
      const { identificador, nombres } = this.verificarSeleccion();

      if (identificador) {
        const ruta = 'parametros/provincias/' + identificador + '/';
        confirmar1(identificador, nombres, ruta, this.principal);
      } else {
        const error = 'Debes Seleccionar Una Provincia!';
        show_alerta(error, 'info')
      }
    },
    //obtener la lista de provincias
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
<style>
/* importacion de estilos para Uso de Datatables */
@import 'datatables.net-bs5';
@import 'datatables.net-responsive-dt';

table.dtr-inline.collapsed>tbody>tr>td.dtr-control,
table.dataTable.dtr-inline.collapsed>tbody>tr>th.dtr-control {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
}

table.dataTable.dtr-inline.collapsed>tbody>tr.parent>td.dtr-control:before,
table.dataTable.dtr-inline.collapsed>tbody>tr.parent>th.dtr-control:before {
  content: "-";
  background-color: #d33333;
}

table.dataTable.dtr-inline.collapsed>tbody>tr>td.dtr-control:before,
table.dataTable.dtr-inline.collapsed>tbody>tr>th.dtr-control:before {
  content: "+";
  background-color: #31b131;
  background-color: #74a2ff;
}
</style>