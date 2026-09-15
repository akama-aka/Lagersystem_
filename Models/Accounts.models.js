const { DataTypes } = require("sequelize");
const { sequelize } = require("../Features/db");

module.exports = (sequelize) => {
    const Accounts = sequelize.define('Accounts', {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Balance: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.00
        }
    })
    return Accounts
}