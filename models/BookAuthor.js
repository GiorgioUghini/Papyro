module.exports = (sequelize, DataTypes) => {
  const BookAuthor = sequelize.define("bookAuthor", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return BookAuthor;
};
