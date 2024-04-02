<template>
  <div class="container ">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            LISTA DE ASIGNATURAS
          </div>

        </div>
      </div>
    </div>

    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success  float-end ">
            <router-link to="/asignatura/create" class="nav-link active"><i class="fa-solid fa-user-plus"></i>NUEVA
              ASIGNATURA</router-link>
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
        <!--configuracion Datatable -->
        <DataTable ref="table" id="datatable" :data="materias" :columns="columns" v-if="materias"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 5,
            columnDefs: [{
              width: '10%', target: [2],
              width: '10%', target: [3],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 3, targets: 10 },
            { responsivePriority: 4, targets: 4 },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="keycon">
          <thead class="table-light">
            <tr>
              <th>
                #
              </th>
              <th>
                CODIGO
              </th>
              <th>
                NOMBRE
              </th>
              <th>
                DESCRIPCION
              </th>
              <th>
                DOCENTE
              </th>
              <th>
                HORAS PRACTICAS
              </th>
              <th>
                HORAS TEORICAS
              </th>
              <th>
                TOTAL HORAS
              </th>
              <th>
                PRE-REQUISITO1
              </th>
              <th>
                PRE-REQUISITO2
              </th>
              <th>
                AÑO ASIGNADO
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
          </tbody>
        </DataTable>
        <!-- Cargando el Datatable -->
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

import axios from "axios";
//importacion de servicios adicionales
import { confirmar1, show_alerta } from '../../funciones';
import { ref } from 'vue';

//importacion de las librerias para Datatable
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'MateriaDataView',
  components: { DataTable },
  data() {
    return {
      materias: null, docente: '', docs: [], principal: '', ruta: '../loading.gif',
      materiasUpdate: [],
      //columnas para el Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'codigo_asignatura' },
        { data: 'nombre_asignatura' },
        { data: 'descripcion' },

        { data: 'nombre_docente' },

        { data: 'horas_practicas' },
        { data: 'horas_teoricas' },
        { data: 'total_horas' },
        { data: 'pre_requisito1' },
        { data: 'pre_requisito2' },
        { data: 'anio_asignado' },
      ]
    }
  },
  //inicializacion de metodos y argumentos antes de renderizacion de la vista.
  setup() {
    //referencia reactiva del Datatable
    const table = ref(null)
    // ...
    return {
      table
    }
  },
  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    //obtener materias 
    this.getMaterias();
    this.principal = '/asignaturas';
  },
  methods: {
    //verificar que se haya seleccionado una Materia para su edicion u eliminacion
    verificarSeleccion() {
      let datos = this.materias;
      let identificador = '';
      let nombres = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();
        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombre_asignatura}`;
        let clave = datos[idx].codigo_asignatura;

        identificador = clave;
      });
      return { identificador, nombres };
    },
    //metodo para editar una Asignatura previa seleccion del mismo
    async editarSeleccionado() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/asignatura/edit/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Una Asignatura!';
        show_alerta(error, 'info')
      }
    },

    //metodo para eliminar una Asignatura previa seleccion del mismo
    eliminarSeleccionado() {
      const { identificador, nombres } = this.verificarSeleccion();

      if (identificador) {
        const ruta = 'parametros/asignaturas/' + identificador + '/';
        //servicio para eliminar
        confirmar1(identificador, nombres, ruta, this.principal);
      } else {
        const error = 'Debes Seleccionar Una Asignatura!';
        show_alerta(error, 'info')
      }
    },
    //servicio para obtener Asignaturas
    async getMaterias() {
      await axios.get(BASE_URL + '/parametros/asignaturas/')
        .then(
          response => {
            this.materias = response.data
          }
        );
    },
    getDocentess(id_doc, codigo_asignatura) {
      if (id_doc === null) {
        return;
      } else
        if (id_doc !== null || id_doc !== 'undefined' || id_doc !== '') {
          axios.get(BASE_URL + '/docentes/docentes/' + id_doc + '/').then(
            response => (
              this.docs[codigo_asignatura] = `${response.data['nombres']} ${response.data['apellidop']} ${response.data['apellidom']}`
            )
          ).catch(error => {
            //console.log(error)
            show_alerta(error, 'error')
          });
          return this.docs[codigo_asignatura];
        }
    }
    , eliminar(id, nombre) {
      const ruta = 'parametros/asignaturas/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
    }
  }
}
</script>
<style>
/* estilos Datatable */
@import 'datatables.net-bs5';
@import 'datatables.net-responsive-dt';

/* configuracion mobile Datatable */
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