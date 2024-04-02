<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            REPORTE DE ESTUDIANTES INSCRITOS POR CARRERA/AÑO
          </div>

        </div>
      </div>
    </div>
    <div class="row habil">
      <div class="mb-3 seleccion">
        <div class="mb-3 d-grid gap-2 d-md-block">

          <div class="input-group me-1 ">
            <select class="form-select text-center me-1" @change="onChange($event)" id="nombre_carrera"
              :disabled="gestionActivated" v-model="selectedStatus">
              <option value="" selected>
                <!-- ---------Carrera--------- -->
                TODAS LAS CARRERAS
              </option>
              <option v-for="carrera in carreras" v-bind:value="carrera.codigo_carrera" :key="carrera.codigo_carrera">
                {{ `${carrera.nombre_carrera}` }}
              </option>
            </select>

            <select class="form-select text-center me-1" @change="onChanges($event)" id="gestiones"
              v-model="selectedStatus2">
              <option value="" selected>
                <!-- -------------Gestión------------- -->
                TODAS LAS GESTIONES
              </option>
              <option v-for="gestion in gestiones" v-bind:value="gestion.nombre_anio" :key="gestion.id">
                {{ `${gestion.nombre_anio}` }}
              </option>
            </select>

            <button class="btn btn-success me-1" @click="resetearFiltros()">
              <i class="fa-solid fa-spin fa-sync"></i> Resetear Filtros
            </button>

            <button class="btn btn-warning me-1 " @click="exportPDF">
              <strong> GENERAR PDF :</strong> <i class="fa-solid fa-file-pdf"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- vista en mobile -->
    <div class="row mt-3 justify-center no-habil">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header bg-secondary text-white text-center">
            SELECCIONAR CARRERA Y AÑO
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <select class="form-select text-center" @change="onChange($event)" id="nombre_carrera"
                :disabled="gestionActivated" v-model="selectedStatus">
                <option value="" selected>
                  TODAS LAS CARRERAS
                </option>
                <option v-for="carrera in carreras" v-bind:value="carrera.codigo_carrera" :key="carrera.codigo_carrera">
                  {{ `${carrera.nombre_carrera}` }}
                </option>
              </select>

            </div>

            <div class="input-group mb-3">

              <select class="form-select text-center" @change="onChanges($event)" id="gestiones"
                v-model="selectedStatus2">
                <option value="" selected>

                  TODAS LAS GESTIONES
                </option>
                <option v-for="gestion in gestiones" v-bind:value="gestion.nombre_anio" :key="gestion.id">
                  {{ `${gestion.nombre_anio}` }}
                </option>
              </select>

            </div>
            <div class="input -group mb-3">
              <div class="d-grid col-6-mx-auto">
                <button class="btn btn-success" @click="resetearFiltros()">
                  <i class="fa-solid fa-spin fa-sync"></i> Resetear Filtros
                </button>
              </div>
            </div>
            <div class="d-grid mb-3">
              <button class="btn btn-warning ma-3" @click="exportPDF">
                <strong> GENERAR PDF :</strong> <i class="fa-solid fa-file-pdf"></i>
              </button>
            </div>



          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="reportes_generales" :data="estudiantes" :columns="columns" v-if="estudiantes"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'l<fi<t>p>',
            pageLength: 10,

            columnDefs: [{
              width: '40%', target: [2],
              width: '40%', target: [3],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 3, targets: 3 },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="keycon">
          <thead class="pb-4 table-light">
            <tr>
              <th class="col">
                #
              </th>
              <th>
                C.I.
              </th>
              <th class="col-2">
                NOMBRE COMPLETO
              </th>
              <th>
                AÑO CURSADO
              </th>
              <th class="col-3">
                CARRERA
              </th>

            </tr>
          </thead>

          <tbody id="contenido">
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

//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//librerias para el Uso de Datatables
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
//importacion de las variables globales para la generacion de pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  name: 'ReporteCarreraView',
  components: { DataTable },
  data() {
    return {
      carreras: null, url: BASE_URL + '/parametros/carreras/', principal: '', ruta: '../loading.gif',
      carrera: '', numero_estudiantes: '', año: '', estudiantes: null,
      carrera_selected: '', anio_selected: '',
      gestiones: [], gestionActivated: false,
      selectedStatus: '',
      selectedStatus2: '',
      //columnas de datos del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'ci' },
        { data: null, render: function (data) { return `${data.apellidoP} ${data.apellidoM} ${data.nombres}` } },
        { data: 'anio_cursado' },
        { data: 'nombre_carrera' }
      ]

    };
  },
  //inicializacion de metodos y argumentos antes de renderizacion de la vista.
  setup() {
    const table = ref(null)
    const keycon = ref(0)
    const forceRender = () => {
      keycon.value += 1;
    }
    // ...
    return {
      table,
      forceRender
    }
  },
  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    //obtener la Lista de Estudiantes Inscritos en la Presente Gestion Académica
    this.getEstudiantes();

    //obtener la lista de Carreras Habilitadas
    this.getCarreras();
    //obtener las gestiones Académicas
    this.getGestiones();

    this.principal = '/estudiantes';
  },
  methods: {
    //metodo para resetear los filtros de seleccion de "Carreras y Gestiones"
    resetearFiltros() {
      this.selectedStatus = '';
      this.selectedStatus2 = '';
      this.gestionActivated = false;
      this.carrera_selected = '';
      this.anio_selected = '';

      this.getEstudiantes();
      this.forceRender()

    },
    //obtener la lista de Carreras Disponibles
    getCarreras() {
      axios.get(BASE_URL + '/parametros/carreras/')
        .then(
          response => (
            this.carreras = response.data
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    generarGestion() {
      let inicio = 2024;
      let anios = ['PRIMERO AÑO', 'SEGUNDO AÑO', 'TERCER AÑO'];
      let numero = 5;

      for (let index = 0; index < numero; index++) {
        this.gestiones.push(inicio - index)
      }
    },
    //metodo para cargar la lista de Estudiantes de Acuerdo a la Carrera Seleccionada
    async onChange(event) {
      this.carrera_selected = event.target.value;
      await axios.get(BASE_URL + '/reportes/EstudiantesCarreraAnio/' + this.carrera_selected + '/0/')
        .then(
          response => (
            this.estudiantes = response.data['estudiantes'],
            this.numero_estudiantes = response.data['numero_estudiantes'],
            this.carrera = response.data['carrera'],
            this.año = response.data['año'],

            this.forceRender()
          )
        );
    },
    //metodo para cargar la lista de Estudiantes de  Acuerdo  a la Gestion Seleccionada
    async onChanges(event) {
      this.gestionActivated = true;
      this.anio_selected = event.target.value;

      await axios.get(BASE_URL + '/reportes/EstudiantesCarreraAnio/' + this.carrera_selected + '/' + this.anio_selected + '/')
        .then(
          response => (
            this.estudiantes = response.data['estudiantes'],
            this.numero_estudiantes = response.data['numero_estudiantes'],
            this.carrera = response.data['carrera'],
            this.año = response.data['año'],

            this.forceRender()
          )
        );
    },
    async getGestiones() {
      await axios.get(BASE_URL + '/parametros/aniosCarreras/')
        .then(
          response => (
            this.gestiones = response.data
          )
        );
    },
    //obtener la Lista de Estudiantes Inscritos en la Presente Gestion Académica
    async getEstudiantes() {
      await axios.get(BASE_URL + '/reportes/EstudiantesCarreraAnio/0/0/')
        .then(
          response => (
            this.estudiantes = response.data['estudiantes'],
            this.numero_estudiantes = response.data['numero_estudiantes'],
            this.carrera = response.data['carrera'],
            this.año = response.data['año']
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    eliminar(id, nombre) {
      const ruta = 'parametros/carreras/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
    },
    //metodo para generar el pdf del reporte de Estudiantes Inscritos por CarreraxGestion en tiempo real
    async exportPDF() {
      this.table.dt.page.len(1000).draw();

      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setFontSize(12);


      const resultado = [];

      //llenado de la lista de Estudiantes para su posterior presentacion en formato de tablas
      for (var i = 0; i < this.estudiantes.length; i += 1) {
        resultado.push([i + 1, this.estudiantes[i].ci, `${this.estudiantes[i].apellidoP} ${this.estudiantes[i].apellidoM} ${this.estudiantes[i].nombres}`, this.estudiantes[i].anio_cursado, this.estudiantes[i].nombre_carrera
        ])
      }

      let tabla_promedios = [];

      //tabla de promedios para verificar el desempeño académico del Estudiante
      tabla_promedios.push(['TOTAL HORAS ACADÉMICAS', this.horas_academicas])
      tabla_promedios.push(['TOTAL DE ASIGNATURAS APROBADAS', this.cantidad_aprobadas])
      //tabla_promedios.push(['TOTAL DE ASIGNATURAS CURSADAS', this.cantidad_todas])
      tabla_promedios.push(['PROMEDIO DE CALIFICACIÓN GNRAL.', this.promedio_todas])
      tabla_promedios.push(['PREMEDIO DE CALIFICACIÓN APROBADAS', this.promedio_aprobadas])

      doc.setTextColor(10);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10

      //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
      await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
      await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.setTextColor(18, 73, 39);
      doc.text(`
                       UNIVERSIDAD INDÍGENA BOLIVIANA COMUNITARIA INTERCULTURAL PRODUCTIVA
                       UNIBOL QUECHUA "CASIMIRO HUANCA"
                       `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      doc.setTextColor(100);
      doc.setFontSize(8).setFont(undefined, 'normal');
      doc.text(`
                       Decreto Supremo N° 29664 de 2 de agosto de 2008 - Decreto Supremo N° 3079 del 8 de febrero 2017
                       R.M. 505/2013 - R.M. 1300/2018"
                       `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      doc.setTextColor(10);
      doc.setFontSize(8);
      doc.text(`
                       Tukuy sunquwan yachayninchikta, ruwayninchikta, yuyayninchikta kallpachaspa sumaq kawsayman kutina                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 5, finalY, null, null, "center");

      finalY += 15;

      finalY += 15;

      doc.setTextColor(10);
      doc.setFontSize(12).setFont(undefined, 'bold');
      doc.text(`
                      REPORTE DE ESTUDIANTES INSCRITOS
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      doc.setTextColor(10);
      doc.setFontSize(8);
      doc.text(`
                      NOMBRE CARRERA:
                      AÑO CORRESPONDIENTE:                                  
                      NÚMERO DE ESTUDIANTES:                                                                      
                       `, -10, finalY);

      doc.setTextColor(100);
      doc.text(`                       
                       ${this.carrera}
                       ${this.año}                                
                       ${this.numero_estudiantes}                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 150, finalY);

      finalY += 25;

      //Cabeceras de tabla de datos
      const headers = [['NRO', 'C.I.', 'NOMBRE COMPLETO', 'AÑO CURSADO', 'CARRERA']];

      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: resultado,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          1: { columnWidth: 'auto' }
        },

      });
      finalY = doc.lastAutoTable.finalY

      //forma alternativa  para la generacion del pdf
      //await doc.save(`${this.apellidoP} ${this.apellidoM} ${this.nombres}`);      

      await window.open(doc.output('bloburl'), '_blank');
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
