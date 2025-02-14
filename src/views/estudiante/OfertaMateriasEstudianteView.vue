<template>
  <div class="container-fluid" id="contenido-global" v-if="ofertaMaterias.length > 0">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="mb-3 fw-bold">
          <div class="mb-3 fs-5 text-center">
            OFERTA DE MATERIAS PARA LA INSCRIPCION:
          </div>
          <div class="fs-6">
            APELLIDOS Y NOMBRES: {{ `${apellidoP} ${apellidoM} ${nombres}` }}
          </div>

          <div class="fs-6" v-if="ci_especial">
            CÉDULA DE IDENTIDAD: {{ `${ci_estudiante} ${ci_especial}` }}
          </div>

          <div class="fs-6" v-else>
            CÉDULA DE IDENTIDAD: {{ `${ci_estudiante}` }}
          </div>

          <div class="fs-6">
            CÓDIGO DE CARRERA: {{ `${codigo_carrera}` }}
          </div>

          <div class="fs-6">
            NOMBRE DE CARRERA: {{ `${nombre_carrera}` }}
          </div>

          <div class="fs-6">
            AÑO CURSADO: {{ `${anio_cursado}` }}
          </div>

        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="table-responsive text-center">
          <table class="table table-bordered table-hover table-striped col-12">
            <thead class="pb-4 table-light">
              <tr>
                <th>
                  #
                </th>
                <th class="d-none d-xs-block">
                  CODIGO CARRERA
                </th>
                <th class="d-none d-sm-block">
                  CODIGO ASIGNATURA
                </th>
                <th>
                  NOMBRE DE ASIGNATURA
                </th>
                <th class="d-none d-md-block">
                  AÑO ASIGNADO
                </th>
                <th>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody class="table-group-divider" id="contenido">
              <tr v-for="materia, i  in ofertaMaterias" :key="materia">
                <td>{{ i + 1 }}</td>
                <td class="d-none d-xs-block">{{ materia.codigo_carrera }}</td>
                <td class="d-none d-sm-block">{{ materia.codigo_asignatura }}</td>
                <td>{{ materia.nombre_asignatura }}</td>
                <td class="d-none d-md-block">{{ materia.anio_asignado }}</td>

                <td>
                  <div class="form-check noselect">

                    <input class="form-check-input" type="checkbox" :id="id" :checked="estado1" :value="materia.id"
                      v-model="asignaturas" @change="addAsignatura()" />
                    <label class="form-check-label" :for="id">
                      <slot />
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-2 offset-lg-9">
        <div class="mb-3 mt-3 pa-3">
          <div class="d-grid col-10-mx-auto offset-md-0">
            <button class="btn btn-success col-auto" @click="guardarInscripcion">
              INSCRIBIR
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
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
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { show_alerta } from '../../funciones';
import { generarReporteInscripcionRegulares, generarReporteInscripcionEgresados } from '../../reportes';
//para usar navegacion en la vista
import { useRoute } from "vue-router";

//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



