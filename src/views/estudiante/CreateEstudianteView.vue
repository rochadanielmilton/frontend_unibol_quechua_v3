<template>
  <div class="row mt-3 justify-center">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-secondary text-white text-center">
          CREAR ESTUDIANTE
        </div>
        <div class="card-body">
          <form @submit="guardar">
            <div class="input-group mb-3 ">
              <span class="input-group-text"><i class="fa-solid fa-file-lines"></i>
              </span>

              <input type="text" v-if="!mostrar_especial" v-model="ci_estudiante" id="ci_estudiante"
                class="form-control col-md-4" maxlength="50" placeholder="C.I." required>
              <button v-if="!mostrar_especial" class="btn btn-danger" v-on:click="cambiar">
                Carnet-Especial <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button v-else class="btn btn-danger" v-on:click="cambiar">
                Carnet-Normal <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <!-- AÑADIDOS -->
              <input type="text" v-if="mostrar_especial" v-model="ci_especial" id="ci_especial"
                class="form-control col-md-4" maxlength="50" placeholder="C.I. ESPECIAL">

            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="extencion" id="extencion" class="form-control" maxlength="20"
                placeholder="Extención">
            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="nombres" id="nombres" class="form-control" maxlength="50" placeholder="Nombres"
                required>
            </div>


            <div class="input-group mb-3">
              <input type="text" v-model="apellidoP" id="apellidoP" class="form-control" maxlength="50"
                placeholder="Apellido Paterno" required>
              <input type="text" v-model="apellidoM" id="apellidoM" class="form-control" maxlength="50"
                placeholder="Apellido Materno" required>
            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="direccion" id="direccion" class="form-control" maxlength="50"
                placeholder="Dirección" required>
              <input type="number" v-model="celular" id="celular" class="form-control" maxlength="50"
                placeholder="Celular" required>
            </div>

            <div class="input-group mb-3">
              <select class="form-select text-center" id="codigo_carrera" required v-model="codigo_carrera">
                <option value="" selected disabled>
                  ---Carrera---
                </option>
                <option v-for="carrera in carreras" v-bind:value="carrera.codigo_carrera" :key="carrera.codigo_carrera">
                  {{ `${carrera.nombre_carrera}` }}
                </option>
              </select>
            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="anio_ingreso" id="anio_ingreso" class="form-control" maxlength="100"
                placeholder="Año de Ingreso" required>
              <input type="text" v-model="anio_cursado" id="anio_cursado" class="form-control" maxlength="100"
                placeholder="Año Cursado" required>
            </div>

            <div class="input-group mb-3">
              <select class="form-select" id="genero" required v-model="genero">
                <option class="text-center" value="" selected>---Genero---</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div class="input-group mb-3">
              <input type="date" v-model="fecha_nacimiento" id="fecha_nacimiento" class="form-control" maxlength="50"
                placeholder="Fecha Nacimiento" required>
            </div>


            <div class="input-group mb-3">
              <select class="form-select text-center" @change="onChange($event)" id="codigo_carrera" required
                v-model="depa_nacimiento">
                <option value="" selected disabled>
                  ---Departamento Nacimiento---
                </option>
                <option v-for="departamento in departamentos" v-bind:value="departamento.nombre_departamento"
                  :key="departamento.id">
                  {{ `${departamento.nombre_departamento}` }}
                </option>
              </select>
            </div>
            <!-- AÑADIDOS -->
            <div class="input-group mb-3">

              <select class="form-select text-center" id="nombre_provincia" required v-model="prov_nacimiento">
                <option value="" selected disabled>
                  ---Provincia Nacimiento---
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
              <input type="text" v-model="tipo_ingreso" id="tipo_ingreso" class="form-control" maxlength="50"
                placeholder="Tipo Ingreso" required>
            </div>
            <!-- AÑADIDOS -->

            <div class="input-group mb-3">
              FOTOGRAFÍA :
            </div>

            <div class="input-group mb-3">
              <input @change="cargarFoto($event)" accept="image/*" type="file" class="form-control"
                placeholder="Fotografia">
            </div>
            <div class="input-group mb-3">
              <select class="form-select" id="estado_civil" required v-model="estado_civil">
                <option class="text-center" value="" selected>---Estado Civil---</option>
                <option value="casado(a)">Casado(a)</option>
                <option value="soltero(a)">Soltero(a)</option>
              </select>

            </div>
            <div class="input-group mb-3">
              <select class="form-select text-center" id="idioma_nativo" required v-model="idioma_nativo">
                <option value="" selected disabled>
                  ---Idioma Nativo---
                </option>
                <option v-for="idioma in idiomas" v-bind:value="idioma.nombre_idioma" :key="idioma.nombre_idioma">
                  {{ `${idioma.nombre_idioma}` }}
                </option>
              </select>

              <input type="text" v-model="idioma_regular" id="idioma_regular" class="form-control" maxlength="50"
                placeholder="Idioma Regular" required>
            </div>

            <div class="input-group mb-3">
              <input type="text" v-model="email" id="email" class="form-control" maxlength="50" placeholder="Email"
                required>
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
                placeholder="Número de Registro" required>
            </div>

            <!-- AÑADIDOS -->
            <div class="input-group mb-3">
              NÚMERO DE ARCHIVO:
            </div>

            <div class="input-group mb-3">
              <input type="number" v-model="numero_archivo" id="numero_archivo" class="form-control" maxlength="100"
                placeholder="Número de Archivo" required>
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
              <select class="form-select text-center" id="titulado_tecnico_superior" v-model="titulado_tecnico_superior">
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

            <!-- AÑADIDOS -->


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
              <select class="form-select text-center" id="estado" required v-model="estado">
                <option value="" selected>---Estado---</option>
                <option value="habilitado">Habilitado</option>
                <option value="inhabilitado">Inhabilitado</option>
              </select>
            </div>
            <div class="input-group mb-3">
              <input type="text" v-model="descripcion_estado" id="descripcion_estado" class="form-control" maxlength="50"
                placeholder="Descripción Estado">
            </div>
            <div class="input-group mb-3">
              <select class="form-select text-center" id="baja" required v-model="baja">
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
</template>

