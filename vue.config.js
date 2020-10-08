module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'network': '@/network',
        'plugins': '@/plugins',
        'views': '@/views',
        'components': '@/components',
        'common': '@/common'
      }
    }
  }
}