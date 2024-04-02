//vite.config.js

import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import path from 'path'

//const path = require('path')

export default defineConfig({
  //https://vitejs.dev/config
  plugins: [vue()],
  resolve:{    
    alias:{
      "@":path.resolve(__dirname, "./src"),
    },
  }
})