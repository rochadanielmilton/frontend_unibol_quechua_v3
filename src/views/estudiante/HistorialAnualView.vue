<template>
  <div v-if="materias" class="container-fluid" id="contenido-global">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold normal-letter ">

          <div class="mb-3 fs-5 text-center">
            CERTIFICADO CALIFICACIONES
          </div>

          <div class="  fs-6">
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

          <div class="d-flex justify-content-between ">
            <div class=" mb-3 fs-6">
              FECHA DE EMISIÓN : {{ `${fecha_emision}` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="table-responsive text-center">
          <table id="materias_cursadas" class="table table-bordered table-hover table-striped col-12 small">
            <thead v-if="materias.length > 0" class="pb-4 table-light">
              <tr>
                <th>
                  #
                </th>
                <th>
                  GESTIÓN
                </th>
                <th>
                  REPORTE
                </th>
              </tr>
            </thead>

            <div class="col-sm-12 col-md-6 col-lg-4" v-else>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    El Estudiante no cuenta aún con un Certificado De Calificaciones
                  </h5>
                  <div>

                  </div>
                </div>
              </div>
            </div>

            <tbody class="table-group-divider" id="contenido">
              <tr v-for="gestion, i  in gestiones" :key="gestion">
                <td>{{ i + 1 }}</td>
                <td>{{ gestion }}</td>
                <td>
                  <button class="btn btn-warning" @click="certificadoCalificaciones(ci_estudiante, gestion)">
                    <i class="fa-solid fa-file-pdf"></i>
                  </button>
                </td>
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
import { historialAcademico } from '../../reportes'
import { useRoute } from "vue-router";

//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'HistorialAnualView',
  data() {
    return {
      gestiones: [],

      estudiantes: null, carreras: [], principal: '',
      ci_estudiante: '', nombres: '', apellidoP: '', apellidoM: '', numero_registro: '', nombre_carrera: '', fecha_emision: '', grado: '', anio_ingreso: '',
      cantidad_aprobadas: '',
      cantidad_todas: '',
      promedio_todas: '',
      promedio_aprobadas: '',
      materias: {}, message: '',
      url: BASE_URL + '/estudiantes/ObtenerHitorialAcademico2'
    }
  },
  //inicializacion de metodos y argumentos una vez cargada la vista
  mounted() {
    const route = useRoute();

    this.id = route.params.id;
    this.url = this.url + '/' + this.id + '/';
    //obtener Asignaturas Cursadas 
    this.getMateriasCursadas();
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {
    generarGestion(gestion) {
      let inicio = 2023;
      let numero = inicio - (gestion - 1);
      if (gestion <= inicio) {
        for (let index = 0; index < numero; index++) {
          this.gestiones.push(inicio - index)
        }
      }
    },
    //metodo para generar el Certificado de Calificaciones Por Gestión Académica
    async certificadoCalificaciones(id, gestion) {
      const url = BASE_URL + '/estudiantes/obtenerCertificacionPorGestion/' + id + '/' + gestion + '/';
      await axios.get(url)
        .then(
          response => {
            this.materias_cursadas = response.data;
            const datos = this.materias_cursadas;
            const datos_estudiante = datos.estudiante;
            const grado = datos.grado;
            const fecha_emision = datos.fecha_emision;
            const otros_datos = datos.datos;
            if (!response.data.message) {
              //obtiene el historial Académico del Estudiante Por Gestión Académica
              historialAcademico(datos_estudiante, grado, fecha_emision, otros_datos, gestion);
            } else {
              show_alerta('El estudiante no curso la gestión anterior(2023)', 'error')
            }
          }
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    sortGestion(data) {
      data = data.sort((a, b) => {
        if (a.anio_cursado < b.anio_cursado) {
          return -1;
        }
      });
      return data;
    },
    async getMateriasCursadas() {
      await axios.get(this.url)
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

              this.materias = this.sortGestion(response.data['datos']),
              this.anio_ingreso = response.data['estudiante']['anio_ingreso'],
              this.generarGestion(response.data['estudiante']['anio_ingreso'])

          }
        ).catch(error => {
          console.log(error)
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
<style scoped>
body {
  font-size: .675rem;
  line-height: 1.25rem;
}

.normal-letter {
  font-size: .675rem;
  line-height: 1.25rem;
}
</style>