import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
//IMPORTACION DEL AUTH
import authRouter from '../modules/auth/router'
import isAuthenticatedGuard from '@/modules/auth/router/auth-guard'

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          redirect: '/estudiantes'
        },
        {
          path: 'curso-preparatorio',
          name: 'curso-preparatorio',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/EstudianteCursoPreparatorioView.vue')
        },
        {
          path: 'estudiantes',
          name: 'estudiantes',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/EstudianteView.vue')
        },
        {
          path: 'estudiante/edit/:id',
          name: 'editarestudiante',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/EditEstudianteView.vue')
        },
        {
          path: 'estudiante/create',
          name: 'crearestudiante',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/CreateEstudianteView.vue')
        },
        {
          path: 'habilitados-regulares',

          name: 'habilitados-regulares',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/HabilitadosRegularesEstudianteView.vue')
        },
        {
          path: 'habilitados-nuevos',
          name: 'habilitados-nuevos',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/HabilitadosNuevosEstudianteView.vue')
        },
        {
          path: '/estudiante/ofertas/:id',
          name: 'estudianteofertas',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiante-ofertas" */ '../views/estudiante/OfertaMateriasEstudianteView.vue')
        },
        {
          path: '/estudiante/materias-cursadas/:id',
          name: 'materiascursadas',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiante-cursadas" */ '../views/estudiante/CursadasEstudianteView.vue')
        },
        {
          path: '/estudiante/historial-anual/:id',
          name: 'estudiantesanual',
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "historial-anual" */ '../views/estudiante/HistorialAnualView.vue')
        },
        {
          path: '/estudiante/historial-avance-general/:id',
          name: 'estudiantesavancegeneral',
          component: () => import(/* webpackChunkName: "dosmas" */ '../views/estudiante/HistorialAvanceGeneralView.vue')
        },
        {
          path: '/perfil-estudiante/:id',
          name: 'perfil-estudiante',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "estudiantes" */ '../views/estudiante/PerfilEstudiante2View.vue')
        },
        {
          path: '/reportes-generales',
          name: 'reportes',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docentes" */ '../views/reportes/ReportesGeneralesView.vue')
        },
        {
          path: '/reporte/reporte-carrera',
          name: 'reportescarrera',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docentes" */ '../views/reportes/ReportesCarreraView.vue')
        },
        {
          path: '/reporte/reporte-genero',
          name: 'reportesgenero',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docentes" */ '../views/reportes/ReportesGeneroView.vue')
        },
        {
          path: '/reporte/reporte-departamento',
          name: 'reportesdepartamento',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docentes" */ '../views/reportes/ReportesDepartamentoView.vue')
        },
        {
          path: '/docentes',
          name: 'docentes',
          beforeEnter: [isAuthenticatedGuard],
          //component: DocenteView
          component: () => import(/* webpackChunkName: "docentes" */ '../views/docente/DocenteDataView.vue')
        },
        {
          path: '/docente/create',
          name: 'creardocente',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docente-create" */ '../views/docente/CreateDocenteView.vue')
        },
        {
          path: '/docente/edit/:id',
          name: 'editardocente',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "docente-edit" */ '../views/docente/EditDocenteView.vue')
        },
        {
          path: '/asignaturas',
          name: 'asignaturas',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignaturas" */ '../views/asignatura/MateriaDataView.vue')
        },
        {
          path: '/asignatura/edit/:id',
          name: 'editarasignatura',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignatura-editar" */ '../views/asignatura/EditMateriaView.vue')
        },
        {
          path: '/asignatura/create',
          name: 'crearasignatura',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignatura-create" */ '../views/asignatura/CreateMateriaView.vue')
        },
        {
          path: '/carreras',
          name: 'carreras',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignaturas" */ '../views/carrera/CarreraDataView.vue')
        },
        {
          path: '/carrera/edit/:id',
          name: 'editarcarrera',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignatura-editar" */ '../views/carrera/EditCarreraView.vue')
        },
        {
          path: '/carrera/create',
          name: 'crearcarrera',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "asignatura-create" */ '../views/carrera/CreateCarreraView.vue')
        },
        {
          path: '/carrera/mostrarmalla/:id',
          name: 'mostrarmalla',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "mostrar-malla" */ '../views/carrera/MostrarMallaDataView.vue')
        },
        {
          path: '/departamentos',
          name: 'departamentos',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "departamento" */ '../views/departamento/DepartamentoDataView.vue')
        },
        {
          path: '/departamento/create',
          name: 'creardepartamento',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "crear-departamento" */ '../views/departamento/CreateDepartamentoView.vue')
        },
        {
          path: '/departamento/edit/:id',
          name: 'editardepartamento',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "edit-departamento" */ '../views/departamento/EditDepartamentoView.vue')
        },
        {
          path: '/provincias',
          name: 'provincias',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "provincia" */ '../views/provincia/ProvinciaDataView.vue')
        },
        {
          path: '/provincia/create',
          name: 'crearprovincia',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "crear-provincia" */ '../views/provincia/CreateProvinciaView.vue')
        },
        {
          path: '/provincia/edit/:id',
          name: 'editarprovincia',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "edit-provincia" */ '../views/provincia/EditProvinciaView.vue')
        },
        {
          path: '/idioma-originario',
          name: 'idioma-originario',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "idioma-originario" */ '../views/idioma/OriginarioDataView.vue')
        },
        {
          path: '/idioma-originario/create',
          name: 'crearidioma',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "crear-idioma" */ '../views/idioma/CreateOriginarioView.vue')
        },
        {
          path: '/idioma-originario/edit/:id',
          name: 'editaridioma',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import(/* webpackChunkName: "edit-idioma" */ '../views/idioma/EditOriginarioView.vue')
        },
        {
          path: '',
          redirect: { name: 'estudiantes' }
        },
        {
          path: '/:pathMatch(.*)*',
          //AQUI DEBBERIA IR HACIA EL "NOT FOUND PAGE"          
          redirect: '/estudiantes'
        },
      ],
    },
    {
      path: '/auth',
      ...authRouter
    },
  ]
})

export default router
