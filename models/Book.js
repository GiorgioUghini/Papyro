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
    isFavorite: {
      type: DataTypes.BOOLEAN
    }
  });
  Book.associate = function(m){
    m.book.belongsToMany(m.author, {through: m.bookAuthor, uniqueKey: "unique"});
    m.book.belongsToMany(m.book, {as: "Similar", through: "SimilarBook"});
    m.book.belongsToMany(m.user, {through: m.cart});
    m.book.belongsToMany(m.user, {through: m.reserve, uniqueKey: "unique"});
    m.book.hasMany(m.event);
    m.book.belongsToMany(m.theme, {through: m.bookTheme});
    m.book.belongsToMany(m.genre, {through: m.bookGenre});
  };
  return Book;
};
