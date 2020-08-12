
// import pkg from './package'
// TODO: add AAD_API_VERSION to environment
if (process.env.NODE_ENV !== 'production') {
  process.env.DEPLOY_ENV = ''
  /* eslint-disable no-console */
  console.log('Init dotenv')
  /* eslint-enable no-console */
  require('dotenv').config()
  /* eslint-disable no-console */
  // console.log('GOOGLE_MAPS_API_KEY: ' + process.env.GOOGLE_MAPS_API_KEY)
  // console.log('DW_USER: process.env.DW_USER: ' + process.env.DW_USER)
  // console.log('DW_DRAIN_URL: process.env.DW_DRAIN_URL ' + process.env.DW_DRAIN_URL)
  // console.log('DW_AUTH_TOKEN: process.env.DW_AUTH_TOKEN ' + process.env.DW_AUTH_TOKEN)
  /* eslint-enable no-console */
} else {
  // switch to
  process.env.DEPLOY_ENV = 'GH_PAGES'
}
// allow static app to run in subfolder of host
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/adopt-a-drain/'
  }
} : {}
export default {
  ...routerBase,
  mode: 'spa',
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    DW_USER: process.env.DW_USER || 'citizenlabs',
    DW_DRAIN_URL: process.env.DW_DRAIN_URL || 'https://api.data.world/v0/sql/citizenlabs/grb-storm-drains',
    DW_AUTH_TOKEN: process.env.DW_AUTH_TOKEN,
    AAD_API_TOKEN: process.env.AAD_API_TOKEN,
    AAD_API_URL: process.env.AAD_API_URL,
    AAD_API_VERSION: process.env.AAD_API_VERSION
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue2-google-maps.js' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // transpile: [/^vue2-google-maps($|\/)/]
      /*
      if (!ctx.isClient) {
        // This instructs Webpack to include `vue2-google-maps`'s Vue files
        // for server-side rendering
        config.externals = [
          function(context, request, callback){
            if (/^vue2-google-maps($|\/)/.test(request)) {
              callback(null, false)
            } else {
              callback()
            }
          }
        ]
      }
      */
    }

  }
}
