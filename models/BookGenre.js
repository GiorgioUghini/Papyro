module.exports = (sequelize, DataTypes) => {
  const BookGenre = sequelize.define("bookGenre", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return BookGenre;
};
