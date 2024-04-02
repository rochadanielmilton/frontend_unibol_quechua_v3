<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            REPORTE DE ESTUDIANTES INSCRITOS POR GÉNERO
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
            select: true, responsive: true, autoWidth: true, dom: '<i<t>p>',
            pageLength: 5,

            columnDefs: [{
              width: '20%', target: [1],
              width: '20%', target: [2],
            },
            { responsivePriority: 0, targets: 0 }
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
              <th>
                CARRERAS
              </th>
              <th>
                HOMBRE
              </th>
              <th>
                MUJER
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
  name: 'ReportesGeneroView',
  components: { DataTable },
  data() {
    return {
      carreras: null, url: BASE_URL + '/parametros/carreras/', principal: '', ruta: '../loading.gif',
      carrera: '', numero_estudiantes: '', año: '',
      carrera_selected: '', anio_selected: '',
      estudiantes: null, gestiones: [], gestionActivated: false, estudiantes_tabla: '',
      selectedStatus: '',
      selectedStatus2: '',
      //columnas de datos del Datatable
      columns: [
        { data: null, render: function (data) { return `${data[0]}` } },
        { data: null, render: function (data) { return `${data[1]}` } },
        { data: null, render: function (data) { return `${data[2]}` } }
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
    this.getEstudiantesPorGenero();

    this.principal = '/estudiantes';
  },
  //metodos de la vista
  methods: {
    async getEstudiantesPorGenero() {

      await axios.get(BASE_URL + '/reportes/EstudiantesInscritosGenero/')
        .then(
          response => (
            this.estudiantes = response.data
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
    //metodo para generar el pdf del reporte de Estudiantes Inscritos por Genero
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
                      REPORTE DE ESTUDIANTES INSCRITOS POR GÉNERO
                      GESTIÓN 2024
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      //Cabeceras para el reporte de Estudiantes Inscritos por Genero
      const headers = [['CARRERAS', 'HOMBRE', 'MUJER']];

      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: this.estudiantes,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 8, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          1: { columnWidth: 'auto' }
        }
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
