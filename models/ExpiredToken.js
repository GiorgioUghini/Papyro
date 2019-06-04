module.exports = (sequelize, DataTypes) => {
  const ExpiredToken = sequelize.define("expiredToken", {
    token: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  });
  return ExpiredToken;
};