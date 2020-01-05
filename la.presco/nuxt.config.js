
export default {
  env: {
    PAYPAL_ID: 'AecOelIU_tTGLlXJJFdM-eH4GEFelCaLVIIvx-LrCFC6IQALAQd6qHBQWEr-PG3xwYmmDxR6hJnmHodF'
  },
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-155112763-1', 
        async: true
      },
      { 
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-155112763-1');
        `
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  router: {
    base: '/'
  },
  generate: {
    routes: [
      '/item/29540',
      '/item/29541',
      '/item/29542',
      '/item/29543',
      '/item/29544',
      '/item/29545',
      '/item/29546',
      '/item/29547',
      '/item/29548',
      '/item/29549',
      '/item/295410',
      '/item/295411',
      '/item/295412',
      '/item/295413',
      '/item/295414',
      '/item/295415',
      '/item/295416',
      '/item/295417',
      '/item/295418',
      '/item/295419',
      '/item/295420',
      '/cart'
    ]
  }
}