//definicion de variable global para el consumo de servicios API-REST
let BASE_URL = import.meta.env.VITE_BASE_URL;
//deficion de variables globales para el uso en el reporte pdf
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;
export default {
  name: 'OfertaMateriasView',
  setup() {

  },
  data() {
    return {
      estudiantes: null, asignaturas: [], principal: '',
      ci_estudiante: '', nombres: '', apellidoP: '', apellidoM: '', codigo_carrera: '', nombre_carrera: '', anio_cursado: '', inscrito_gestion: '', ci_especial: '',
      anio_ingreso: '',
      message: '', anio_actual: '',
      ofertaMaterias: [], estado1: false,
      datos_estudiante_sexto_anio: {},
      ruta: '../loading.gif',
      url: BASE_URL + '/administracion/obtenerAsignaturasNoCursadas',
      sexto_anio: BASE_URL + '/administracion/inscripcionParaDefensa'
    }
  },
  async mounted() {
    const route = useRoute();
    this.id = route.params.id;

    this.url = this.url + '/' + this.id + '/';
    await console.log(this.getAsignaturasNoCursadas());
    //ruta de navegacion despues de la accion eliminar
    this.principal = '/estudiantes';
  },
  methods: {
    //obtener la Oferta de Asignaturas para el Estudiante
    async getAsignaturasNoCursadas() {
      await axios.get(this.url)
        .then(
          response => {
            if (response.data['estudiante']['inscrito_gestion'] === 'no') {
              this.datos_estudiante_sexto_anio = response.data;
              this.ci_estudiante = response.data['estudiante']['ci_estudiante'],
                this.ci_especial = response.data['estudiante']['ci_especial'] ? response.data['estudiante']['ci_especial'] : '',
                this.nombres = response.data['estudiante']['nombres'],
                this.apellidoP = response.data['estudiante']['apellidoP'],
                this.apellidoM = response.data['estudiante']['apellidoM'],
                this.codigo_carrera = response.data['estudiante']['codigo_carrera'],
                this.nombre_carrera = response.data['estudiante']['nombre_carrera'],
                this.anio_cursado = response.data['estudiante']['anio_cursado'],
                this.anio_ingreso = response.data['estudiante']['anio_ingreso'],
                this.ofertaMaterias = response.data['oferta_materias']
            } else {
              show_alerta('El estudiante ya se encuentra inscrito', 'info');
              this.$router.push('/estudiante/habilitados');
            }
            if (response.data['oferta_materias'].length === 0) {
              this.message = response.data['message'],
                this.anio_actual = response.data['anio_actual'];

              const url = this.sexto_anio + '/' + response.data['estudiante']['ci_estudiante'] + '/';
              this.inscribirEstudianteSextoAnio(url);
            }

          }
        ).catch(error => {
          console.log(error)
          show_alerta(error, 'error')
        });
    },
    addAsignatura() {
      //console.log(this.asignaturas);
    },
    //metodo para inscribir a Un Estudiante de Sexto Año(Egresado)
    async inscribirEstudianteSextoAnio(url) {

      await axios.get(url).then(resultado => {
        const datos = resultado.data;
        const { estudiantes, fecha_emision, numero_archivo, numero_boleta } = datos;

        const modalidad_egreso = [];
        const anio_actual = datos['anio_actual'];

        modalidad_egreso.push([`DEFENSA DE GRADO GESTIÓN ${anio_actual}`, 'PENDIENTE']);

        generarReporteInscripcionEgresados(modalidad_egreso, estudiantes, fecha_emision, numero_boleta, numero_archivo, anio_actual);

        this.$router.push('/habilitados-regulares');
      });

    }
    //guardar las Asignaturas seleccionadas   
    , async guardarInscripcion() {

      const parametros = {
        ci_estudiante: this.ci_estudiante,
        ids_mallas: this.asignaturas
      };

      const ruta = BASE_URL + '/administracion/inscribirEstudiante/';

      await axios({ method: 'POST', url: ruta, data: parametros }).then(resultado => {
        const status = resultado.status;

        const datos = resultado.data['asignaturas_inscritas'];
        const asignaturas_anterior = resultado.data['asignaturas_gestion_anterior'];
        const datos_estudiante = resultado.data['estudiante'];
        const fecha_emision = resultado.data['fecha_emision'];
        const numero_boleta = resultado.data['numero_boleta'];
        const numero_archivo = resultado.data['numero_archivo'];
        let asignaturas_gestion_anterior = [];
        let asignaturas_tabla = [];
        for (let index = 0; index < datos.length; index++) {
          asignaturas_tabla.push([index + 1, datos[index].codigo_asignatura, datos[index].nombre_asignatura, 'N'])
        }
        for (let index = 0; index < asignaturas_anterior.length; index++) {
          asignaturas_gestion_anterior.push([index + 1, asignaturas_anterior[index].codigo_asignatura, asignaturas_anterior[index].nombre_asignatura, asignaturas_anterior[index].nota_num_final,
          asignaturas_anterior[index].estado_gestion_espaniol, asignaturas_anterior[index].observacion]);
        }
        //generar reporte de Inscripcion(boleta de Inscripcion)            
        generarReporteInscripcionRegulares(asignaturas_tabla, asignaturas_gestion_anterior, datos_estudiante, fecha_emision, numero_boleta, numero_archivo);

        const mensaje = 'Estudiante inscrito Exitosamente!';
        if (status === 200) {
          show_alerta(mensaje, 'success');
        }
      });

      if (this.anio_ingreso === '2024') {
        this.$router.push('/habilitados-nuevos');
      } else {
        this.$router.push('/habilitados-regulares');
      }
    },
    //generar reporte de Inscripcion Estudiantes regulares
    async generarReporteInscripcionRegulares(asignaturas_tabla, asignaturas_gestion_anterior, datos_estudiante, fecha_emision, numero_boleta, numero_archivo) {
      //inicializacion de parametros para el reporte pdf
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

      doc.setFontSize(12);

      const headers = [['NRO', 'CÓDIGO', 'ASIGNATURA PROGRAMADA', 'TIPO', 'OBSERVACIÓN']];
      const headersGestionAnterior = [['NRO', 'CÓDIGO', 'NOMBRE ASIGNATURA', 'NOTA FINAL', 'RESULTADO', 'OBSERVACIÓN']];

      doc.setTextColor(10);
      doc.setFontSize(15);

      let finalY = doc.lastAutoTable.finalY || 10

      //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
      await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
      await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);

      //formato alternativo
      // await doc.addImage("../../ministerio.jpg", "JPG", 15, finalY+5, 60, 60);
      // await doc.addImage("../../logotipo-unibol-quechua.png", "PNG", doc.internal.pageSize.width-65, finalY+5 , 50, 50);

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
                        BOLETA DE INSCRIPCIÓN 2025
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
                       
                       `, -20, finalY);

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

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        ASIGNATURAS GESTIÓN 2024
                        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

      autoTable(doc, {
        startY: finalY + 20,
        head: headersGestionAnterior,
        body: asignaturas_gestion_anterior,
        //theme:'grid',theme:'striped',theme:'plain'
        theme: 'plain',
        tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
        styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
        bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
        padding: 1

      });
      finalY = doc.lastAutoTable.finalY
      finalY += 30;

      doc.setTextColor(10);
      doc.setFontSize(10).setFont(undefined, 'bold');
      doc.text(`
                        PROGRAMACIÓN DE ASIGNATURAS GESTIÓN 2025
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
        padding: 1

      });
      finalY = doc.lastAutoTable.finalY
      finalY += 60;

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

      //forma alternativa  para la generacion del pdf
      //await doc.save(`inscripcion_${this.apellidoP} ${this.apellidoM} ${this.nombres}.pdf`); 

      await window.open(doc.output('bloburl'), '_blank');
    }
  }
}
</script>
