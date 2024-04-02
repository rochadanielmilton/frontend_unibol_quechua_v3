<template>
  <div class="container">
    <div class="row">
      <div class="mb-3 fw-bold  normal-letter">
        <div class="mb-3 fs-5 text-center">
          PERFIL DEL ESTUDIANTE
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
      <div class="table-responsive ">
        <!-- Inicializacion de los parametros para el uso de Datatables -->
        <DataTable ref="table" id="perfil_estudiante" :data="estudiante_formateado" :columns="columns"
          class="table table-bordered table-striped display small" :options="{
            select: true, responsive: true, autoWidth: true, dom: 'Brti', order: [], info: '',
            buttons: [{
              extend: 'selected',
              text: 'Edit',
              name: 'edit'
            }],
            pageLength: 100,

            columnDefs: [{
              width: '50%', target: [0],
              width: '50%', target: [1],
            },
            { orderable: false, targets: 0 },
            { orderable: false, targets: 1 },
            { responsivePriority: 0, targets: 0 },
            { responsivePriority: 1, targets: 1 },

            ],
            language: {
              search: 'Buscar', zeroRecord: 'No hay registros que mostrar',
              info: 'Mostrando desde _START_ a _END_ de _TOTAL_ registros',
              infoFiltered: '(Filtrados de _MAX_ registros)',
              paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Ultimo' }
            },
          }">
          <thead class="pb-4 table-light">
            <tr>
              <th>
                INFORMACIÓN GENERAL
              </th>
              <th>
                INFORMACIÓN ESTUDIANTIL
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
          </tbody>
        </DataTable>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-sm-12 col-md-6 col-lg-4" v-if="organizacion['id']">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title fw-bold">
              Organización Social
            </h5>

            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Organización Matriz: &emsp;&emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${organizacion_matriz}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Organización Departamental: &emsp;
              </div>
              <div class="ma-3 float-center">
                {{ `${organizacion_departamental}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Organización Regional:
              </div>
              <div class="ma-3 ">
                {{ `${organizacion_regional}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Comunidad Sindicato: &emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${comunidad_sindicato}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Datos Complementarios:
              </div>
              <div class="ma-3 ">
                {{ `${otros}` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4" v-else>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Organización Social
            </h5>
            <h6>
              No Existen Datos de La Organización Social
            </h6>
            <div>

            </div>
          </div>
        </div>
      </div>




      <div class="col-sm-12 col-md-6 col-lg-4" v-if="educacion_primaria['unidad_educativa']">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Educación Primaria
            </h5>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Unidad Educativa: &emsp;
              </div>
              <div class="ma-3 ">
                {{ `${unidad_educativa}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Año de Egreso: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${anio_egreso}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Tipo Colegio: &emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${tipo_colegio}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                País Académico: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${pais_academico}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Departamento: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${departamento}` }}
              </div>
            </div>
            <div class="mb-3 d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Provincia: &emsp;&emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${provincia}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Estado: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${estado_educacion}` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4" v-else>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Educación Primaria
            </h5>
            <h6>
              No Existen Datos de La Educación Primaria
            </h6>
            <div>

            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4" v-if="responsable_estudiante['id']">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Responsable del Estudiante
            </h5>
            <div class="mb-3  d-flex justify-content-between">
              <div class="  fs-6 fw-bold">
                Nombre Completo: &emsp;
              </div>
              <div class="ma-3 float-end">
                {{ `${nombre_completo}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Cédula Identidad: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${cedula_responsable}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Celular: &emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${celular_responsable}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Ocupación: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${ocupacion}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between ">
              <div class="  fs-6 fw-bold">
                Idioma que Habla: &emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${idioma_hablante}` }}
              </div>
            </div>
            <div class="mb-3  d-flex justify-content-between">
              <div class="  fs-6 fw-bold">
                Relación Familiar: &emsp;&emsp;&emsp;&emsp;&emsp;
              </div>
              <div class="ma-3 ">
                {{ `${relacion_responsable}` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4" v-else>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Responsable del Estudiante

            </h5>
            <h6>
              No Existen Datos del Responsable
            </h6>
            <div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { show_alerta, sendRequest } from "../../funciones";
import { useRoute } from "vue-router";
import { ref } from 'vue';
import axios from 'axios';

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
  name: 'PerfilEstudianteView',
  components: { DataTable },
  data() {
    return {
      ci_estudiante: 0, extencion: '', nombres: '', apellidoP: '', apellidoM: '', direccion: '', celular: 0, anio_ingreso: '', anio_cursado: '', genero: '', fecha_nacimiento: '', depa_nacimiento: '', prov_nacimiento: '', munic_nacimiento: '', tipo_ingreso: '',
      fotografia: '', estado_civil: '', idioma_nativo: '', idioma_regular: '', email: '', nacionalidad: '', numero_archivo: '',
      homologacion: '', estado_homologacion: '', convalidacion: '', estado_convalidacion: '', egresado: '', estado_egresado: '', titulado: '', descripcion_titulado: '',
      numero_registro: 0, obs1: '', obs2: '', obs3: '', estado: '', descripcion_estado: '', baja: '', codigo_carrera: 0, nombre_carrera: '', inscrito_gestion: '',
      ci_especial: '', photography: '', fileFoto: null,
      organizacion: {},
      organizacion_matriz: '', organizacion_departamental: '', organizacion_regional: '', comunidad_sindicato: '', otros: '',
      unidad_educativa: '', anio_egreso: '', tipo_colegio: '', pais_academico: '', departamento: '', provincia: '', estado_educacion: '', educacion_primaria: {},
      nombre_completo: '', cedula_responsable: '', celular_responsable: '', ocupacion: '', idioma_hablante: '', relacion_responsable: '', responsable_estudiante: {},
      idiomas: null, carreras: null, principal: '', provincias: null, departamentos: null, noencontrado: true,
      anios_carreras: '',
      estudiante_data: [], estudiante_formateado: [], gender: '',
      url: BASE_URL + '/estudiantes/estudiantes',

      //columnas de datos del Datatable
      columns: [
        { data: null, render: function (data) { return `${data[0]}` } },
        { data: null, render: function (data) { return `${data[1]}` } },
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
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';

    this.getEstudiante();

    this.getOrganizacion(this.id);
    this.getEducacionPrimaria(this.id);
    this.getResponsable(this.id);

    this.principal = '/estudiantes';
  },
  //metodos de la vista
  methods: {
    formatearLista() {
      let indice = 20;
      for (let index = 0; index < this.estudiante_data.length; index++) {
        this.estudiante_formateado.push('a', this.estudiante_data[index])
        if (index >= 20) {
          this.estudiante_formateado.push('', '', this.estudiante_data[indice])
          indice++;
        }
        return this.estudiante_formateado;
      }
    },
    getGenero(genero) {
      if (genero === 'M') {
        return 'Masculino'
      } else {
        return 'Femenino'
      }
    },
    //obtener la informacion del Estudiante a partir de su ci
    getEstudiante() {
      axios.get(this.url).then(
        response => (
          this.nombres = response.data['nombres'],
          this.ci_estudiante = response.data['ci_estudiante'],
          this.ci_especial = response.data['ci_especial'],
          this.extencion = response.data['extencion'],

          this.apellidoP = response.data['apellidoP'],
          this.apellidoM = response.data['apellidoM'],

          this.codigo_carrera = response.data['codigo_carrera'],
          this.nombre_carrera = response.data['nombre_carrera'],
          this.inscrito_gestion = response.data['inscrito_gestion'],
          this.estado = response.data['estado'],
          this.descripcion_estado = response.data['descripcion_estado'],

          this.direccion = response.data['direccion'] ? response.data['direccion'] : '',
          this.celular = response.data['celular'],

          this.genero = response.data['genero'] ? response.data['genero'] : '',
          this.fecha_nacimiento = response.data['fecha_nacimiento'],
          this.depa_nacimiento = response.data['depa_nacimiento'],
          this.prov_nacimiento = response.data['prov_nacimiento'] ? response.data['prov_nacimiento'] : '',

          this.munic_nacimiento = response.data['munic_nacimiento'],

          this.tipo_ingreso = response.data['tipo_ingreso'],

          this.fotografia = response.data['fotografia'],

          this.estado_civil = response.data['estado_civil'] ? response.data['estado_civil'] : '',
          this.idioma_nativo = response.data['idioma_nativo'] ? response.data['idioma_nativo'] : '',
          this.idioma_regular = response.data['idioma_regular'] ? response.data['idioma_regular'] : '',
          this.email = response.data['email'],

          this.nacionalidad = response.data['nacionalidad'] ? response.data['nacionalidad'] : '',

          //SEGUNDA PARTE
          this.anio_ingreso = response.data['anio_ingreso'],

          this.estudiante_formateado.push([`<span class='fw-bold'>NOMBRES:</span>  &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.apellidoP} ${this.apellidoM} ${this.nombres}`, `<span class='fw-bold'>AÑO INGRESO:</span>&emsp; &emsp;&emsp;&emsp;&emsp;&emsp; ${this.anio_ingreso}`]),
          this.anio_cursado = response.data['anio_cursado'],

          this.estudiante_formateado.push([`<span class='fw-bold'>CÉDULA IDENTIDAD :</span>  &emsp;&emsp;&emsp;&emsp; ${this.ci_estudiante}`, `<span class='fw-bold'>AÑO CURSADO:</span>  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.anio_cursado}`]),
          this.numero_archivo = response.data['numero_archivo'],

          this.estudiante_formateado.push([`<span class='fw-bold'>CARRERA:</span>   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${this.nombre_carrera}`, `<span class='fw-bold'>NÚMERO ARCHIVO:</span>  &emsp; &emsp;&emsp;&emsp; ${this.numero_archivo}`]),

          this.homologacion = response.data['homologacion'],

          this.estudiante_formateado.push([`<span class='fw-bold'>INSCRITO:</span>  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.inscrito_gestion}`, `<span class='fw-bold'>HOMOLOGACIÓN:</span> &emsp; &emsp;&emsp;&emsp;&emsp; ${this.homologacion}`]),
          this.estado_homologacion = response.data['estado_homologacion'] ? response.data['estado_homologacion'] : '',

          this.estudiante_formateado.push([`<span class='fw-bold'>ESTADO:</span> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;  ${this.estado}`, `<span class='fw-bold'>ESTADO HOMOLOGACIÓN:</span>  &emsp; ${this.estado_homologacion}`]),

          this.convalidacion = response.data['convalidacion'],

          this.estudiante_formateado.push([`<span class='fw-bold'>DIRECCIÓN:</span> &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.direccion}`, ` <span class='fw-bold'>CONVALIDACIÓN:</span> &emsp;&emsp;&emsp;&emsp;&emsp;  ${this.convalidacion}`]),
          this.estado_convalidacion = response.data['estado_convalidacion'] ? response.data['estado_convalidacion'] : '',

          this.estudiante_formateado.push([`<span class='fw-bold'>CELULAR:</span> &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.celular}`, `<span class='fw-bold'>ESTADO CONVALIDACIÓN:</span> &emsp;  ${this.estado_convalidacion}`]),


          this.estudiante_formateado.push([`<span class='fw-bold'>GÉNERO:</span>  &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${this.getGenero(this.genero)}`, `<span class='fw-bold'>EGRESADO:</span> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;  ${this.egresado}`]),


          this.estudiante_formateado.push([`<span class='fw-bold'>FECHA NACIMIENTO:</span> &emsp;&emsp;&emsp;&emsp;  ${this.fecha_nacimiento}`, `<span class='fw-bold'>ESTADO EGRESADO:</span> &emsp;&emsp;&emsp;&emsp;  ${this.estado_egresado}`]),

          this.titulado_tecnico_superior = response.data['titulado_tecnico_superior'],

          this.estudiante_formateado.push([`<span class='fw-bold'>DEPARTAMENTO NACIMIENTO:</span> ${this.depa_nacimiento}`, `<span class='fw-bold'>TITULADO:</span>  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.titulado}`]),

          this.descripcion_titulado_superior = response.data['descripcion_titulado_superior'] ? response.data['descripcion_titulado_superior'] : '',
          this.titulado_licenciatura = response.data['titulado_licenciatura'] ? response.data['titulado_licenciatura'] : '',
          this.descripcion_titulado_licenciatura = response.data['descripcion_titulado_licenciatura'] ? response.data['descripcion_titulado_licenciatura'] : '',


          this.estudiante_formateado.push([`<span class='fw-bold'>PROVINCIA NACIMIENTO:</span>  &emsp;&emsp; ${this.prov_nacimiento}`, `<span class='fw-bold'>DESCRIPCIÓN TITULADO:</span> &emsp;  ${this.descripcion_titulado}`]),

          this.numero_registro = response.data['numero_registro'],

          this.estudiante_formateado.push([`<span class='fw-bold'>MUNICIPIO NACIMIENTO:</span> &emsp;&emsp;  ${this.munic_nacimiento}`, `<span class='fw-bold'>NÚMERO REGISTRO:</span>  &emsp;&emsp;&emsp;&emsp; ${this.numero_registro}`]),
          this.obs1 = response.data['obs1'] ? response.data['obs1'] : '',

          this.estudiante_formateado.push([`<span class='fw-bold'>TIPO INGRESO:</span> &emsp;&emsp;&emsp;&emsp;&emsp; &emsp; ${this.tipo_ingreso}`, `<span class='fw-bold'>OBSERVACIÓN1:</span> &emsp;&emsp;&emsp;&emsp;&emsp;  ${this.obs1}`]),
          this.obs2 = response.data['obs2'] ? response.data['obs2'] : '',

          this.estudiante_formateado.push([`<span class='fw-bold'>ESTADO CIVIL:</span> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;  ${this.estado_civil}`, `<span class='fw-bold'>OBSERVACIÓN2:</span> &emsp;&emsp;&emsp;&emsp;&emsp;  ${this.obs2}`]),
          this.obs3 = response.data['obs3'] ? response.data['obs3'] : '',

          this.estudiante_formateado.push([`<span class='fw-bold'>IDIOMA NATIVO:</span> &emsp; &emsp;&emsp;&emsp;&emsp;&emsp; ${this.idioma_nativo}`, `<span class='fw-bold'>OBSERVACIÓN3:</span>  &emsp;&emsp;&emsp;&emsp;&emsp; ${this.obs3}`]),

          this.baja = response.data['baja'],

          this.estudiante_formateado.push([`<span class='fw-bold'>IDIOMA REGULAR:</span>  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.idioma_regular}`, `<span class='fw-bold'>BAJA:</span> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;  ${this.baja}`]),

          this.estudiante_formateado.push([`<span class='fw-bold'>EMAIL:</span>  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.email}`, ``]),

          this.estudiante_formateado.push([`<span class='fw-bold'>NACIONALIDAD: </span> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${this.nacionalidad}`, ``]),

          this.estudiante_data = response.data
        )
      ).catch(error => {
        console.log(error)
        show_alerta(error, 'error')
      });
    },
    //obtener la organizacion del Estudiante a partir de su ci
    async getOrganizacion(id) {
      await axios.get(BASE_URL + '/estudiantes/ObtenerOrganizacion/' + id + '/')
        .then(
          response => (
            this.organizacion = response.data,
            this.organizacion_matriz = response.data['organizacion_matriz'] ? response.data['organizacion_matriz'] : '',
            this.organizacion_departamental = response.data['organizacion_departamental'] ? response.data['organizacion_departamental'] : '',
            this.organizacion_regional = response.data['organizacion_regional'] ? response.data['organizacion_regional'] : '',
            this.comunidad_sindicato = response.data['comunidad_sindicato'] ? response.data['comunidad_sindicato'] : '',
            this.otros = response.data['otros'] ? response.data['otros'] : ''
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    //obtener la informacion de Educacion Primaria del Estudiante a partir de su ci
    async getEducacionPrimaria(id) {
      await axios.get(BASE_URL + '/estudiantes/ObtenerEducacionPrimaria/' + id + '/')
        .then(
          response => (
            this.educacion_primaria = response.data,
            this.unidad_educativa = response.data['unidad_educativa'] ? response.data['unidad_educativa'] : '',
            this.anio_egreso = response.data['anio_egreso'] ? response.data['anio_egreso'] : '',
            this.tipo_colegio = response.data['tipo_colegio'] ? response.data['tipo_colegio'] : '',
            this.pais_academico = response.data['pais_academico'] ? response.data['pais_academico'] : '',
            this.departamento = response.data['departamento'] ? response.data['departamento'] : '',
            this.provincia = response.data['provincia'] ? response.data['provincia'] : '',
            this.estado_educacion = response.data['estado'] ? response.data['estado'] : ''

          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    //obtener la informacion del Estudiante a partir de su ci
    async getResponsable(id) {
      await axios.get(BASE_URL + '/estudiantes/ObtenerResponsable/' + id + '/')
        .then(
          response => (
            this.responsable_estudiante = response.data,
            this.nombre_completo = response.data['nombre'] ? `${response.data['nombre']} ${response.data['apellidoP']}` : '',
            this.cedula_responsable = response.data['ci'] ? response.data['ci'] : '',
            this.celular_responsable = response.data['celular'] ? response.data['celular'] : '',
            this.ocupacion = response.data['ocupacion'] ? response.data['ocupacion'] : '',
            this.idioma_hablante = response.data['idioma'] ? response.data['idioma'] : '',
            this.relacion_responsable = response.data['relacion_responsable'] ? response.data['relacion_responsable'] : ''
          )
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    //generar el reporte pdf del perfil del Estudiante
    async exportPDF() {
      this.table.dt.page.len(1000).draw();
      //inicializacion de parametros para el reporte pdf
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });
      doc.setFontSize(12);

      const resultado = [];
      //llenado del perfil del Estudiante en 2 columnas
      resultado.push(['NOMBRES: ', `${this.nombres} ${this.apellidoP} ${this.apellidoM}`, 'CARRERA: ', this.nombre_carrera])
      resultado.push(['CÉDULA IDENTIDAD: ', this.ci_estudiante, 'AÑO INGRESO: ', this.anio_ingreso])
      resultado.push(['ESTADO: ', this.estado, 'AÑO CURSADO: ', this.anio_cursado])
      resultado.push(['DIRECCIÓN: ', this.direccion, 'INSCRITO: ', this.inscrito_gestion])
      resultado.push(['CELULAR: ', this.celular, 'NÚMERO ARCHIVO: ', this.numero_archivo])
      resultado.push(['GÉNERO: ', this.getGenero(this.genero), 'HOMOLOGACIÓN: ', this.homologacion])
      resultado.push(['FECHA NACIMIENTO: ', this.fecha_nacimiento, 'ESTADO HOMOLOGACIÓN: ', this.estado_homologacion])
      resultado.push(['DEPARTAMENTO NACIMIENTO: ', this.depa_nacimiento, 'CONVALIDACIÓN: ', this.convalidacion])
      resultado.push(['PROV.NACIMIENTO: ', , 'ESTADO CONVALIDACIÓN: ', this.estado_convalidacion])
      resultado.push(['MUNICIPIO NACIMIENTO: ', this.munic_nacimiento, 'TITULADO TÉCNICO SUPERIOR: ', this.titulado_tecnico_superior])
      resultado.push(['TIPO INGRESO: ', this.tipo_ingreso, 'DESCRIPCIÓN TITULADO TÉCNICO: ', this.descripcion_titulado_superior])
      resultado.push(['ESTADO CIVIL: ', this.estado_civil, 'TITULADO LICENCIATURA: ', this.titulado_licenciatura])
      resultado.push(['DIOMA NATIVO: ', this.idioma_nativo, 'DESCRIPCIÓN TITULADO LICENCIATURA: ', this.descripcion_titulado_licenciatura])
      resultado.push(['IDIOMA REGULAR: ', this.regular, 'NÚMERO REGISTRO: ', this.numero_registro])
      resultado.push(['EMAIL: ', this.email, 'OBSERVACIÓN1: ', this.obs1])
      resultado.push(['NACIONALIDAD: ', this.nacionalidad, 'OBSERVACIÓN2: ', this.obs2])
      resultado.push(['', '', 'OBSERVACIÓN3: ', this.obs3])
      resultado.push(['', '', 'BAJA: ', this.baja])

      doc.setTextColor(10);
      doc.setFontSize(15);

      //inicializacion del ejeY 
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
      doc.setFontSize(14).setFont(undefined, 'bold');
      doc.text(`
                      PERFIL DEL ESTUDIANTE:
                      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      finalY += 20;

      //cabecera de la tabla perfil del Estudiante
      const headers = [['INFORMACIÓN GENERAL', ' ', 'INFORMACIÓN UNIVERSITARIA', ' ']];

      autoTable(doc, {
        startY: finalY + 10,
        head: headers,
        body: resultado,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'justify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          3: { columnWidth: 'auto' },
          1: { columnWidth: 'auto' }
        },
      });
      finalY = doc.lastAutoTable.finalY

      const headersO = [['ORGANIZACIÓN', ' ']];

      let tabla_organizacion = [];

      tabla_organizacion.push(['Organización Matriz', this.organizacion_matriz])
      tabla_organizacion.push(['Organización Departamental', this.organizacion_departamental])
      tabla_organizacion.push(['Organización Regional', this.organizacion_regional])
      tabla_organizacion.push(['Comunidad Sindicato', this.comunidad_sindicato])
      tabla_organizacion.push(['Datos Complementarios', this.otros])


      const headersE = [['EDUCACIÓN', ' ']];
      let tabla_educacion = [];

      tabla_educacion.push(['Unidad Educativa', this.unidad_educativa])
      tabla_educacion.push(['Año Egreso', this.anio_egreso])
      tabla_educacion.push(['Tipo Colegio', this.tipo_colegio])
      tabla_educacion.push(['País Académico', this.pais_academico])
      tabla_educacion.push(['Departamento', this.departamento])
      tabla_educacion.push(['Provincia', this.provincia])
      tabla_educacion.push(['Estado', this.estado_educacion])


      const headersR = [['RESPONSABLE', ' ']];
      let tabla_responsable = [];

      tabla_responsable.push(['Nombre', this.nombre_completo])
      tabla_responsable.push(['Cédula Identidad', this.cedula_responsable])
      tabla_responsable.push(['Celular', this.celular_responsable])
      tabla_responsable.push(['Ocupación', this.ocupacion])
      tabla_responsable.push(['Idioma Que Habla', this.idioma_hablante])
      tabla_responsable.push(['Relación Familiar', this.relacion_responsable])


      //seteado del tamaño de tablas de informacion adicional 
      let wantedTableWidth = 100;
      let pageWidth = doc.internal.pageSize.width;
      let margin = (pageWidth - wantedTableWidth) / 2;

      //tabla organizacion social
      autoTable(doc, {
        startY: finalY + 10,
        head: headersO,
        body: tabla_organizacion,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 5, cellWidth: 'wrap', halign: 'jutify' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        columnStyles: {
          1: { columnWidth: 'auto' }
        },
        tableWidth: doc.internal.pageSize.getWidth() / 4,

      });

      //tabla educacion primaria
      if (this.educacion_primaria['unidad_educativa']) {
        autoTable(doc, {
          startY: finalY + 10,
          head: headersE,
          body: tabla_educacion,
          //theme:'grid',theme:'striped',theme:'plain'
          theme: 'plain',
          tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
          styles: { fontSize: 5, cellWidth: 'wrap', halign: 'jutify' },
          bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
          columnStyles: {
            1: { columnWidth: 'auto' }
          },
          tableWidth: doc.internal.pageSize.getWidth() / 4,
          margin: { left: margin + 135 }
        });
      }

      //si existe datos acerca del Responsable, se muestra la tabla
      if (this.responsable_estudiante['id']) {
        autoTable(doc, {
          startY: finalY + 10,
          head: headersR,
          body: tabla_responsable,
          //theme:'grid',theme:'striped',theme:'plain'
          theme: 'plain',
          tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
          styles: { fontSize: 5, cellWidth: 'wrap', halign: 'jutify' },
          bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
          columnStyles: {
            1: { columnWidth: 'auto' }
          },
          tableWidth: doc.internal.pageSize.getWidth() / 4,
          margin: { left: margin - 5 }
        });
        finalY = doc.lastAutoTable.finalY
      }

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

body {
  font-size: .875rem;
  line-height: 1.25rem;
}

.normal-letter {
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
  content: "+";
  background-color: #31b131;
  background-color: #74a2ff;
}
</style>
