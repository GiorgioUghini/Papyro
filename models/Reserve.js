module.exports = (sequelize, DataTypes) => {
  const Reserve = sequelize.define("reserve", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "unique"
    }
  });
  return Reserve;
};
