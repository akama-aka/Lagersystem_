const { DataTypes } = require("sequelize");
const { sequelize } = require("../Features/db");

module.exports = (sequelize) => {
    const Categories = sequelize.define('Categories', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Colour: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return Categories
}