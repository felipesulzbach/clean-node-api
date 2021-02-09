export default {
  port: process.env.PORT || 5050,
  mongodb: {
    dialect: 'mongodb://',
    domain: 'localhost:27017',
    namedb: 'clean-node-api',
    username: 'mongo',
    password: 'mongo123',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
}