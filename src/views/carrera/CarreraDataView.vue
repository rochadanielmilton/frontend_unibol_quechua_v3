<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            LISTA DE CARRERAS:
          </div>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success  float-end ">
            <router-link to="/carrera/create" class="nav-link active"><i class="fa-solid fa-user-plus"></i>NUEVA
              CARRERA</router-link>
          </button>
          <button class="btn btn-warning rounded   me-1" @click="editarSeleccionado()">
            Editar
            <i class="fa-solid fa-user-plus"></i>
          </button>
          <button class="btn btn-danger  rounded   me-1" @click="eliminarSeleccionado()">
            Eliminar
            <i class="fa-solid fa-trash"></i>
          </button>
          <button class="btn btn-success" @click="mostrarMallaAcademica()">
            <i class="fa-solid fa-table"></i>Malla Académica
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="datatable" :data="carreras" :columns="columns" v-if="carreras"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 5,
            columnDefs: [{
              width: '10%', target: [3],
              width: '10%', target: [1],
            },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="columns.length">
          <thead class="table-light">
            <tr>
              <th>
                #
              </th>
              <th>
                CODIGO CARRERA
              </th>
              <th>
                NOMBRE CARRERA
              </th>
              <th>
                DESCRIPCION
              </th>
              <th>
                ESTADO
              </th>
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

//importacion de servicios adicionales
import { confirmar1, show_alerta } from '../../funciones';

//importacion librerias Datatable
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CarreraDataView',
  components: { DataTable },
  data() {
    return {
      carreras: null, url: BASE_URL + '/parametros/carreras/', principal: '', ruta: '../loading.gif',
      //seleccion de datos para las columnas del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'codigo_carrera' },
        { data: 'nombre_carrera' },

        { data: 'descripcion' },
        { data: 'estado' },
      ]
    };
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
    this.getCarreras();
    this.principal = '/carreras';
  },
  methods: {
    //verificar que se haya seleccionado una Carrera para su edicion u eliminacion
    verificarSeleccion() {
      let datos = this.carreras;
      let identificador = '';
      let nombres = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();

        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombre_carrera}`;
        let clave = datos[idx].codigo_carrera;

        identificador = clave;
      });
      return { identificador, nombres };
    },
    //metodo para editar una Carrera previa seleccion de la misma
    async editarSeleccionado() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/carrera/edit/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Una Carrera!';
        show_alerta(error, 'info')
      }
    },
    //metodo para eliminar una Carrera, previa seleccion de la misma
    eliminarSeleccionado() {
      const { identificador, nombres } = this.verificarSeleccion();

      if (identificador) {
        const ruta = 'parametros/carreras/' + identificador + '/';
        confirmar1(identificador, nombres, ruta, this.principal);
      } else {
        const error = 'Debes Seleccionar Una Carrera!';
        show_alerta(error, 'info')
      }
    },
    //redireccion a la vista mostrarMalla
    mostrarMallaAcademica() {
      const { identificador } = this.verificarSeleccion();

      if (identificador) {
        this.$router.push('/carrera/mostrarmalla/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Una Carrera!';
        show_alerta(error, 'info')
      }
    },
    //obtener carreras
    getCarreras() {
      axios.get(this.url)
        .then(response => (this.carreras = response.data));
    },
    eliminar(id, nombre) {
      const ruta = 'parametros/carreras/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
    },
  }
}
</script>
<style>
/* estilos Datatable */
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
