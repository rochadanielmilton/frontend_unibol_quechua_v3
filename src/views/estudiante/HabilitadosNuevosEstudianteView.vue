<template >
  <div class="container" id="contenido-global">
    <div class="row">
      <div class="mb-3 fw-bold">
        <div class="mb-3 fs-4 text-center">
          PLANILLA DE ESTUDIANTES NUEVOS HABILITADOS PARA LA INSCRIPCION:
        </div>
      </div>
    </div>

    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success float-end">
            <i class="fa-solid fa-table"></i> <router-link to="/curso-preparatorio"
              class="nav-link active">ESTUDIANTES-PREPARATORIO</router-link>
          </button> &nbsp;

          <button class="btn btn-success  me-1" @click="inscribirEstudiante">
            <i class="fa-solid fa-user-plus"></i>INSCRIBIR

          </button>
          <button class="btn btn-warning rounded   me-1" @click="inscripcionDirectaN()">
            <i class="fa-solid fa-user-plus"></i>INS.DIRECTA
          </button>
          <button class="btn btn-success  rounded   me-1" @click="reimprimirInscripcionNuevos()">
            REIMPR.-N
          </button>
          <button class="btn btn-danger me-1" @click="recepcionAnularInscripcion()">
            <i class="fa-solid fa-user-graduate"></i>ANULAR INSC.
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="datatable" :data="estudiantes" :columns="columns" v-if="estudiantes"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            pageLength: 5,

            columnDefs: [{
              width: '40%', target: [6],
              width: '10%', target: [7],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 3, targets: 3 },
            { responsivePriority: 4, targets: 4 },
            { responsivePriority: 5, targets: 8 },
            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }" :key="keycon">

          <thead class="pb-4 table-light" v-if="estudiantes">
            <tr>
              <th>N°</th>
              <th>C.I.</th>
              <th>NOMBRE COMPLETO</th>
              <th>CODIGO CARRERA</th>
              <th>NOMBRE CARRERA</th>
              <th>N° INSCRIPCIÓN</th>
              <th>N° BOLETA</th>
              <th>AÑO CURSADO</th>
              <th>INSCRITO</th>

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
import { show_alerta } from '../../funciones';
import { generarReporteInscripcionNuevos, generarReporteInscripcionRegulares } from '../../reportes';
import Swal from "sweetalert2";
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
export default {
  components: { DataTable },
  name: 'AprobadasEstudianteView',
  data() {
    return {
      estudiantes: null, carreras: [], principal: '',
      ci_estudiante: '', nombres: '', apellidoP: '', apellidoM: '', codigo_carrera: '', nombre_carrera: '', anio_cursado: '', inscrito_gestion: '', anio_ingreso: '', ci_especial: '',
      anio_actual: 0, sexto_anio: false,
      materias: null,
      url: BASE_URL + '/administracion/ObtenerEstudiantesNuevosInscripcion/',
      ruta: '../loading.gif',
      //columnas de datos del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'ci_estudiante' },
        { data: null, render: function (data) { return `${data.apellidoP} ${data.apellidoM} ${data.nombres}` } },
        { data: 'codigo_carrera' },
        { data: 'nombre_carrera' },
        { data: 'numero_registro' },
        { data: 'numero_boleta' },
        { data: 'anio_cursado' },
        { data: 'inscrito_gestion' },

      ]
    }
  },
  //inicializacion de metodos y argumentos antes de renderizacion de la vista.
  setup() {
    const table = ref(null)
    const keycon = ref(0)
    //actualizacion del Datatable
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
    //devuelve los estudiantes habilitados para inscribirse
    this.getEstudiantesHabilitados();
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  //metodos de la vista
  methods: {
    inscribirEstudiante() {
      const { identificador, inscrito_gestion } = this.verificarSeleccion();
      if (identificador) {
        if (inscrito_gestion === 'no') {
          this.$router.push('/estudiante/ofertas/' + identificador);
        } else {
          show_alerta('El Estudiante ya se encuentra Inscrito!', 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para la inscripcion directa de Estudiantes Nuevos(asignacion de Asignaturas de forma automática)
    inscripcionDirectaN() {
      const { identificador, inscrito_gestion, nombres, anio_ingreso } = this.verificarSeleccion();
      if (identificador) {
        if (inscrito_gestion === 'no' && anio_ingreso === this.anio_actual) {
          this.inscripcionDirecta(identificador, nombres)
        } else {
          show_alerta('El Estudiante ya se encuentra Inscrito!', 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para anular una inscripcion, previa seleccion del Estudiante
    recepcionAnularInscripcion() {
      const { identificador, inscrito_gestion, nombres } = this.verificarSeleccion();
      if (identificador) {
        if (inscrito_gestion === 'si') {
          this.consultaAnularInscripcion(identificador, nombres)
        } else {
          show_alerta('El Estudiante no se encuentra Inscrito!', 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para reimprimir boleta de Inscripcion de Un Estudiante Nuevo
    reimprimirInscripcionNuevos() {
      const { identificador, inscrito_gestion, nombres, anio_ingreso } = this.verificarSeleccion();
      if (identificador) {
        if (inscrito_gestion === 'si' && anio_ingreso === this.anio_actual) {
          //metodo para reimprimir boleta de Inscripcion dado un CI de Estudiante                  
          this.reimpresionNuevos(identificador)
        } else {
          show_alerta(`El Estudiante ${nombres} no se encuentra Inscrito!`, 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para verificar seleccion de un Estudiante
    verificarSeleccion() {
      let datos = this.estudiantes;
      let identificador = '';
      let nombres = '';
      let inscrito_gestion = '';
      let anio_ingreso = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();
        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombres} ${datos[idx].apellidoP} ${datos[idx].apellidoM}`;
        let clave = datos[idx].ci_estudiante;
        inscrito_gestion = datos[idx].inscrito_gestion;
        anio_ingreso = datos[idx].anio_ingreso;

        identificador = clave;
      });
      return { identificador, nombres, inscrito_gestion, anio_ingreso };
    },
    inscribirPrimerAnio(ci_estudiante, nombres) {
      this.inscripcionDirecta(ci_estudiante, nombres)
    },
    //mensaje de confirmacion para la inscripcion de un Nuevo Estudiante
    async inscripcionDirecta(ci_estudiante, nombres) {
      event.preventDefault();

      const url = BASE_URL + '/administracion/inscribirEstudiantePrimerAnio/' + ci_estudiante + '/';

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success me-3', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      });

      swalWithBootstrapButtons.fire({
        title: 'Esta seguro que desea inscribir al Estudiante: ' + nombres,
        text: 'Se inscribira al estudiante ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Si, Inscribir',
        cancelButtonText: '<i class="fa-solid fa-ban"></i>Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.registrarEstudianteNuevo(url);
        } else {
          show_alerta('Operacion cancelada', 'info');
        }
      })
    },
    //mensaje de confirmacion para anular la boleta de Inscripcion para Estudiantes Nuevos
    async consultaAnularInscripcion(id, nombres) {
      event.preventDefault();
      const url = BASE_URL + '/administracion/cancelarInscripcion/' + id + '/';

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success me-3', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      });

      swalWithBootstrapButtons.fire({
        title: 'Esta seguro que desea Anular la Inscripción para el Estudiante: ' + nombres,
        text: 'Se Anulará la Inscripción ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Si, Anular',
        cancelButtonText: '<i class="fa-solid fa-ban"></i>Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.anularInscripcion(url);
        } else {
          show_alerta('Operacion cancelada', 'info');
        }
      })

    },
    //metodo para anular de forma definitiva la Inscripcion de Un Estudiante Nuevo
    async anularInscripcion(url) {
      await axios.get(url)
        .then(
          response => {
            const status = response.status;
            const mensaje = 'Inscripción Anulada Satisfactoriamente!';
            if (status === 200) {
              show_alerta(mensaje, 'success');
              //metodo para actualizar la tabla de datos
              this.forceRender();
              this.getEstudiantesHabilitados();
            }
          }
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    //metodo para registrar un Nuevo Estudiante de forma Directa
    async registrarEstudianteNuevo(url) {
      await axios.get(url).then(resultado => {
        const status = resultado.status;

        const datos = resultado.data['asignaturas_inscritas'];
        const datos_estudiante = resultado.data['estudiante'];
        const fecha_emision = resultado.data['fecha_emision'];
        const numero_boleta = resultado.data['numero_boleta'];
        const numero_archivo = resultado.data['numero_archivo'];
        let asignaturas_tabla = [];
        let modalidad_de_ingreso = [];
        for (let index = 0; index < datos.length; index++) {
          asignaturas_tabla.push([index + 1, datos[index].codigo_asignatura, datos[index].nombre_asignatura, 'N'])
        }

        modalidad_de_ingreso.push([`${datos_estudiante['tipo_ingreso']} GESTION ${datos_estudiante['anio_ingreso']}`, 'APROBADO'])

        const mensaje = 'Estudiante inscrito Exitosamente!';
        if (status === 200) {
          show_alerta(mensaje, 'success');
          //metodos para actualizar la tabla una vez registrado el Estudiante
          this.forceRender();
          this.getEstudiantesHabilitados();

          //metodo para generar el reporte de boleta de Inscripcion para Estudiantes Nuevos
          generarReporteInscripcionNuevos(asignaturas_tabla, modalidad_de_ingreso, datos_estudiante, fecha_emision, numero_boleta, numero_archivo);
        }
      });
    },
    //consumo del servicio API-REST para la reimpresion de boleta de Inscripcion
    async reimpresionNuevos(id) {
      const url = BASE_URL + '/administracion/reimprimirInscripcion/' + id + '/';
      await axios.get(url).then(resultado => {
        const status = resultado.status;

        const datos = resultado.data['asignaturas_tomadas'];
        const datos_estudiante = resultado.data['estudiantes'];
        const fecha_emision = resultado.data['fecha_emision'];
        const numero_boleta = resultado.data['numero_boleta'];
        const numero_archivo = resultado.data['numero_archivo'];
        let asignaturas_tabla = [];
        let modalidad_de_ingreso = [];
        for (let index = 0; index < datos.length; index++) {
          asignaturas_tabla.push([index + 1, datos[index].codigo_asignatura, datos[index].nombre_asignatura, 'N'])
        }

        modalidad_de_ingreso.push([`${datos_estudiante['tipo_ingreso']} GESTION ${datos_estudiante['anio_ingreso']}`, 'APROBADO'])

        const mensaje = 'Reporte Generado!';
        if (status === 200) {
          //metodos para actualizar la tabla de Datos(Datatable)        
          this.forceRender();
          this.getEstudiantesHabilitados();

          generarReporteInscripcionNuevos(asignaturas_tabla, modalidad_de_ingreso, datos_estudiante, fecha_emision, numero_boleta, numero_archivo);
        }
      });
    },

    async generarReporteInscripcionNuevos(asignaturas_tabla, modalidad_de_ingreso, datos_estudiante, fecha_emision, numero_boleta, numero_archivo) {
      //inicializacion de parametros para el reporte pdf
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setFontSize(12);

      const headers = [['NRO', 'CODIGO', 'ASIGNATURA PROGRAMADA', 'TIPO', 'OBSERVACION']];
      const headersModalidadIngreso = [['MODALIDAD DE INGRESO', 'RESULTADO']];

      doc.setTextColor(10);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10

      //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
      await doc.addImage("../../ministerio.jpg", "JPG", doc.internal.pageSize.width - 65, finalY + 5, 60, 60);
      await doc.addImage("../../logotipo-unibol-quechua.png", "PNG", 15, finalY + 5, 50, 50);

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


      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        BOLETA DE INSCRIPCIÓN 2024
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");
      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        N° ${numero_boleta}
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY, null, null, "center");

      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'bold');
      doc.text(`
                      APELLIDOS Y NOMBRES:                                  
                      CÉDULA DE IDENTIDAD:                                   
                      NÚMERO DE REGISTRO:                                   
                      CARRERA:                                   
                      FECHA DE EMISIÓN:                                   
                        
                        `, -10, finalY);

      //datos_estudiante,fecha_emision,numero_boleta
      doc.setTextColor(100);
      doc.text(`
                       ${datos_estudiante.apellidoP} ${datos_estudiante.apellidoM} ${datos_estudiante.nombres}                        
                       ${datos_estudiante.ci_estudiante}                       
                       ${datos_estudiante.numero_registro}                                 
                       ${datos_estudiante.nombre_carrera}
                       ${fecha_emision}
                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 150, finalY);

      finalY += 45;


      autoTable(doc, {
        startY: finalY + 30,
        head: headersModalidadIngreso,
        body: modalidad_de_ingreso,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },

      });

      finalY = doc.lastAutoTable.finalY
      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        PROGRAMACIÓN DE ASIGNATURAS GESTIÓN 2024
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 10;
      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        PERIODO: ${datos_estudiante.anio_cursado}
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");


      autoTable(doc, {
        startY: finalY + 20,
        head: headers,
        body: asignaturas_tabla,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },

      });
      finalY = doc.lastAutoTable.finalY
      finalY += 80;

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'normal');
      doc.text(`
                        FIRMA ESTUDIANTE
                        `, -10, finalY);

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'normal');
      doc.text(`
                        RESP. INSCRIPCIÓN
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'normal');
      doc.text(`
                      FIRMA DIRECTOR
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY, null, null, "center");

      finalY += 85;
      console.log('este es el alto' + doc.internal.pageSize.height);

      doc.setTextColor(10);
      doc.setFontSize(6).setFont(undefined, 'bold');
      doc.text(`
                      Documento solo válido para tramite interno                                  
                      *Ajuste: Asignaturas validadas con la Resolución Ministerial N°0155/2023
                      *N: Gestión Asignatura Normal                        
                        `, -10, finalY);



      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'bold');
      doc.text(`
                        Arch: ${numero_archivo}
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY + 50, null, null, "center");

      finalY += 10;

      await window.open(doc.output('bloburl'), '_blank');
    },
    getEstudiantesHabilitados() {
      axios.get(this.url)
        .then(
          response => (

            this.estudiantes = response.data['estudiantes'],
            this.anio_actual = response.data['anio_actual']
          )
        ).catch(error => {
          if (error.response) {
            const status = error.response.data.message;
            show_alerta(status, 'error')
          }
          else {
            show_alerta(error, 'error')
          }
        });
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