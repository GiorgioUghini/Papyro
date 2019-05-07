module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING
    },
    abstract: {
      type: DataTypes.TEXT
    },
    interview: {
      type: DataTypes.TEXT
    },
    facts: {
      type: DataTypes.JSONB
    },
    isFavorite: {
      type: DataTypes.BOOLEAN
    }
  });
  return Book;
};
