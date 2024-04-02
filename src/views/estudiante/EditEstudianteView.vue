<template>
  <div class="container">
    <div class="row mt-3 justify-center">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header bg-secondary text-white text-center">
            EDITAR ESTUDIANTE
          </div>
          <div class="card-body">
            <form @submit="guardar">

              <div class="input-group mb-3">
                C.I. :
              </div>

              <div class="input-group mb-3 ">
                <div v-if="ci_especial" :value="ci_especial" id="ci_especial"
                  class="input-group mb-3 d-inline p-2 bg-primary text-white rounded">
                  {{ `${ci_estudiante} ${ci_especial}` }}
                </div>
                <div v-else id="ci_estudiante" :value="ci_estudiante"
                  class="input-group mb-3 d-inline p-2 bg-primary text-white rounded">
                  {{ ci_estudiante }}
                </div>
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="extencion" id="extencion" class="form-control" maxlength="100"
                  placeholder="Extención">
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="nombres" id="nombres" class="form-control" maxlength="100"
                  placeholder="Nombres" required>
              </div>


              <div class="input-group mb-3">
                <input type="text" v-model="apellidoP" id="apellidoP" class="form-control" maxlength="100"
                  placeholder="Apellido Paterno" required>
                <input type="text" v-model="apellidoM" id="apellidoM" class="form-control" maxlength="100"
                  placeholder="Apellido Materno" required>
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="direccion" id="direccion" class="form-control" maxlength="100"
                  placeholder="Dirección">
                <input type="number" v-model="celular" id="celular" class="form-control" maxlength="100"
                  placeholder="Celular" required>
              </div>

              <div class="input-group mb-3">
                <select class="form-select text-center" id="nombre_carrera" required v-model="codigo_carrera">
                  <option value="" selected disabled>
                    ---Carrera---
                  </option>
                  <option v-for="carrera in carreras" :value="carrera.codigo_carrera" :key="carrera.codigo_carrera">
                    {{ `${carrera.nombre_carrera}` }}
                  </option>
                </select>
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="anio_ingreso" id="anio_ingreso" class="form-control" maxlength="100"
                  placeholder="Año de Ingreso" required>

                <select class="form-select text-center" id="anio_cursado" v-model="anio_cursado">
                  <option :value="anio_cursado" selected>{{ anio_cursado }}
                  </option>
                  <option v-for="anio in anios_carreras" v-bind:value="anio.nombre_anio" :key="anio.id">
                    {{ `${anio.nombre_anio}` }}
                  </option>
                </select>
              </div>

              <div class="input-group mb-3">
                <select class="form-select" id="genero" required v-model="genero">
                  <option class="text-center" value="" selected>---Género---</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div class="input-group mb-3">
                <input type="date" v-model="fecha_nacimiento" id="fecha_nacimiento" class="form-control" maxlength="100"
                  placeholder="Fecha Nacimiento" required>
              </div>


              <div class="input-group mb-3">

                <select class="form-select text-center" @change="onChange($event)" id="depa_nacimiento"
                  v-model="depa_nacimiento">
                  <option :value="depa_nacimiento" selected>{{ depa_nacimiento }}
                    <!-- ---Departamento Nacimiento--- -->
                  </option>
                  <option v-for="departamento in departamentos" v-bind:value="departamento.nombre_departamento"
                    :key="departamento.id">
                    {{ `${departamento.nombre_departamento}` }}
                  </option>
                </select>
              </div>


              <!-- AÑADIDOS -->
              <div class="input-group mb-3">

                <select class="form-select text-center" id="prov_nacimiento" v-model="prov_nacimiento">
                  <option :value="prov_nacimiento" selected>{{ prov_nacimiento }}
                  </option>
                  <option v-for="provincia in provincias" v-bind:value="provincia.nombre_provincia" :key="provincia.id">
                    {{ `${provincia.nombre_provincia}` }}
                  </option>
                </select>
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="munic_nacimiento" id="munic_nacimiento" class="form-control" maxlength="100"
                  placeholder="Municipio Nacimiento">
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="tipo_ingreso" id="tipo_ingreso" class="form-control" maxlength="55"
                  placeholder="Tipo Ingreso">
              </div>
              <!-- AÑADIDOS -->

              <div class="input-group mb-3">
                <input @change="cargarFoto($event)" accept="image/*" type="file" class="form-control"
                  placeholder="Fotografía">
              </div>
              <div class="input-group mb-3">
                <select class="form-select" id="estado_civil" v-model="estado_civil">
                  <option class="text-center" :value="estado_civil" selected>
                    <!-- ---Estado Civil--- -->
                    {{ estado_civil }}
                  </option>
                  <option value="casado(a)">Casado(a)</option>
                  <option value="soltero(a)">Soltero(a)</option>
                </select>
              </div>
              <div class="input-group mb-3">
                <select class="form-select text-center" id="idioma_nativo" v-model="idioma_nativo">
                  <option :value="idioma_nativo" selected disabled>
                    {{ idioma_nativo }}
                    <!-- ----------Idioma Nativo------------ -->
                  </option>
                  <option v-for="idioma in idiomas" v-bind:value="idioma.nombre_idioma" :key="idioma.nombre_idioma">
                    {{ `${idioma.nombre_idioma}` }}
                  </option>
                </select>
                <input type="text" v-model="idioma_regular" id="idioma_regular" class="form-control" maxlength="100"
                  placeholder="Idioma Regular">
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="email" id="email" class="form-control" maxlength="100" placeholder="Email">
              </div>

              <div class="input-group mb-3">
                <select class="form-select" id="nacionalidad" v-model="nacionalidad">
                  <option class="text-center" value="" selected>---Nacionalidad---</option>
                  <option value="Boliviano(a)">Boliviano(a)</option>
                  <option value="Extranjero(a)">Extranjero(a)</option>
                </select>
              </div>

              <div class="input-group mb-3">
                NÚMERO DE REGISTRO:
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="numero_registro" id="numero_registro" class="form-control" maxlength="100"
                  placeholder="Número de Registro">
              </div>

              <!-- AÑADIDOS -->
              <div class="input-group mb-3">
                NÚMERO DE ARCHIVO:
              </div>

              <div class="input-group mb-3">
                <input type="number" v-model="numero_archivo" id="numero_archivo" class="form-control" maxlength="100"
                  placeholder="Número de Archivo">
              </div>

              <!-- AÑADIDOS -->

              <div class="input-group mb-3">
                <input type="text" v-model="homologacion" id="homologacion" class="form-control" maxlength="100"
                  placeholder="Homologación">
              </div>
              <div class="input-group mb-3">
                <input type="text" v-model="estado_homologacion" id="estado_homologacion" class="form-control"
                  maxlength="100" placeholder="Estado Homologación">
              </div>
              <div class="input-group mb-3">
                <input type="text" v-model="convalidacion" id="convalidacion" class="form-control" maxlength="100"
                  placeholder="Convalidación">
              </div>
              <div class="input-group mb-3">
                <input type="text" v-model="estado_convalidacion" id="estado_convalidacion" class="form-control"
                  maxlength="100" placeholder="Estado Convalidación">
              </div>


              <div class="input-group mb-3">
                <select class="form-select text-center" id="titulado_tecnico_superior"
                  v-model="titulado_tecnico_superior">
                  <option value="" selected>-------Titulado Técnico Superior-------</option>
                  <option value="si">Si</option>
                  <option value="no">No</option>
                </select>

              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="descripcion_titulado_superior" id="descripcion_titulado_superior"
                  class="form-control" maxlength="255" placeholder="Descripción Titulado Superior">
              </div>
              <div class="input-group mb-3">
                <select class="form-select text-center" id="titulado_licenciatura" v-model="titulado_licenciatura">
                  <option value="" selected>-------Titulado Licenciatura-------</option>
                  <option value="si">Si</option>
                  <option value="no">No</option>
                </select>
              </div>


              <div class="input-group mb-3">
                <input type="text" v-model="descripcion_titulado_licenciatura" id="descripcion_titulado_licenciatura"
                  class="form-control" maxlength="255" placeholder="Descripción Titulado Licenciatura">
              </div>


              <div class="input-group mb-3">
                OBSERVACIONES:
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="obs1" id="obs1" class="form-control" maxlength="100"
                  placeholder="Obersvacion 1">
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="obs2" id="obs2" class="form-control" maxlength="100"
                  placeholder="Observacion 2">
              </div>

              <div class="input-group mb-3">
                <input type="text" v-model="obs3" id="obs3" class="form-control" maxlength="100"
                  placeholder="Observacion 3">
              </div>

              <div class="input-group mb-3">
                <select class="form-select text-center" id="estado" v-model="estado">
                  <option value="" selected>---Estado---</option>
                  <option value="habilitado">Habilitado</option>
                  <option value="inhabilitado">Inhabilitado</option>
                </select>
              </div>
              <div class="input-group mb-3">
                <input type="text" v-model="descripcion_estado" id="descripcion_estado" class="form-control"
                  maxlength="100" placeholder="Descripción Estado">
              </div>
              <div class="input-group mb-3">
                <select class="form-select text-center" id="baja" v-model="baja">
                  <option value="" selected>---Baja---</option>
                  <option value="si">Si</option>
                  <option value="no">No</option>
                </select>

              </div>

              <div class="d-grid col-6-mx-auto">
                <button class="btn btn-success">
                  <i class="fa-solid fa-floppy-disk"></i> Guardar</button>
              </div>
            </form>
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

