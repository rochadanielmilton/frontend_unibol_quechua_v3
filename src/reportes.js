import Swal from "sweetalert2";
//librerias para la exportacion en pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//variables globales para el logo de Ministerio, y de la Institución
let MINISTERIO = import.meta.env.VITE_MINISTERIO;
let LOGO_UNI = import.meta.env.VITE_LOGO_UNI;

export function show_alerta(mensaje, icono, foco = '') {
  if (foco !== '') {
    document.getElementById(foco).focus();
  }
  Swal.fire({
    title: mensaje,
    icon: icono,
    customClass: { confirmButton: 'btn btn-primary', popup: 'animated zoomin' },
    buttonsStyling: false
  });
}
export async function generarReporteInscripcionEgresados(modalidad_egreso, datos_estudiante, fecha_emision, numero_boleta, numero_archivo, anio_actual) {
  //inicializacion del reporte  
  const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

  doc.setFontSize(12);
  //cabecera de tabla de datos
  const headersModalidadEgreso = [['MODALIDAD DE EGRESO', 'RESULTADO']];

  let finalY = doc.lastAutoTable.finalY || 10

  //añadir imagenes con archivos locales
  //await doc.addImage("../../logotipo-unibol-quechua.png", "PNG", doc.internal.pageSize.width-80, finalY+20, 50, 50);
  //await doc.addImage("../../caracteristicas-bosques-tropicales.jpg", "JPG", 30, finalY+20, 50, 50);

  //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
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

  let cedula_identidad = datos_estudiante.ci_especial ? `${datos_estudiante.ci_estudiante} ${datos_estudiante.ci_especial}` : datos_estudiante.ci_estudiante;

  doc.setTextColor(100);
  doc.text(`
                       ${datos_estudiante.apellidoP} ${datos_estudiante.apellidoM} ${datos_estudiante.nombres}                        
                       ${cedula_identidad}                       
                       ${datos_estudiante.numero_registro}                                 
                       ${datos_estudiante.nombre_carrera}
                       ${fecha_emision}                     
                       `, (doc.internal.pageSize.getWidth() / 2) - 150, finalY);



  finalY += 45;

  let wantedTableWidth = 279;
  let pageWidth = doc.internal.pageSize.width;
  let margin = (pageWidth - wantedTableWidth) / 2;


  //CABECERA PARA LA MODALIDAD DE EGRESO, SIMILAR A LA DE ESTUDIANTES NUEVOS
  autoTable(doc, {
    startY: finalY + 30,
    head: headersModalidadEgreso,
    body: modalidad_egreso,
    //theme:'grid',theme:'striped',theme:'plain'
    theme: 'plain',
    tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
    styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
    bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
    margin: { left: margin - 30 },
    //padding:1
  });

  finalY = doc.lastAutoTable.finalY
  finalY += 90;


  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
                        FIRMA ESTUDIANTE
                        `, 20, finalY);

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

  finalY += 205;
  //console.log('este es el alto' + doc.internal.pageSize.height);

  doc.setTextColor(10);
  doc.setFontSize(6).setFont(undefined, 'bold');
  doc.text(`
                      *Documento solo válido para tramite interno                                  
                        `, 30, finalY);

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'bold');
  doc.text(`
                        Arch: ${numero_archivo}
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY + 50, null, null, "center");

  finalY += 10;

  //forma alternativa para generar el pdf
  //await doc.save('inscripcion.pdf');  
  await window.open(doc.output('bloburl'), '_blank');

}


