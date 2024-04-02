<template>
  <div class="container ">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold ">

          <div class="mb-3 fs-5 text-center">
            PLANILLA DE ESTUDIANTES GENERAL
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <button class="btn btn-success  float-end">
            <router-link to="/estudiante/create" class="nav-link active"><i class="fa-solid fa-user-plus"></i>NUEVO
              ESTUDIANTE</router-link>
          </button>
          <button class="btn btn-success me-1" @click="perfilEstudiante">
            <i class="fa-solid fa-user-graduate"></i>Perfil
          </button>
          <button class="btn btn-warning rounded   me-1" @click="editarSeleccionado()">
            <i class="fa-solid fa-user-plus"></i>Editar
          </button>
          <button class="btn btn-success me-1" @click="historialAvanceGeneral">
            <i class="fa-solid fa-user-graduate"></i>HistorialAG.
          </button>
          <button class="btn btn-success me-1" @click="materiasCursadas">
            <i class="fa-solid fa-user-graduate"></i>HistorialAcad.
          </button>
          <button class="btn btn-success me-1" @click="formularioA()">
            <i class="fa-regular fa-clipboard"></i>Form.Admisión
          </button>
          <button class="btn btn-success" @click="certificadoCalificaciones">
            <i class="fa-solid fa-sheet-plastic"></i>Cert.Calificaciones
          </button>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive">
        <!-- Configuracion para el Uso de Datatable de Un Estudiante -->
        <DataTable ref="table" id="datatable" :data="estudiantes" :columns="columns" v-if="estudiantes"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Bfrtip',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }], pageLength: 5,

            columnDefs: [{
              width: '40%', target: [6],
              width: '10%', target: [7],
            },
            { responsivePriority: 1, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 3, targets: 11 },
            { responsivePriority: 4, targets: 3 },
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
              <th class="col">
                #
              </th>
              <th>
                C.I.
              </th>
              <th class="col-2">
                NOMBRE COMPLETO
              </th>
              <th class="col-3">
                CARRERA
              </th>
              <th class="col-1">
                TIPO INGRESO
              </th>
              <th class="col-1">
                AÑO INGRESO
              </th>
              <th class="col-1">
                N° ARCHIVO
              </th>
              <th class="col-1">
                AÑO CURSADO
              </th>
              <th class="col-2">
                OBS.1
              </th>
              <th class="col-2">
                OBS.2
              </th>
              <th class="col-1">
                ESTADO
              </th>
              <th class="col-1">
                INSCRITO
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
import { historialAcademico } from '../../reportes'

//librerias para la importacion de pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//librerias para el uso de Datatables
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Select from "datatables.net-select";
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);
DataTable.use(Select);

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
//deficion de variables globales para el uso en el reporte pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  components: { DataTable },
  name: 'EstudianteView',
  data() {
    return {
      estudiantes: null, carreras: [], principal: '', message: '', BASE_URL: '',
      datos_estudiantes: {
        gestion: '',
        datos_estudiante: {},
        requisitos: {},
        numero_archivo: '',
        materias_cursadas: {}
      },
      //columnas del Datatable
      columns: [
        {
          data: null, render: function (data, type, row, meta) { return `${meta.row + 1}` }
        },
        { data: 'ci_estudiante' },
        { data: null, render: function (data) { return `${data.apellidoP} ${data.apellidoM} ${data.nombres}` } },
        { data: 'nombre_carrera' },
        { data: 'tipo_ingreso' },
        { data: 'anio_ingreso' },
        { data: 'numero_archivo' },
        { data: 'anio_cursado' },
        { data: 'obs1' },
        { data: 'obs2' },

        { data: 'estado' },
        { data: 'inscrito_gestion' },
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
    //lista de Estudiantes General
    this.getEstudiantes();

    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {
    verificarSeleccion() {
      let datos = this.estudiantes;
      let identificador = '';
      let nombres = '';

      this.table.dt.rows({ selected: true }).every(function () {
        const row = this.data();
        let idx = datos.indexOf(this.data());
        nombres = `${datos[idx].nombres} ${datos[idx].apellidoP} ${datos[idx].apellidoM}`;
        let clave = datos[idx].ci_estudiante;

        identificador = clave;
      });
      return { identificador, nombres };
    },
    //metodo para editar la informacion del Estudiante
    async editarSeleccionado() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/estudiante/edit/' + identificador + '/');
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para eliminar la informacion del Estudiante
    eliminarSeleccionado() {
      const { identificador, nombres } = this.verificarSeleccion();
      if (identificador) {
        const ruta = 'estudiantes/estudiantes/' + identificador + '/';
        confirmar1(identificador, nombres, ruta, this.principal);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para ir a la vista del Perfil del Estudiante
    perfilEstudiante() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/perfil-estudiante/' + identificador);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para ir a la vista del Historial de Avance General
    historialAvanceGeneral() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/estudiante/historial-avance-general/' + identificador);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para ir a la vista de Historial Académico
    materiasCursadas() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        this.$router.push('/estudiante/materias-cursadas/' + identificador);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },

    //metodo para obtener el reporte de Formulario de Admisión
    async formularioA() {
      const { identificador } = this.verificarSeleccion();
      if (identificador) {
        const url = BASE_URL + '/estudiantes/formularioAdmision/' + identificador + '/';
        await axios.get(url)
          .then(
            response => {
              this.datos_estudiantes = response.data;

              this.generarformularioAdmision(this.datos_estudiantes);
            }
          ).catch(error => {
            console.log(error)
            show_alerta(error, 'error')
          });

      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para obtener el Certificado de Calificaciones por Gestión Académica
    async certificadoCalificaciones() {
      const { identificador } = this.verificarSeleccion();
      console.log(identificador);
      if (identificador) {
        this.$router.push('/estudiante/historial-anual/' + identificador);
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para obtener la lista general de Estudiantes 
    async getEstudiantes() {
      await axios.get(BASE_URL + '/estudiantes/estudiantes/')
        .then(
          response => (
            this.estudiantes = response.data
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    }, eliminar(id, nombre) {
      const ruta = 'estudiantes/estudiantes/' + id + '/';
      confirmar1(id, nombre, ruta, this.principal);
    },
    getMateriasCursadas(id) {
      axios.get(BASE_URL + '/estudiantes/obtenerAsignaturasCursadas/' + id + '/')
        .then(
          response => {

            if (!response.data.message) {
              this.materias_cursadas = response.data

            } else {
              this.message = response.data.message
            }

          }
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    formatDate(cadena) {
      if (cadena !== '' && cadena !== null && cadena !== 'undefined' && cadena !== ' ') {
        let fecha = '';
        const datos = cadena.split('-');
        fecha = datos[2] + '/' + datos[1] + '/' + datos[0];
        return fecha;
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
    //metodo para generar el reporte pdf del Formulario de Admisión
    async generarformularioAdmision(datos_estudiante) {
      //inicializacion de parametros para el reporte pdf
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setFontSize(12);

      //cabeceras de columna de tabla de datos Formulario de Admision
      const headers = [['N°', 'REQUISITOS DE ADMISIÓN', 'CUMPLE']];

      //lista de requisitos de Admision 
      let requirements = [];
      const requisitos = datos_estudiante.requisitos;
      for (let index = 0; index < requisitos.length; index++) {
        requirements.push([index + 1, requisitos[index].requisito])
      }

      let finalY = doc.lastAutoTable.finalY || 10

      //inicialización de las Imagenes del encabezado para el formulario de Admisión
      await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
      await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);


      //setear el color de letra
      doc.setTextColor(10);
      //setear el tamaño de letra
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
      doc.setFontSize(12).setFont(undefined, 'bold');
      doc.text(`
                      FORMULARIO DE ADMISIÓN UNIBOL-QUECHUA
                      `, (doc.internal.pageSize.getWidth() / 2) - 40, finalY, null, null, "center");

      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(18).setFont(undefined, 'bold');
      doc.text(`
                      GESTIÓN ${datos_estudiante.gestion}
                      `, (doc.internal.pageSize.getWidth() / 2) - 40, finalY, null, null, "center");

      finalY += 100;

      doc.setTextColor(10);
      doc.setFontSize(12).setFont(undefined, 'bold');
      doc.text(`
                      C.I.: ${datos_estudiante.datos_estudiante.ci_estudiante}
                      `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY, null, null, "center");

      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(14).setFont(undefined, 'bold');
      doc.text(`
                      DATOS PERSONALES
                      `, -30, finalY, null, null, "left");

      finalY += 15;

      doc.setTextColor(10);
      doc.setFontSize(11);
      doc.text(`
                       Apellidos y Nombres:                                  
                       Fecha de Nacimiento: 
                       Estado Civil: 
                       Género: 
                       Lugar de Nacimiento: 
                       Correo Electrónico: 
                       Teléfono:
                       `, -20, finalY);

      const estudiante1 = datos_estudiante.datos_estudiante;
      let estado = '';
      let genero = '';
      let email = '';
      let celular = '';
      let nacimiento = '';
      let fecha_nac = '';
      //validacion de parametros
      if (estudiante1.estado_civil) {
        estado = estudiante1.estado_civil.toUpperCase();
      } else {
        estado = '';
      }

      if (estudiante1.genero === 'M') {
        genero = 'MASCULINO';
      } else {
        genero = 'FEMENINO';
      }

      if (estudiante1.email) {
        email = estudiante1.email.toUpperCase();
      } else {
        email = '';
      }

      if (estudiante1.celular > 0) {
        celular = estudiante1.celular;
      } else {
        celular = '';
      }
      if (estudiante1.prov_nacimiento) {
        nacimiento = estudiante1.prov_nacimiento.toUpperCase();
      }
      fecha_nac = estudiante1.fecha_nacimiento ? this.formatDate(estudiante1.fecha_nacimiento) : '';
      console.log(fecha_nac + 'asi');

      doc.setTextColor(100);
      doc.setFontSize(11);
      doc.text(`
                       ${estudiante1.apellidoP} ${estudiante1.apellidoM} ${estudiante1.nombres}                         
                       ${fecha_nac}
                       ${estado}                                
                       ${genero}
                       ${nacimiento}
                       ${email}
                       ${celular}
                       `, (doc.internal.pageSize.getWidth() / 2) - 130, finalY);

      finalY += 75;

      doc.setTextColor(10);
      doc.setFontSize(14).setFont(undefined, 'bold');
      doc.text(`
                      DATOS DE ORGANIZACIÓN
                        `, -30, finalY, null, null, "left");

      finalY += 15;

      doc.setTextColor(10);
      doc.setFontSize(11);
      doc.text(`                                                       
                        -Matriz: 
                        -Regional: 
                        -Comunidad: 
                        Lengua que habla:                        
                        `, -20, finalY);

      let matriz = '';
      let regional = '';
      let comunidad = '';
      let idioma = '';
      //validacion de parametros de organización social
      if (estudiante1.organizacion_matriz) {
        matriz = estudiante1.organizacion_matriz.toUpperCase();
      }
      if (estudiante1.organizacion_regional) {
        regional = estudiante1.organizacion_regional.toUpperCase();
      }
      if (estudiante1.comunidad_sindicato) {
        comunidad = estudiante1.comunidad_sindicato.toUpperCase();
      }
      if (estudiante1.idioma_nativo) {
        idioma = estudiante1.idioma_nativo;
      }


      doc.setTextColor(100);
      doc.setFontSize(11).setFont(undefined, 'bold');
      doc.text(`                                        
                       ${matriz}                                
                       ${regional}
                       ${comunidad}
                       ${idioma}                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 130, finalY);

      finalY += 55;


      doc.setTextColor(10);
      doc.setFontSize(14).setFont(undefined, 'bold');
      doc.text(`
                      CARRERA DE INGRESO
                        `, -30, finalY, null, null, "left");

      finalY += 20;

      doc.setTextColor(10);
      doc.setFontSize(11).setFont(undefined, 'bold');
      doc.text(`
                         ${estudiante1.nombre_carrera}
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 10;

      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: requirements,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'striped',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.5,
        styles: { fontSize: 10, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          halign: 'center'
        },
        padding: 2,
        columnStyles: {
          0: { cellWidth: 50, halign: 'center' },
          1: { cellWidth: 299, halign: 'center' },
          2: { cellWidth: 50, halign: 'center' },
        }
      });

      finalY = doc.lastAutoTable.finalY
      finalY += 10;

      doc.setTextColor(10);
      doc.setFontSize(8).setFont(undefined, 'bold');
      doc.text(`
                    Arch: ${datos_estudiante.numero_archivo}              
                      `, -5, finalY);

      //forma alternativa para la generacion de pdf
      //await doc.save(`${this.apellidoP} ${this.apellidoM} ${this.nombres}`);      

      await window.open(doc.output('bloburl'), '_blank');

    }
  }
}
</script>
<style>
/* estilos para el uso de Datatables */
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
