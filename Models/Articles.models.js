const { DataTypes } = require("sequelize");
const { sequelize } = require("../Features/db");

// Artikel-Stammdaten (Übung 2, Punkt 1: Artikel hinzufügen)
module.exports = (sequelize) => {
    const Articles = sequelize.define('Articles', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ArticleNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Artikelnummer muss eindeutig sein
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return Articles
}