import axios from 'axios';
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'EditEstudianteView',
  data() {
    return {
      ci_estudiante: 0, extencion: '', nombres: '', apellidoP: '', apellidoM: '', direccion: '', celular: 0, anio_ingreso: '', anio_cursado: '', genero: '', fecha_nacimiento: '', depa_nacimiento: '', prov_nacimiento: '', munic_nacimiento: '', tipo_ingreso: '',
      fotografia: '', estado_civil: '', idioma_nativo: '', idioma_regular: '', email: '', nacionalidad: '', numero_archivo: '',
      homologacion: '', estado_homologacion: '', convalidacion: '', estado_convalidacion: '', egresado: '', estado_egresado: '',
      titulado_tecnico_superior: '', descripcion_titulado_superior: '', titulado_licenciatura: '', descripcion_titulado_licenciatura: '',
      numero_registro: 0, obs1: '', obs2: '', obs3: '', estado: '', descripcion_estado: '', baja: '', codigo_carrera: 0, nombre_carrera: '',
      ci_especial: '', photography: '', fileFoto: null,
      idiomas: null, carreras: null, principal: '', provincias: null, departamentos: null, noencontrado: true,
      anios_carreras: '',
      url: BASE_URL + '/estudiantes/estudiantes'
    }
  },
  mounted() {
    const route = useRoute();
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';
    this.getEstudiante();
    this.getIdiomas();
    this.getCarreras();
    this.getProvincias();
    this.getAnioCarrera();
    this.getDepartamentos();

    this.principal = '/estudiantes';
  },
  methods: {
    cargarFoto(event) {
      this.photography = event.target.files[0].name;
      this.fileFoto = event.target.files[0];
    },
    //metodo para obtener las provincias de un determinado departamento
    onChange(event) {
      axios.get(BASE_URL + '/parametros/obtenerProvincias/' + event.target.value + '/')
        .then(
          response => (
            this.provincias = response.data
          )
        );
    },
    //obtener un Estudiante dado su ci
    getEstudiante() {
      axios.get(this.url).then(
        response => (
          this.nombres = response.data['nombres'],
          this.ci_estudiante = response.data['ci_estudiante'],
          this.extencion = response.data['extencion'],

          this.apellidoP = response.data['apellidoP'],
          this.apellidoM = response.data['apellidoM'],
          this.direccion = response.data['direccion'],
          this.celular = response.data['celular'],

          this.anio_ingreso = response.data['anio_ingreso'],
          this.anio_cursado = response.data['anio_cursado'],

          this.genero = response.data['genero'] ? response.data['genero'] : '',
          this.fecha_nacimiento = response.data['fecha_nacimiento'],
          this.depa_nacimiento = response.data['depa_nacimiento'],
          this.prov_nacimiento = response.data['prov_nacimiento'],

          this.munic_nacimiento = response.data['munic_nacimiento'],

          this.tipo_ingreso = response.data['tipo_ingreso'],

          this.fotografia = response.data['fotografia'],

          this.estado_civil = response.data['estado_civil'] ? response.data['estado_civil'] : '',
          this.idioma_nativo = response.data['idioma_nativo'] ? response.data['idioma_nativo'] : '',
          this.idioma_regular = response.data['idioma_regular'],
          this.email = response.data['email'],

          this.nacionalidad = response.data['nacionalidad'] ? response.data['nacionalidad'] : '',
          this.numero_archivo = response.data['numero_archivo'],

          this.homologacion = response.data['homologacion'],
          this.estado_homologacion = response.data['estado_homologacion'],
          this.convalidacion = response.data['convalidacion'],
          this.estado_convalidacion = response.data['estado_convalidacion'],


          this.titulado_tecnico_superior = response.data['titulado_tecnico_superior'],
          this.descripcion_titulado_superior = response.data['descripcion_titulado_superior'],
          this.titulado_licenciatura = response.data['titulado_licenciatura'],
          this.descripcion_titulado_licenciatura = response.data['descripcion_titulado_licenciatura'],


          this.numero_registro = response.data['numero_registro'],
          this.obs1 = response.data['obs1'],
          this.obs2 = response.data['obs2'],
          this.obs3 = response.data['obs3'],


          this.estado = response.data['estado'],
          this.descripcion_estado = response.data['descripcion_estado'],
          this.baja = response.data['baja'],
          this.codigo_carrera = response.data['codigo_carrera'],
          this.nombre_carrera = response.data['nombre_carrera'],
          this.ci_especial = response.data['ci_especial']
        )
      ).catch(error => {
        show_alerta(error, 'error')
      });
    },
    //metodo para obtener la lista de Idiomas Originarios
    getIdiomas() {
      axios.get(BASE_URL + '/parametros/idiomasOriginarios/')
        .then(
          response => (
            this.idiomas = response.data
          )
        ).catch(error => {
          show_alerta(error, 'error')
        });
    },
    //metodo para obtener  la lista de Carreras
    getCarreras() {
      axios.get(BASE_URL + '/parametros/carreras/')
        .then(
          response => (
            this.carreras = response.data
          )
        ).catch(error => {
          show_alerta(error, 'error')
        });
    },
    //metodo para obtener la lista de Provincias
    async getProvincias() {
      await axios.get(BASE_URL + '/parametros/provincias/')
        .then(
          response => (
            this.provincias = response.data
          )
        );
    },
    //metodo para obtener las gestiones académicas
    async getAnioCarrera() {
      await axios.get(BASE_URL + '/parametros/aniosCarreras/')
        .then(
          response => (
            this.anios_carreras = response.data
          )
        );
    },
    //metodo para obtener la lista de departamentos
    async getDepartamentos() {
      await axios.get(BASE_URL + '/parametros/departamentos/')
        .then(
          response => (
            this.departamentos = response.data
          )
        );
    },
    //guarda los datos de Un Estudiante despues de su edicion
    async guardar() {
      event.preventDefault();
      if (this.nombres.trim() === '') {
        show_alerta('El nombre no puede ser vacio', 'warning', 'nombre');
      } else {

        const parametros = {
          ci_estudiante: this.ci_estudiante,
          extencion: this.extencion,
          nombres: this.nombres,
          apellidoP: this.apellidoP,
          apellidoM: this.apellidoM,
          direccion: this.direccion,
          celular: this.celular,
          anio_ingreso: this.anio_ingreso,
          anio_cursado: this.anio_cursado,

          genero: this.genero, fecha_nacimiento: this.fecha_nacimiento,
          depa_nacimiento: this.depa_nacimiento,
          prov_nacimiento: this.prov_nacimiento,

          munic_nacimiento: this.munic_nacimiento,

          tipo_ingreso: this.tipo_ingreso,
          fotografia: this.photography,

          estado_civil: this.estado_civil,
          idioma_nativo: this.idioma_nativo,
          idioma_regular: this.idioma_regular,
          email: this.email,
          nacionalidad: this.nacionalidad,

          numero_archivo: this.numero_archivo,

          homologacion: this.homologacion,
          estado_homologacion: this.estado_homologacion,
          convalidacion: this.convalidacion,
          estado_convalidacion: this.estado_convalidacion,
          titulado_tecnico_superior: this.titulado_tecnico_superior,
          descripcion_titulado_superior: this.descripcion_titulado_superior,
          titulado_licenciatura: this.titulado_licenciatura,
          descripcion_titulado_licenciatura: this.descripcion_titulado_licenciatura,

          numero_registro: this.numero_registro,

          obs1: this.obs1,
          obs2: this.obs2,
          obs3: this.obs3,

          estado: this.estado,
          descripcion_estado: this.descripcion_estado,
          baja: this.baja,

          codigo_carrera: this.codigo_carrera,
          ci_especial: this.ci_especial
        };

        await sendRequest('PUT', parametros, this.url, 'Estudiante Actualizado Exitosamente!', this.principal);
        this.$router.push('/estudiantes')
      }
    }
  }
}
</script>
<style scoped>
body {
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>
