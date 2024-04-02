<template>
  <div class="container ">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            LISTA DE DOCENTES:
          </div>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success  float-end ">
            <router-link to="/docente/create" class="nav-link active"><i class="fa-solid fa-user-plus"></i>NUEVO
              DOCENTE</router-link>
          </button>
          <button class="btn btn-warning rounded   me-1" @click="editarSeleccionado()">
            Editar
            <i class="fa-solid fa-user-plus"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="datatable" :data="docentes" :columns="columns" v-if="docentes"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 5,
            columnDefs: [{
              width: '40%', target: [6],
              width: '10%', target: [7],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 3, targets: 3 },
            { responsivePriority: 4, targets: 4 },
            ],
            language: {
              search: 'Buscar', zeroRecords: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="columns.length">
          <thead class="table-light">
            <tr>
              <th class="col">
                #
              </th>
              <th>
                NOMBRES
              </th>
              <th>
                APELLIDO-P.
              </th>
              <th>
                APELLIDO-M.
              </th>
              <th>
                C.I.
              </th>
              <th>
                CELULAR
              </th>
              <th>
                PROFESIÓN
              </th>
              <th>
                CORREO
              </th>
              <th>
                NÚMERO ITEM
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
import { confirmar1, show_alerta } from '../../funciones';

//librerias para el uso de Datatable
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  components: { DataTable },
  name: 'DocenteDataView',
  data() {
    return {
      docentes: null,
      ruta: '../loading.gif',
      principal: '/docentes',
      //columnas de datos del Datatable
      columns: [
        { data: 'id' },
        { data: 'nombres' },
        { data: 'apellidop' },
        { data: 'apellidom' },
        { data: 'ci' },
        { data: 'celular' },
        { data: 'profesion' },
        { data: 'correo' },
        { data: 'numero_item' },
        { data: 'estado' },
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
    //obtencion de docentes
    this.getDocentes();
  },
  methods: {
    //metodo para obtener la lista de Docentes
    async getDocentes() {
      await axios.get(BASE_URL + '/docentes/docentes/')
        .then(
          response => (
            this.docentes = response.data
          )
        );

    },
    //verificar que se haya seleccionado un docente para su edicion u eliminacion
    verificarSeleccion() {
      let datos = this.docentes;
      let identificador = '';
      let nombres = '';

      this.table.dt.rows({ selected: true }).every(function () {

        const row = this.data();

        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombres} ${datos[idx].apellidop} ${datos[idx].apellidom}`;
        let clave = datos[idx].id;

        identificador = clave;
      });
      return { identificador, nombres };
    },
    //metodo para eliminar un Docente
    async editarSeleccionado() {

      const { identificador } = this.verificarSeleccion();
      console.log(identificador);
      if (identificador) {
        this.$router.push('/docente/edit/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Un Docente!';
        show_alerta(error, 'info')
      }
    },
    //metodo para editar un Docente
    eliminarSeleccionado() {
      const { identificador, nombres } = this.verificarSeleccion();
      if (identificador) {
        const ruta = 'docentes/docentes/' + identificador + '/';
        confirmar1(identificador, nombres, ruta, this.principal);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    eliminar(id, nombre) {
      //linea adicional recientemente añadida
      const principal = '/docentes';
      const ruta = 'docentes/docentes/' + id + '/';
      confirmar1(id, nombre, ruta, principal);
    },
  }
}
</script>
<style>
/* estilos datatables */
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