export async function generarReporteInscripcionNuevos(asignaturas_tabla, modalidad_de_ingreso, datos_estudiante, fecha_emision, numero_boleta, numero_archivo) {

  //inicialización de los parametros del reporte
  const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

  doc.setFontSize(12);

  //EJEMPLO QUE ESTA AL FINAL DE COMO PASAR LOS HEADERS Y BODY  
  const headers = [['NRO', 'CODIGO', 'ASIGNATURA PROGRAMADA', 'TIPO', 'OBSERVACION']];
  const headersModalidadIngreso = [['MODALIDAD DE INGRESO', 'RESULTADO']];


  doc.setTextColor(10);
  doc.setFontSize(15);

  let finalY = doc.lastAutoTable.finalY || 10

  //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
  await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
  await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);

  //formato alternativo de cabeceras de reporte
  // await doc.addImage("../../ministerio.jpg", "JPG",  doc.internal.pageSize.width-65, finalY+5, 60, 60);                    
  // await doc.addImage("../../logotipo-unibol-quechua.png", "PNG", 15, finalY+5 , 50, 50);

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

  let cedula_identidad = datos_estudiante.ci_especial ? `${datos_estudiante.ci_estudiante} ${datos_estudiante.ci_especial}` : datos_estudiante.ci_estudiante;

  doc.setTextColor(100);
  doc.text(`
                       ${datos_estudiante.apellidoP} ${datos_estudiante.apellidoM} ${datos_estudiante.nombres}                        
                       ${cedula_identidad}                       
                       ${datos_estudiante.numero_registro}                                 
                       ${datos_estudiante.nombre_carrera}
                       ${fecha_emision}                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 150, finalY);

  finalY += 45;

  let wantedTableWidth = 279;
  let pageWidth = doc.internal.pageSize.width;
  let margin = (pageWidth - wantedTableWidth) / 2;

  //CABECERA PARA LA MODALIDAD DE INGRESO DE NUEVOS ESTUDIANTES 2024
  autoTable(doc, {
    startY: finalY + 30,
    head: headersModalidadIngreso,
    body: modalidad_de_ingreso,
    //theme:'grid',theme:'striped',theme:'plain'
    theme: 'plain',
    tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
    styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
    bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
    margin: { left: margin - 30 },
    //columnStyles:{color}
    //padding:1
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
    margin: { left: margin - 30 },
    //columnStyles:{color}
    //padding:1
  });
  finalY = doc.lastAutoTable.finalY
  finalY += 80;

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
                        FIRMA ESTUDIANTE
                        `, 20, finalY);

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

  finalY += 55;
  console.log('este es el alto' + doc.internal.pageSize.height);

  doc.setTextColor(10);
  doc.setFontSize(6).setFont(undefined, 'bold');
  doc.text(`
                      Documento solo válido para tramite interno                                  
                      *Ajuste: Asignaturas validadas con la Resolución Ministerial N°0155/2023
                      *N: Gestión Asignatura Normal                        
                        `, 30, finalY);

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'bold');
  doc.text(`
                        Arch: ${numero_archivo}
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY + 50, null, null, "center");

  finalY += 10;

  //opcion alternativa para generar el pdf
  //await doc.save('inscripcion.pdf');    

  await window.open(doc.output('bloburl'), '_blank');

}

export async function generarReporteInscripcionRegulares(asignaturas_tabla, asignaturas_gestion_anterior, datos_estudiante, fecha_emision, numero_boleta, numero_archivo) {

  //inicialización de los parametros del reporte
  const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

  doc.setFontSize(12);

  //definicion de cabeceras de tablas
  const headers = [['NRO', 'CÓDIGO', 'ASIGNATURA PROGRAMADA', 'TIPO', 'OBSERVACIÓN']];
  const headersGestionAnterior = [['NRO', 'CÓDIGO', 'NOMBRE ASIGNATURA', 'NOTA FINAL', 'RESULTADO', 'OBSERVACIÓN']];

  doc.setTextColor(10);
  doc.setFontSize(15);

  let finalY = doc.lastAutoTable.finalY || 10


  //INICIANDO LOS ENCABEZADOS Y FORMATO DE PRESENTACION
  await doc.addImage(MINISTERIO, 'JPG', 15, finalY + 5, 60, 60);
  await doc.addImage(LOGO_UNI, 'PNG', doc.internal.pageSize.width - 65, finalY + 5, 50, 50);

  //formato alternativo de cabeceras de reporte
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
                       Tukuy sunquwan yahcyaninchikta, ruwayninchikta, yuyayninchikta kallpachaspa sumaq kawsayman kutina                       
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
                       
                       `, -20, finalY);

  let cedula_identidad = datos_estudiante.ci_especial ? `${datos_estudiante.ci_estudiante} ${datos_estudiante.ci_especial}` : datos_estudiante.ci_estudiante;

  doc.setTextColor(100);
  doc.text(`
                       ${datos_estudiante.apellidoP} ${datos_estudiante.apellidoM} ${datos_estudiante.nombres}                        
                       ${cedula_identidad}                       
                       ${datos_estudiante.numero_registro}                                 
                       ${datos_estudiante.nombre_carrera}
                       ${fecha_emision}
                       
                       `, (doc.internal.pageSize.getWidth() / 2) - 150, finalY);

  finalY += 45;

  let wantedTableWidth = 279;
  let pageWidth = doc.internal.pageSize.width;
  let margin = (pageWidth - wantedTableWidth) / 2;

  doc.setTextColor(10);
  doc.setFontSize(10).setFont(undefined, 'bold');
  doc.text(`
                        ASIGNATURAS GESTIÓN 2023
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
    margin: { left: margin - 30 },
    //columnStyles:{color}
    padding: 1
  });
  finalY = doc.lastAutoTable.finalY
  finalY += 30;

  doc.setTextColor(10);
  doc.setFontSize(10).setFont(undefined, 'bold');
  doc.text(`
                        PROGRAMACIÓN DE ASIGNATURAS GESTIÓN 2024
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
    margin: { left: margin - 30 },
    //columnStyles:{color}
    padding: 1

  });
  finalY = doc.lastAutoTable.finalY
  finalY += 60;

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
                        FIRMA ESTUDIANTE
                        `, 20, finalY);

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

  finalY += 65;


  doc.setTextColor(10);
  doc.setFontSize(6).setFont(undefined, 'bold');
  doc.text(`
                      Documento solo válido para trámite interno                                  
                      *Ajuste: Asignaturas validadas con la Resolución Ministerial N°0155/2023
                      *N: Gestión Asignatura Normal                        
                        `, 30, finalY);

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'bold');
  doc.text(`
                        Arch: ${numero_archivo}
                        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY + 50, null, null, "center");

  finalY += 10;

  //forma alternativa para generar el reporte pdf  
  //await doc.save(`inscripcion_${this.apellidoP} ${this.apellidoM} ${this.nombres}.pdf`); 
  await window.open(doc.output('bloburl'), '_blank');

}