<script>
// @ is an alias to /src
import { show_alerta, sendRequest } from "../../funciones";
import axios from 'axios';
//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  name: 'CreateEstudianteView',
  data() {
    return {
      ci_estudiante: '', extencion: '', nombres: '', apellidoP: '', apellidoM: '', direccion: '', celular: '', anio_ingreso: '', anio_cursado: '', genero: '', fecha_nacimiento: '', depa_nacimiento: '', prov_nacimiento: '', munic_nacimiento: '', tipo_ingreso: '',
      estado_civil: '', idioma_nativo: '', idioma_regular: '', email: '', nacionalidad: '', numero_archivo: '', numero_registro: '', obs1: '', obs2: '', obs3: '', estado: '', descripcion_estado: '', baja: '', codigo_carrera: '',
      homologacion: '', estado_homologacion: '', convalidacion: '', estado_convalidacion: '', egresado: '', estado_egresado: '',
      titulado_tecnico_superior: '', descripcion_titulado_superior: '', titulado_licenciatura: '', descripcion_titulado_licenciatura: '',
      ci_especial: '', photography: '', fileFoto: null,
      idiomas: null, carreras: null, departamentos: null, provincias: null, principal: '', mostrar_especial: false,
      url: BASE_URL + '/estudiantes/estudiantes/'
    }
  }
  , mounted() {
    //cargando los parámetros necesarios para crear un Nuevo Estudiante
    this.getIdiomas();
    this.getDepartamentos();
    this.getProvincias();
    this.getCarreras();
    this.principal = '/estudiantes';

  }
  , methods: {
    cargarFoto(event) {
      this.photography = event.target.files[0].name;
      this.fileFoto = event.target.files[0];
    },
    //metodo para obtener las provincias de un departamento seleccionado
    onChange(event) {
      axios.get(BASE_URL + '/parametros/obtenerProvincias/' + event.target.value + '/')
        .then(
          response => (
            this.provincias = response.data
          )
        );
    },
    cambiar() {
      this.mostrar_especial = !this.mostrar_especial;
    },
    //metodo guardar la informacion de un Nuevo Estudiante
    async guardar() {
      if (this.ci_especial !== '') {
        const sin_complemento = this.ci_especial.split('-')[0];
        this.ci_estudiante = sin_complemento;
        //console.log('sin_complemento:' + sin_complemento);
      }
      event.preventDefault();

      if (this.extencion.trim() === 'NO VACIO') {
        show_alerta('La extension no puede ser vacio', 'warning', 'extencion');
      }
      else {
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
          numero_registro: this.numero_registro,

          homologacion: this.homologacion,
          estado_homologacion: this.estado_homologacion,
          convalidacion: this.convalidacion,
          estado_convalidacion: this.estado_convalidacion,
          titulado_tecnico_superior: this.titulado_tecnico_superior,
          descripcion_titulado_superior: this.descripcion_titulado_superior,
          titulado_licenciatura: this.titulado_licenciatura,
          descripcion_titulado_licenciatura: this.descripcion_titulado_licenciatura,

          obs1: this.obs1,
          obs2: this.obs2,
          obs3: this.obs3,

          estado: this.estado,
          descripcion_estado: this.descripcion_estado,
          baja: this.baja,
          codigo_carrera: this.codigo_carrera,
          ci_especial: this.ci_especial
        };

        await sendRequest('POST', parametros, this.url, 'Estudiante Guardado Exitosamente!', this.principal);
        this.$router.push('/estudiantes')
      }
    },
    getIdiomas() {
      axios.get(BASE_URL + '/parametros/idiomasOriginarios/')
        .then(
          response => (
            this.idiomas = response.data
          )
        );
    },
    getDepartamentos() {
      axios.get(BASE_URL + '/parametros/departamentos/')
        .then(
          response => (
            this.departamentos = response.data
          )
        );
    },
    getProvincias() {
      axios.get(BASE_URL + '/parametros/provincias/')
        .then(
          response => (
            this.provincias = response.data
          )
        );
    },
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
  }
}
</script>
<style>
body {
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>
