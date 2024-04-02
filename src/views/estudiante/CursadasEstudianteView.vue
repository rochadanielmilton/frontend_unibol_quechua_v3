<template>
  <div v-if="materias" class="container" id="contenido-global">
    <div class="row">
      <div class="mb-3 fw-bold  normal-letter">
        <div class="mb-3 fs-5 text-center">
          HISTORIAL ACADÉMICO
        </div>

        <div class="  fs-6 normal-letter">
          APELLIDOS Y NOMBRES: {{ `${apellidoP} ${apellidoM} ${nombres}` }}
        </div>

        <div class="  fs-6">
          CÉDULA DE IDENTIDAD: {{ `${ci_estudiante}` }}
        </div>

        <div class="  fs-6">
          NRO. DE REGISTRO: {{ `${numero_registro}` }}
        </div>

        <div class="  fs-6">
          CARRERA: {{ `${nombre_carrera}` }}
        </div>

        <div class=" mb-3 fs-6">
          FECHA DE EMISIÓN : {{ `${fecha_emision}` }}
        </div>
        <div class="d-flex justify-content-between ">

          <div>
            <button class="btn btn-warning ma-3" @click="exportPDF">
              <strong> GENERAR PDF :</strong> <i class="fa-solid fa-file-pdf"></i>
            </button>
          </div>
        </div>

      </div>
    </div>


    <div class="row">
      <div class="table-responsive ">
        <!-- Opciones para la deficion de un Datatable -->
        <DataTable ref="table" id="materias_cursadas" :data="materias" :columns="columns"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrti',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }],
            pageLength: 100,
            columnDefs: [{
              width: '40%', target: [6],
              width: '10%', target: [7],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 3 },
            { responsivePriority: 3, targets: 7 },
            { responsivePriority: 4, targets: 4 },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              emptyTable: 'El Estudiante no cuenta con un Historial Académico',
              paginate: {
                first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo'

              }
            },
          }" :key="columns.length">
          <thead v-if="materias" class="pb-4 table-light">
            <tr>
              <th>
                N°
              </th>
              <th>
                GESTIÓN
              </th>
              <th>
                SIGLA CÓDIGO
              </th>

              <th>
                ASIGNATURA
              </th>
              <th>
                HRS. ACAD.
              </th>

              <th>
                PREREQUISITOS
              </th>
              <th>
                CALIFICACIÓN NUMERAL
              </th>
              <th>
                ESTADO
              </th>
              <th>
                HOMOL.
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
          </tbody>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { show_alerta, confirmar1 } from '../../funciones';
import { useRoute } from "vue-router";

//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//librerias para el uso de Datatables
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);


