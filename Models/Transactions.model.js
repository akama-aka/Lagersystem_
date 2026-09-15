const { DataTypes, Deferrable } = require("sequelize");
const { sequelize } = require("../Features/db");

module.exports = (sequelize) => {
    const Transactions = sequelize.define("Transactions", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Category: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
            references: {
                type: DataTypes.INTEGER,
                model: 'Categories',
                key: 'Id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        Type: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
    return Transactions
}