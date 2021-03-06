const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        let hash = bcrypt.hashSync(val, 5);
        this.setDataValue("password", hash);
      }
    }
  });
  User.associate = function(m){
    m.user.belongsToMany(m.book, {through: m.cart});
    m.user.belongsToMany(m.book, {through: m.reserve, uniqueKey: "unique"});
  };
  return User;
};
