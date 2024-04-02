<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            REPORTE DE ESTUDIANTES INSCRITOS GENERAL
          </div>

        </div>
      </div>
    </div>

    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">

          <button class="btn btn-warning ma-3" @click="exportPDF">
            <strong> GENERAR PDF :</strong> <i class="fa-solid fa-file-pdf"></i>
          </button>

        </div>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="estudiantes_generales" :data="estudiantes_generales" :columns="columns"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            pageLength: 10,
            columnDefs: [{
              width: '10%', target: [3],
              width: '10%', target: [1],
              width: '40%', target: [0],
            },
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 6 }
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
              <th style="text-align: center;">
                CARRERA
              </th>
              <th style="text-align: center;">
                PRIMER AÑO
              </th>
              <th style="text-align: center;">
                SEGUNDO AÑO
              </th>
              <th style="text-align: center;">
                TERCER AÑO
              </th>
              <th style="text-align: center;">
                CUARTO AÑO
              </th>
              <th style="text-align: center;">
                QUINTO AÑO
              </th>
              <th style="text-align: center;">
                TOTAL
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
import { ref } from 'vue';
import axios from "axios";

import { confirmar1 } from '../../funciones';

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
  name: 'ReportesGeneralesView',
  components: { DataTable },
  data() {
    return {
      fecha_emision: '', estudiantes_generales: null, total_inscritos: '',
      carreras: null, url: BASE_URL + '/parametros/carreras/', principal: '', ruta: '../loading.gif',
      numero_estudiantes_totales: '', estudiantes: null, respuesta: {},
      numero_estudiantes_acuc: '', numero_estudiantes_tial: '', numero_estudiantes_ecop: '', numero_estudiantes_agrf: '',
      porcentaje_estudiantes_acuc: '', porcentaje_estudiantes_tial: '', porcentaje_estudiantes_ecop: '', porcentaje_estudiantes_agrf: '',
      estudiantes_carrera: '', estudiantes_genero: [], estudiantes_departamento: [], estudiantes_organizacion: [],
      total_cochabamba: 0,
      total_organizacion1: 0, total_organizacion2: 0, total_organizacion3: 0, total_organizacion4: 0,
      porcentaje_organizacion1: '', porcentaje_organizacion2: '', porcentaje_organizacion3: '', porcentaje_organizacion4: '',
      varones_generales: 0, mujeres_generales: 0, total_genero: 0,

      //columnas de datos del Datatable
      columns: [
        { data: null, render: function (data) { return `${data[0]}` } },
        { data: null, render: function (data) { return `${data[1]}` } },
        { data: null, render: function (data) { return `${data[2]}` } },
        { data: null, render: function (data) { return `${data[3]}` } },
        { data: null, render: function (data) { return `${data[4]}` } },
        { data: null, render: function (data) { return `${data[5]}` } },
        { data: null, render: function (data) { return `${data[6]}` } }
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

    this.getEstudiantes();

    this.getEstudiantesGenerales();
    //this.cargarPorCarrera();
    //console.log(this.getEstudiantesPorCarrera('ACUC'));

    this.principal = '/carreras';
  },
  methods: {
    async getEstudiantesGenerales() {

      await axios.get(BASE_URL + '/reportes/EstudiantesInscritosPorCarreraAnio/')
        .then(
          response => (
            this.estudiantes_generales = response.data['datos'],
            this.estudiantes_generales[4][6] = response.data['TOTAL']
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    async getEstudiantes() {

      await axios.get(BASE_URL + '/reportes/EstudiantesCarreraAnio/0/0/')
        .then(
          response => (
            this.estudiantes = response.data['estudiantes'],
            this.numero_estudiantes_totales = response.data['numero_estudiantes']

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
    //metodo para generar el pdf del reporte de Estudiantes Inscritos por CarreraxGestion de forma general
    async exportPDF() {
      this.table.dt.page.len(1000).draw();
      //inicializacion de parametros para el reporte pdf      
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setTextColor(10);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10



      //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
      await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
      await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);


      // await doc.addImage("../../ministerio.jpg", "JPG", 15, finalY + 5, 60, 60);
      // await doc.addImage("../../logotipo-unibol-quechua.png", "PNG", doc.internal.pageSize.width - 65, finalY + 5, 50, 50);

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
                      REPORTE DE ESTUDIANTES INSCRITOS POR CARRERA/POR AÑO
                      GESTIÓN 2024
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      //cabeceras del reporte de Estudiantes Inscritos por CarreraxGestion de forma general
      const headers = [['CARRERA', 'PRIMER AÑO', 'SEGUNDO AÑO', 'TERCER AÑO', 'CUARTO AÑO', 'QUINTO AÑO', 'TOTAL']];

      //tabla de reporte
      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: this.estudiantes_generales,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 7, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          0: { cellWidth: 100, halign: 'center' },
          1: { columnWidth: 'auto' }
        },
      });
      finalY = doc.lastAutoTable.finalY

      //forma alternativa  para la generacion del pdf
      //await doc.save(`${this.apellidoP} ${this.apellidoM} ${this.nombres}`);      

      await window.open(doc.output('bloburl'), '_blank');

    }
  },
}
</script>
<style >
/* importacion de estilos para Uso de Datatables */
@import 'datatables.net-bs5';
@import 'datatables.net-responsive-dt';

.cursor-pointer {
  cursor: pointer;
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
  content: "+";
  background-color: #31b131;
  background-color: #74a2ff;
}
</style>