export async function generarformularioAdmision(datos_estudiante) {
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
//metodo para obtener el Certificado de Calificaciones Por Gestión Académica
export async function historialAcademico(datos_estudiante, grado, fecha_emision, otros_datos, gestion = 2023) {

  const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'letter' });

  doc.setFontSize(12);
  //cabeceras de tabla de datos
  const headers = [['NRO', 'GESTIÓN', 'SIGLA CÓDIGO', 'ASIGNATURA', 'CALIFICACIÓN NUMERAL', 'CALIFICACIÓN LITERAL QUECHUA', 'ESTADO', 'OBSERVACIÓN']];

  doc.setTextColor(10);
  doc.setFontSize(15);

  let finalY = doc.lastAutoTable.finalY || 10

  finalY += 75;

  doc.setTextColor(10);
  doc.setFontSize(6).setFont(undefined, 'bold');
  doc.text(`
      SERIE "A"-3 
      `, (doc.internal.pageSize.getWidth() / 2) + 160, finalY, null, null, "center");

  finalY += 10;

  doc.setTextColor(10);
  doc.setFontSize(14).setFont(undefined, 'bold');
  doc.text(`
      CERTIFICADO DE CALIFICACIONES
      `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

  finalY += 30;

  doc.setTextColor(10);
  doc.setFontSize(8);
  doc.text(`
       APELLIDOS Y NOMBRES:                                  
       CÉDULA DE IDENTIDAD: 
       NRO DE REGISTRO: 
       CARRERA: 
       FECHA DE EMISIÓN: 
       NIVEL DE FORMACIÓN: 
       `, 45, finalY);

  const apellidoPaterno = datos_estudiante.apellidoP ? datos_estudiante.apellidoP : '';
  const apellidoMaterno = datos_estudiante.apellidoM ? datos_estudiante.apellidoM : '';
  console.log(datos_estudiante.apellidoP);

  doc.setTextColor(100);
  doc.text(`
       ${apellidoPaterno} ${apellidoMaterno} ${datos_estudiante.nombres}                         
       ${datos_estudiante.ci_estudiante}                       
       ${datos_estudiante.numero_registro}                                
       ${datos_estudiante.nombre_carrera}
       ${fecha_emision}
       ${grado}
       `, (doc.internal.pageSize.getWidth() / 2) - 95, finalY);

  finalY += 35;

  let asignaturas_tabla = otros_datos;

  let wantedTableWidth = 279;
  let pageWidth = doc.internal.pageSize.width;
  let margin = (pageWidth - wantedTableWidth) / 2;

  //tabla de datos
  autoTable(doc, {
    startY: finalY + 20,
    head: headers,
    body: asignaturas_tabla,
    //theme:'grid',theme:'striped',theme:'plain'
    theme: 'plain',
    tableLineColor: [0, 0, 0], tableLineWidth: 0.2,
    styles: { fontSize: 6, cellWidth: 'wrap', halign: 'center' },
    bodyStyles: { lineWidth: 0.2, lineColor: [0, 0, 0] },
    margin: { left: margin - 40 },
    //columnStyles:{color}
    padding: 2,
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 80, halign: 'center' },
      4: { cellWidth: 40, halign: 'center' },
      5: { cellWidth: 80, halign: 'center' },
      6: { cellWidth: 24, halign: 'center' },
      7: { cellWidth: 80, halign: 'center' },
      // etc
    }

  });
  finalY = doc.lastAutoTable.finalY
  finalY += 100;

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
        Willay Japi'q
        `, 45, finalY);

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
        Umalliq
        `, (doc.internal.pageSize.getWidth() / 2) - 20, finalY, null, null, "center");

  doc.setTextColor(10);
  doc.setFontSize(8).setFont(undefined, 'normal');
  doc.text(`
      Sullk'a Kamachiq
        `, (doc.internal.pageSize.getWidth() / 2) + 120, finalY, null, null, "center");

  finalY += 65;

  doc.setTextColor(10);
  doc.setFontSize(6).setFont(undefined, 'bold');
  doc.text(`
        Valores de malla Aprobados con la R.M. 1300/2018 de Reingeniería Institucional
        *La presente solo es válida para trámite interno
        APR.: APROBADO
        REP.:REPROBADO
        AB.:ABANDONO
          `, 40, finalY);
  //forma alternativa de generar el pdf
  //await doc.save(`${this.apellidoP} ${this.apellidoM} ${this.nombres}`);      
  await window.open(doc.output('bloburl'), '_blank');

}