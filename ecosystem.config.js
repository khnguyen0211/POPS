// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'POPS',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'development',
        variable_name: '...'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}