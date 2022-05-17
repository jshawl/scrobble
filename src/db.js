const { Sequelize, DataTypes } =  require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.cwd() + "/db.sqlite3"
});

const Scrobble = sequelize.define('Scrobble', {
  artists: DataTypes.STRING,
  name: DataTypes.STRING,
  played_at: DataTypes.DATE,
  spotify_id: DataTypes.STRING,
});

const KV = sequelize.define('KV', {
  key: DataTypes.STRING,
  value: DataTypes.STRING
})

module.exports.Scrobble = Scrobble
module.exports.KV = KV
module.exports.sync = async (cb) => {
  await sequelize.sync({force: false})
  cb()
}
