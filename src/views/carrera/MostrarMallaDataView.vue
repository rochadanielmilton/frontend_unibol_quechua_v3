<template>
  <div v-if="asignaturas" class="container-fluid" id="contenido-global">
    <div class="row">
      <div class="mb-3 fw-bold ">

        <div class="mb-3 fs-5 text-center">
          MALLA CURRICULAR : {{ ` ${asignaturas[0].nombre_carrera}` }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-warning float-start" @click="exportPDF">
            GENERAR PDF : <i class="fa-solid fa-file-pdf"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive text-center">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="malla_curricular" :data="asignaturas" :columns="columns" v-if="asignaturas"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }],
            pageLength: 100,
            columnDefs: [{
              width: '40%', target: [4],
              width: '10%', target: [5],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 }
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }">
          <thead class="pb-4 table-light align-middle">
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
                CODIGO ASIGNATURA
              </th>
              <th>
                NOMBRE ASIGNATURA
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
import { show_alerta, confirmar1 } from '../../funciones';
import { useRoute } from "vue-router";

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

//definicion de variables globales para el uso en el reporte pdf
let BASE_URL = import.meta.env.VITE_BASE_URL;
//importacion de las variables globales para la generacion de pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  name: 'MostrarMallaCarreraView',
  components: { DataTable },
  data() {
    return {
      principal: '',
      id: 0, codigo_carrera: '', nombre_carrera: '', codigo_asignatura: '', nombre_asignatura: '', descripcion: '', estado: '',
      message: '', asignaturas: null, name_career: '',
      url: BASE_URL + '/parametros/mallaAcademica',
      //columnas de datos del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'codigo_carrera' },
        { data: 'nombre_carrera' },
        { data: 'codigo_asignatura' },
        { data: 'nombre_asignatura' },
        { data: 'descripcion' },
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
    const route = useRoute();
    //obtencion del codigo de Carrera
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';
    //obtenemos la Malla Académica de acuerdo a la Carrera Seleccionada
    this.getMallaAcademica();
    this.name_career = this.nombre_carrera;
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {
    //metodo para la obtencion del reporte Malla Académica
    async exportPDF() {

      const doc = new jsPDF({ unit: 'px' });
      doc.setFontSize(12);

      doc.setTextColor(100);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10


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
                       Tukuy sunquwan yahcyaninchikta, ruwayninchikta, yuyayninchikta kallpachaspa sumaq kawsayman kutina                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 5, finalY, null, null, "center");

      finalY += 20;

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                       MALLA CURRICULAR  : ${this.id}  
                       ${this.asignaturas[0].nombre_carrera}  

                       `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 15;
      //SETEAMOS EL TAMAÑO DE LETRA PARA COLOCAR LOS DATOS
      doc.setFontSize(10);

      autoTable(doc, {
        startY: finalY + 20,
        html: '#malla_curricular',
        //theme: 'plain',
      })

      finalY = doc.lastAutoTable.finalY

      await doc.save('example.pdf');
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
    eliminar(id, nombre) {
      const ruta = 'estudiantes/estudiantes/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
    },
    async getMallaAcademica() {
      await axios.get(this.url)
        .then(
          response => (
            this.asignaturas = response.data
          )
        );

    },

  }
}
</script>
<style>
/* estilos para los datatables */
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
