<template>
  <div v-if="asignaturas" class="container-fluid" id="contenido-global">
    <div class="row">
      <div class="mb-3 fw-bold ">

        <div class="mb-3 fs-5 text-center">
          MALLA CURRICULAR : {{ ` ${asignaturas[0].nombre_carrera}` }}
        </div>

        <button class="btn btn-warning offset-1" @click="exportPDF">
          GENERAR PDF : <i class="fa-solid fa-file-pdf"></i>
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="table-responsive text-center">
          <table id="malla_curricular" class="table table-striped table-bordered table-hover col-12">
            <thead v-if="asignaturas" class="pb-4 table-light align-middle">
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
              <tr v-for="asignatura, i  in asignaturas" :key="asignatura">
                <td>{{ i + 1 }}</td>
                <td>{{ asignatura.codigo_carrera }}</td>
                <td>{{ asignatura.nombre_carrera }}</td>
                <td>{{ asignatura.codigo_asignatura }}</td>
                <td>{{ asignatura.nombre_asignatura }}</td>
                <td>{{ asignatura.descripcion }}</td>
                <td>{{ asignatura.estado }}</td>

              </tr>
            </tbody>
          </table>
        </div>
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


//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
//importacion de las variables globales para la generacion de pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  name: 'MostrarMallaCarreraView',
  data() {
    return {
      principal: '',
      id: 0, codigo_carrera: '', nombre_carrera: '', codigo_asignatura: '', nombre_asignatura: '', descripcion: '', estado: '',
      message: '', asignaturas: null, name_career: '',
      url: BASE_URL + '/parametros/mallaAcademica'
    }
  },
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

      //definicion cabeceras
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
    getMallaAcademica() {
      axios.get(this.url)
        .then(
          response => (
            this.asignaturas = response.data
          )
        );
      return this.asignaturas;
    },
  }
}
</script>
<style>
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
