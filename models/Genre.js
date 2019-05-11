module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define("genre", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  Genre.associate = function(m){
    m.genre.belongsToMany(m.book, {through: m.bookGenre});
  };
  return Genre;
};
