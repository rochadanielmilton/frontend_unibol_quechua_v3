<template >
  <div class="container">
    <div class="row">
      <div class="mb-3 fw-bold">
        <div class="mb-3 fs-4 text-center">
          PLANILLA DE ESTUDIANTES REGULARES HABILITADOS PARA LA INSCRIPCION:
        </div>
      </div>
    </div>

    <div class="row">
      <div class="mb-3">
        <div class="mb-3 d-grid gap-2 d-md-block">
          <div class="mb-3 d-grid gap-2 d-md-block">
            <button class="btn btn-success  me-1" @click="inscribirEstudiante">
              <i class="fa-solid fa-user-plus"></i>INSCRIBIR
            </button>
            <button class="btn btn-success  rounded   me-1" @click="reimprimirInscripcionRegulares()">
              REIMPR.-R
            </button>
            <button class="btn btn-danger me-1" @click="recepcionAnularInscripcion()">
              <i class="fa-solid fa-user-graduate"></i>ANULAR INSC.
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
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
          <tbody class="table-group-divider" id="contenido" :key="keycon">
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
      materias: null, keycon: 0,
      url: BASE_URL + '/administracion/obtenerEstudiantesInscripcion/',
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
    //inscripcion de Estudiante Regular, redireccion a la Oferta de Asignaturas
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
    //metodo para anular la Inscripción del Estudiante
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
    //metodo para reimprimir boleta de Inscripción del Estudiante previa seleccion del mismo
    reimprimirInscripcionRegulares() {
      const { identificador, inscrito_gestion, nombres, anio_ingreso } = this.verificarSeleccion();
      if (identificador) {
        if (inscrito_gestion === 'si' && anio_ingreso !== this.anio_actual) {
          this.reimpresionRegulares(identificador);
        } else {
          show_alerta(`El Estudiante ${nombres} no se encuentra Inscrito!`, 'info')
        }
      } else {
        const error = 'Debes Seleccionar Un Estudiante!';
        show_alerta(error, 'info')
      }
    },
    //metodo para verificar que se haya seleccionado un Estudiante
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
    //mensaje de confirmacion para anular la Inscripción del Estudiante
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
          //metodo para anular la Inscripcion de forma definitiva
          this.anularInscripcion(url);
        } else {
          show_alerta('Operacion cancelada', 'info');
        }
      })

    },
    //metodo para anular la Inscripcion de forma definitiva
    async anularInscripcion(url) {
      await axios.get(url)
        .then(
          response => {
            const status = response.status;
            const mensaje = 'Inscripción Anulada Satisfactoriamente!';
            if (status === 200) {

              show_alerta(mensaje, 'success');

              //metodos para actualizar la tabla de datos
              this.forceRender();
              this.getEstudiantesHabilitados();

            }
          }
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    //servicio API-REST para la reimpresion de boleta de Inscripcion
    async reimpresionRegulares(id) {
      const ruta = BASE_URL + '/administracion/reimprimirInscripcion/' + id + '/';

      await axios({ method: 'GET', url: ruta }).then(resultado => {
        const status = resultado.status;

        const datos = resultado.data['asignaturas_tomadas'];
        const asignaturas_anterior = resultado.data['asignaturas_anio_anterior'];
        const datos_estudiante = resultado.data['estudiantes'];
        const fecha_emision = resultado.data['fecha_emision'];
        const numero_boleta = resultado.data['numero_boleta'];
        const numero_archivo = resultado.data['numero_archivo'];
        let asignaturas_gestion_anterior = [];
        let asignaturas_tabla = [];
        for (let index = 0; index < datos.length; index++) {
          asignaturas_tabla.push([index + 1, datos[index].codigo_asignatura, datos[index].nombre_asignatura, 'N', datos[index].observacion])
        }
        for (let index = 0; index < asignaturas_anterior.length; index++) {
          asignaturas_gestion_anterior.push([index + 1, asignaturas_anterior[index].codigo_asignatura, asignaturas_anterior[index].nombre_asignatura, asignaturas_anterior[index].nota_num_final,
          asignaturas_anterior[index].estado_gestion_espaniol, asignaturas_anterior[index].observacion]);
        }
        generarReporteInscripcionRegulares(asignaturas_tabla, asignaturas_gestion_anterior, datos_estudiante, fecha_emision, numero_boleta, numero_archivo);

        const mensaje = 'Estudiante inscrito Exitosamente!';
        if (status === 200) {
          show_alerta(mensaje, 'success');
        }
      });
      this.forceRender();
      this.getEstudiantesHabilitados();
    },
    getEstudiantesHabilitados() {
      axios.get(this.url)
        .then(
          response => (

            this.estudiantes = response.data['estudiantes'],
            this.anio_actual = response.data['anio_actual']
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
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