module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING
    },
    bio: {
      type: DataTypes.TEXT
    }
  });
  Author.associate = function (m) {
    m.author.belongsToMany(m.book);
  };
  return Book;
};