import { ref } from 'vue';

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
//importacion de las variables globales para la generacion de pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  components: { DataTable },
  name: 'CursadasEstudianteView',
  data() {
    return {
      estudiantes: null, carreras: [], principal: '',
      ci_estudiante: '', nombres: '', apellidoP: '', apellidoM: '', numero_registro: '', nombre_carrera: '', fecha_emision: '', grado: '',
      cantidad_aprobadas: '',
      cantidad_todas: '',
      promedio_todas: '',
      promedio_aprobadas: '',
      horas_academicas: '',
      materias: null, message: '',

      url: BASE_URL + '/estudiantes/ObtenerHitorialAcademico2',
      //columnas de datos segun los parametros del consumo de servicio API-REST
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: null, render: function (data) { return `${data[0]}` } },
        { data: null, render: function (data) { return `${data[1]}` } },
        { data: null, render: function (data) { return `${data[2]}` } },
        { data: null, render: function (data) { return `${data[3]}` } },
        { data: null, render: function (data) { return `${data[4]}` } },
        { data: null, render: function (data) { return `${data[5]}` } },
        { data: null, render: function (data) { return `${data[6]}` } },
        { data: null, render: function (data) { return `${data[7]}` } },
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
    const route = useRoute();
    //obtener el ci del estudiante
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';
    //obtener las materias cursadas de un estudiante dado su ci(Historial Academico)
    this.getMateriasCursadas();
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {

    //metodo para generar el reporte pdf de Historial Académica
    async exportPDF() {

      //inicializacion de parametros para la generacion de reporte pdf
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });
      doc.setFontSize(12);

      let tabla_promedios = [];

      //definicion de la tabla de promedios y desempeño Academico del Estudiante
      tabla_promedios.push(['TOTAL HORAS ACADÉMICAS', this.horas_academicas])
      tabla_promedios.push(['TOTAL DE ASIGNATURAS APROBADAS', this.cantidad_aprobadas])
      //tabla_promedios.push(['TOTAL DE ASIGNATURAS CURSADAS', this.cantidad_todas])
      tabla_promedios.push(['PROMEDIO DE CALIFICACIÓN GNRAL.', this.promedio_todas])
      tabla_promedios.push(['PROMEDIO DE CALIFICACIÓN APROBADAS', this.promedio_aprobadas])

      doc.setTextColor(10);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10

      //inicio de la cabecera para impresion en hojas membretadas
      finalY += 65;

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                      HISTORIAL ACADÉMICO 
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(9).setFont(undefined, 'bold');
      doc.text(`
                      SEGÚN AJUSTE DE RM 0155/2023
                      `, (doc.internal.pageSize.getWidth() / 2) - 15, finalY, null, null, "center");
      finalY += 10;


      doc.setTextColor(10);
      doc.setFontSize(6).setFont(undefined, 'bold');
      doc.text(`
      SERIE "A"-3 
      `, (doc.internal.pageSize.getWidth() / 2) + 160, finalY, null, null, "center");

      finalY += 10;


      doc.setTextColor(10);
      doc.setFontSize(8);
      doc.text(`
                       APELLIDOS Y NOMBRES:                                  
                       CÉDULA DE IDENTIDAD: 
                       NRO DE REGISTRO: 
                       CARRERA: 
                       FECHA DE EMISIÓN: 
                       NIVEL DE FORMACIÓN: 
                       `, 10, finalY);

      doc.setTextColor(100);
      doc.text(`
                       ${this.apellidoP} ${this.apellidoM} ${this.nombres}                         
                       ${this.ci_estudiante}                       
                       ${this.numero_registro}                                
                       ${this.nombre_carrera}
                       ${this.fecha_emision}
                       ${this.grado}
                       `, (doc.internal.pageSize.getWidth() / 2) - 130, finalY);

      finalY += 35;

      //inicio de Tabla de Datos, materias-cursadas(Historial Academico)
      autoTable(doc, {
        startY: finalY + 20,
        html: '#materias_cursadas',
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, halign: 'center' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        margin: { left: 50, top: 105 },
        padding: 3
      })

      finalY = doc.lastAutoTable.finalY

      let wantedTableWidth = 100;
      let pageWidth = doc.internal.pageSize.width;
      let margin = (pageWidth - wantedTableWidth) / 2;

      //inicio de Tabla Promedios
      autoTable(doc, {
        startY: finalY + 10,
        showHead: 'never',
        body: tabla_promedios,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 5, cellWidth: 'wrap', halign: 'center' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          1: { columnWidth: 'auto' }
        },
        tableWidth: doc.internal.pageSize.getWidth() / 3,
        margin: { left: margin - 20, right: margin, top: 105 },
        padding: 2
      });
      finalY = doc.lastAutoTable.finalY
      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(6).setFont(undefined, 'bold');
      doc.text(`                
        APR.: APROBADO
        REP.:REPROBADO
        AB.:ABANDONO
        CONV.:CONVALIDADO
        *Documento solo válido para trámite interno.
          `, 40, finalY);

      //forma alternativa para la generacion de pdf
      //await doc.save(`${this.apellidoP} ${this.apellidoM} ${this.nombres}`);      

      await window.open(doc.output('bloburl'), '_blank');

    }
    ,
    sortGestion(data) {
      data = data.sort((a, b) => {
        if (a.anio_cursado < b.anio_cursado) {
          return -1;
        }
      });
      return data;
    },
    //obtener Asignaturas Cursadas dado el ci de un estudiante
    getMateriasCursadas() {
      axios.get(this.url)
        .then(
          response => {
            this.message = response.data.message,
              this.ci_estudiante = response.data['estudiante']['ci_estudiante'],
              this.nombres = response.data['estudiante']['nombres'],
              this.apellidoP = response.data['estudiante']['apellidoP'],
              this.apellidoM = response.data['estudiante']['apellidoM'],
              this.numero_registro = response.data['estudiante']['numero_registro'],
              this.nombre_carrera = response.data['estudiante']['nombre_carrera'],

              this.fecha_emision = response.data['fecha_emision'],
              this.grado = response.data['grado'],

              this.cantidad_aprobadas = response.data['otros_datos']['cantidad_aprobadas'],
              this.cantidad_todas = response.data['otros_datos']['cantidad_todas'],
              this.promedio_todas = response.data['otros_datos']['promedio_todas'],
              this.promedio_aprobadas = response.data['otros_datos']['promedio_aprobadas'],
              this.horas_academicas = response.data['total_horas_vencidas'],

              this.materias = this.sortGestion(response.data['datos'])

          }
        ).catch(error => {
          show_alerta(this.message, 'error')
          this.$router.push('/estudiantes')
        });

    }, eliminar(id, nombre) {
      const ruta = 'estudiantes/estudiantes/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
      this.$router.push('/estudiantes')
    }
  }
}
</script>
<style>
/* estilos para el uso de Datatables */
@import 'datatables.net-bs5';
@import 'datatables.net-responsive-dt';

body {
  font-size: .875rem;
  line-height: 1.25rem;
}

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
  top: 33%;
  left: 5px;
  height: 1em;
  width: 1em;
  margin-top: -5px;
  display: block;
  position: absolute;
  color: white;
  border: .15em solid white;
  border-radius: 1em;
  box-shadow: 0 0 0.2em #444;
  box-sizing: content-box;
  text-align: center;
  text-indent: 0 !important;
  font-family: "Courier New", Courier, monospace;
  line-height: 1em;
  content: "+";
  background-color: #31b131;
  background-color: #74a2ff;
}
</style>