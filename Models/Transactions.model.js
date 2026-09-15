const { DataTypes, Deferrable } = require("sequelize");
const { sequelize } = require("../Features/db");

// Lagerbuchungen: jede Zu- oder Abbuchung eines Artikels (Übung 2, Punkt 5 + 8)
module.exports = (sequelize) => {
    const Transactions = sequelize.define("Transactions", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Quantity: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        Price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Article: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                type: DataTypes.INTEGER,
                model: 'Articles',
                key: 'Id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        Type: {
            type: DataTypes.BOOLEAN,
            allowNull: false // 1 = Zugang (Wareneingang), 0 = Abgang (Warenausgang)
        }
    })
    return Transactions
}
