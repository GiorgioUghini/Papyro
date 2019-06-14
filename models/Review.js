module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("review", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    return Review;
};