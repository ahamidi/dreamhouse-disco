
'use strict'

let Sequelize = require('sequelize')
let fs = require('fs')
let path = require('path')
let fmt = require('logfmt')
let config = require('../config')

const pg = config.pg

let sequelize = new Sequelize(pg.database, pg.username, pg.password, {
  dialect: 'postgres',
  protocol: 'postgres',
  port: pg.port,
  host: pg.host,
  logging: false,
  dialectOptions: { ssl: true }
})

let db = {}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Account.hasMany(db.Playlist)
db.Playlist.belongsTo(db.Account)

db.Message.belongsTo(db.Account)
db.Account.hasMany(db.Message)

function initDb() {
  return db.sequelize.sync({ force: config.forceDbRebuild }).then(function() {
    fmt.log({ type: 'info', msg: 'Sequelize validated database state' })
  })
}

db.init = initDb

module.exports = db
