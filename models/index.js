const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const out = {};
const { db, force } = require("../config");

const dbOptions = {
  host: db.host,
  define:{
    timestamps: false
  },
  port: db.port,
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

const sequelize = db.connection_string ? new Sequelize(db.connection_string, dbOptions) : new Sequelize(db.name, db.user, db.password, dbOptions);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file));
    out[model.name] = model;
  });

Object.keys(out).forEach(modelName => {
  if (out[modelName].associate) {
    out[modelName].associate(out);
  }
});

out.sequelize = sequelize;
out.Sequelize = Sequelize;

out.initialize = async () => {
  await sequelize.sync({force});
};

module.exports = out;