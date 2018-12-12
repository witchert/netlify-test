const pkg = require('./package');
const WPAPI = require('wpapi');

const getAll = function (request) {
  return request.then(function( response ) {
    if ( ! response._paging || ! response._paging.next ) {
      return response;
    }
    // Request the next page and return both responses as one collection
    return Promise.all([
      response,
      getAll( response._paging.next )
    ]).then(function( responses ) {
      return responses.reduce((a, b) => a.concat(b), []);
    });
  });
};

module.exports = {
  mode: 'universal',

  generate: {
    routes: function () {
      const wp = new WPAPI({endpoint: 'https://local.realvision.com/wp-json'});
      wp.videos = wp.registerRoute('wp/v2', '/video/(?P<id>)');
      return getAll(wp.videos().perPage(100)).then((videos) => {
        return videos.map((video) => {
          return {
            route: '/video/' + video.id,
            payload: video
          };
        })
      });
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
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
      '~/assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
      '@nuxtjs/axios',
      ['wp-nuxt', { endpoint: 'https://local.realvision.com/wp-json' }],
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },

  vue: {
    config: {
      devtools: true
    }
  }
}
