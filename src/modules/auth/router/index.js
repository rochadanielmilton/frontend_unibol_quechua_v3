export default {
    name:'auth',
    component: ()=> import(/*WebpackChunkName: "AuthLayout"*/'@/modules/auth/layouts/AuthLayout.vue'),
    children:[
        {
            path:'',
            name:'login',
            component: ()=> import(/* WebpackChunkName: "Login"*/'@/modules/auth/views/LoginUser.vue'),
        },
        {
            path:'/register',
            name:'register',
            component: ()=> import(/*WebpackChunkName: "Register"*/'@/modules/auth/views/RegisterUser.vue'),
        }
    ]
}