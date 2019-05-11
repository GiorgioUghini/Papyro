module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  User.associate = function(m){
    m.user.belongsToMany(m.book, {through: m.cart});
    m.user.belongsToMany(m.book, {through: m.reserve, uniqueKey: "unique"});
  };
  return User;
};
