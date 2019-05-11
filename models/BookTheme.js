module.exports = (sequelize, DataTypes) => {
  const BookTheme = sequelize.define("bookTheme", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return BookTheme;
};
