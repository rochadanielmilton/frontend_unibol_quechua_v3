<script setup>
import { ref } from 'vue';
import useAuth from '../modules/auth/composables/useAuth';
const { cambiarIdioma } = useAuth();

import AppMenuItem from './AppMenuItem.vue';

let idioma_habilitado = false;

const model3 = ref([
    {
        label: 'Administración',
        items: [
            {
                label: 'Gestión de Inscripciones',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Inscripción Nuevos', icon: 'pi pi-fw pi-user', to: '/habilitados-nuevos' },
                    { label: 'Inscripción Regulares', icon: 'pi pi-fw pi-user', to: '/habilitados-regulares' }
                ]
            },
            {

                label: 'Gestión Docentes',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Lista General Docentes', icon: 'pi pi-fw pi-users', to: '/docentes' },
                ]

            }
        ]
    },
    {
        label: 'Parámetros',
        items: [
            {
                label: 'Gestión de Parámetros',
                icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Gestión de Carreras ', icon: 'pi pi-fw pi-plus-circle', to: '/carreras' },
                    { label: 'Gestión de Asignaturas', icon: 'pi pi-fw pi-plus-circle', to: '/asignaturas' },
                    { label: 'Gestión de Departamentos', icon: 'pi pi-fw pi-plus-circle', to: '/departamentos' },
                    { label: 'Gestión de Provincias', icon: 'pi pi-fw pi-plus-circle', to: '/provincias' },
                    { label: 'Gestión de Idioma Originario', icon: 'pi pi-fw pi-plus-circle', to: '/idioma-originario' },
                ]
            },
        ]
    },
    {
        label: 'Estudiantes',
        items: [
            {
                label: 'Gestión de Estudiantes',
                icon: 'pi pi-fw pi-user-plus',
                to: '/estudiantes'
            },
            {

                label: 'Gestión Curso Preparatorio',
                icon: 'pi pi-fw pi-user-plus',
                to: '/curso-preparatorio'
            }
        ]
    },
    {
        label: 'REPORTES',
        items: [{ label: 'Reporte General', icon: 'pi pi-fw pi-check-circle', to: '/reportes-generales' },
        { label: 'Reporte Por Departamento', icon: 'pi pi-fw pi-check-circle', to: '/reporte/reporte-departamento' },
        { label: 'Reporte Por Género', icon: 'pi pi-fw pi-check-circle', to: '/reporte/reporte-genero/' },
        { label: 'Reporte En Planilla(Carrera Por Año)', icon: 'pi pi-fw pi-check-circle', to: '/reporte/reporte-carrera/' },
        ]
    },
]);

//prototipo para cambiar de idioma
const cambiarQuechua = () => {
    if (idioma_habilitado) {
        cambiarIdioma('español')
    }
    else {
        cambiarIdioma('quechua')
        idioma_habilitado = !idioma_habilitado;
    }
}
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model3" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>
<style lang="scss" scoped></style>
