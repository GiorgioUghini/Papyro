module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define("theme", {
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
  Theme.associate = function(m){
    m.theme.belongsToMany(m.book, {through: m.bookTheme});
  };
  return Theme;
};
