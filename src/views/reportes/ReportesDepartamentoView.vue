<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            REPORTE DE ESTUDIANTES INSCRITOS POR DEPARTAMENTO
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
        <DataTable ref="table" id="reportes_generales" :data="estudiantes" :columns="columns" v-if="estudiantes"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: '<<t>>',
            pageLength: 5,
            columnDefs: [{
              width: '40%', target: [2],
              width: '10%', target: [3],
            },
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 10 },
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
              <th style="font-size: 12px;">
                CARRERA
              </th>
              <th style="font-size: 10px;">
                COCHABAMBA
              </th>
              <th style="font-size: 10px;">
                LA PAZ
              </th>
              <th style="font-size: 10px;">
                SANTA CRUZ
              </th>
              <th style="font-size: 10px;">
                ORURO
              </th>
              <th style="font-size: 10px;">
                POTOSI
              </th>
              <th style="font-size: 10px;">
                CHUQUISACA
              </th>
              <th style="font-size: 10px;">
                TARIJA
              </th>
              <th style="font-size: 10px;">
                BENI
              </th>
              <th style="font-size: 10px;">
                PANDO
              </th>
              <th style="font-size: 10px;">
                TOTAL
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
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <span class="btn btn-success ma-3 float-end">
            <strong> TOTAL :{{ total_inscritos }}</strong>
          </span>
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
  name: 'ReportesDepartamentoView',
  components: { DataTable },
  data() {
    return {
      carreras: null, url: BASE_URL + '/parametros/carreras/', principal: '', ruta: '../loading.gif',
      carrera: '', numero_estudiantes: '', año: '',
      carrera_selected: '', anio_selected: '', total_inscritos: '',
      estudiantes: null, gestiones: [], gestionActivated: false,
      selectedStatus: '',
      selectedStatus2: '',
      //columnas de datos del Datatable
      columns: [
        { data: null, render: function (data) { return `${data[0]}` } },
        { data: null, render: function (data) { return `${data[1]}` } },
        { data: null, render: function (data) { return `${data[2]}` } },
        { data: null, render: function (data) { return `${data[3]}` } },
        { data: null, render: function (data) { return `${data[4]}` } },
        { data: null, render: function (data) { return `${data[5]}` } },
        { data: null, render: function (data) { return `${data[6]}` } },
        { data: null, render: function (data) { return `${data[7]}` } },
        { data: null, render: function (data) { return `${data[8]}` } },
        { data: null, render: function (data) { return `${data[9]}` } },
        { data: null, render: function (data) { return `${data[10]}` } }
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
    //obtener la lista de Estudiantes Inscritos por Departamento
    this.getEstudiantesPorDepartamentos();

    //this.generarGestion();
    this.principal = '/estudiantes';
  },
  methods: {
    async getEstudiantesPorDepartamentos() {
      await axios.get(BASE_URL + '/reportes/EstudiantesInscritosPorDepartamentos/')
        .then(
          response => (
            this.estudiantes = response.data['datos'],
            this.total_inscritos = response.data['TOTAL'],
            this.estudiantes[4][10] = response.data['TOTAL']
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
    //metodo para generar el pdf del reporte de Estudiantes Inscritos por Departamento
    async exportPDF() {
      this.table.dt.page.len(1000).draw();

      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setFontSize(12);

      let tabla_promedios = [];

      //asignaturas_tabla.push([index+1,datos[index].anio_asignado ,datos[index].codigo_asignatura,datos[index].nombre_asignatura])          
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

      //forma alternativa para generar el encabezado con las imagenes
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
                      REPORTE DE ESTUDIANTES INSCRITOS POR DEPARTAMENTO
                      GESTIÓN 2024
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      //Cabecera Con las Carreras y Departamentos correspondientes segun reporte
      const headers = [['CARRERA', 'COCHABAMBA', 'LA PAZ', 'SANTA CRUZ', 'ORURO', 'POTOSI', 'CHUQUISACA', 'TARIJA', 'BENI', 'PANDO', 'TOTAL']];


      //tabla de reporte de Inscripcion de Estudiantes Por Departamento
      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: this.estudiantes,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          0: { columnWidth: 'auto' }
        },
      });
      finalY = doc.lastAutoTable.finalY

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'bold');
      doc.text(`
      TOTAL INSCRITOS: ${this.total_inscritos}
      `, (doc.internal.pageSize.getWidth() / 2) + 155, finalY + 5, null, null, "center");

      finalY += 10;

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
