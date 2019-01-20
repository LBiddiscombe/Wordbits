// sw-config.js
module.exports = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.mlab\.com\/.*/,
      handler: 'cacheFirst'
    }
  ]
}
