<template>
  <div class="container" id="contenido-global">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            ESTUDIANTES DEL CURSO PREPARATORIO
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block ">
          <button class="btn btn-success rounded   me-1" @click="confirmarRegistro()">
            REGISTRAR COMO ESTUDIANTE REGULAR
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <!-- Configuracion para el Uso de Datatable Estudiante del Curso Preparatorio -->
        <DataTable ref="table" id="datatable" :data="estudiantesP" :columns="columns" v-if="estudiantesP"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 10,

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
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="columns.length">
          <thead class="pb-4 table-light">
            <tr>
              <th>
                #
              </th>
              <th>
                CEDULA DE IDENTIDAD
              </th>
              <th>
                NOMBRES
              </th>
              <th>
                APELLIDO PATERNO
              </th>
              <th>
                APELLIDO MATERNO
              </th>
              <th>
                ESTADO
              </th>
              <th>
                CARRERA
              </th>
              <th>
                AÑO DE POSTULACIÓN
              </th>
              <th>
                INSCRITO
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
import { show_alerta, confirmar1, confirmarRegistroP } from '../../funciones';

//importacion de las librerias para el uso de Datatables
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);



//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
  components: { DataTable },
  name: 'EstudianteCursoPreparatorioView',
  data() {
    return {
      estudiantesP: null, principal: '',
      ci_estudiante: '', nombres: '', apellidoP: '', apellidoM: '', nota_final: '', estado_inscrito: '',
      message: '',
      url: BASE_URL + '/administracion/obtenerPostulates/',
      ruta: '../loading.gif',
      //lista de columnas  del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'ci_postulante' },
        { data: 'nombres_p' },
        { data: 'apellido_paterno_p' },
        { data: 'apellido_materno_p' },
        { data: 'estado_ingreso' },
        { data: 'carrera' },
        { data: 'anio_postulacion' },
        { data: 'registrado' }
      ]

    }
  },
  setup() {
    const table = ref(null)
    // ...
    return {
      table
    }
  },
  mounted() {
    //obtener la lista de Estudiantes del Curso Preparatorio
    this.getPostulantes();
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {
    //metodo para verificar que se haya seleccionado un Estudiante
    verificarSeleccion() {
      let datos = this.estudiantesP;

      let identificador = '';
      let nombres = '';
      let registrado = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();

        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombres_p} ${datos[idx].apellido_paterno_p} ${datos[idx].apellido_materno_p}`;
        registrado = `${datos[idx].registrado}`;
        let clave = datos[idx].ci_postulante;

        identificador = clave;
      });
      return { identificador, nombres, registrado };
    },
    //metodo para confirmar el registro de un Estudiante del Curso Preparatorio
    async confirmarRegistro() {
      const { identificador, nombres, registrado } = this.verificarSeleccion();

      if (identificador) {
        event.preventDefault();
        if (registrado === 'no') {
          try {
            //metodo para registrar al Estudiante como Estudiante Regular
            await confirmarRegistroP(identificador, nombres);

          } catch (error) {
            console.log(error);
          }
        } else {
          show_alerta('El Estudiante ya se encuentra Inscrito!', 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    sortGestion(data) {
      data = data.sort((a, b) => {
        if (a.anio_cursado < b.anio_cursado) {
          return -1;
        }
      });
      return data;
    },
    eliminar(id, nombre) {
      const ruta = 'estudiantes/estudiantes/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
      this.$router.push('/estudiantes')
    },
    //obtener la lista de Estudiantes del Curso Preparatorio
    getPostulantes() {
      axios.get(this.url)
        .then(
          response => (
            this.estudiantesP = response.data
          )
        );
    },

  }
}
</script>
<style>
/* importacion de los estilos para el Datatable */
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

body {
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>