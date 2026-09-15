require('dotenv').config();
const Sequelize = require("sequelize");
const TransactionModel = require('../Models/Transactions.model');
const CategoryModel = require('../Models/Categories.models')
const AccountModel = require('../Models/Accounts.models');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/database.sqlite3'
})
const Transactions = TransactionModel(sequelize);
const Categories = CategoryModel(sequelize)
const Accounts = AccountModel(sequelize);
async function connect() {
    try {
        
        await sequelize.authenticate();
        console.info("Connected with the Database")    
        sequelize.sync({force:true}).then(() => {
            Accounts.create({Balance: -39.2})
            Categories.bulkCreate([
                {
                    Id: 1,
                    Name: "No Category"
                },
                {
                    Name: "Miete"
                },
                {
                    Name: "Lebensmittel"
                },
                {
                    Name: "Gehalt"
                },
                {
                    Name: "Vermietung"
                }
            ])
            Transactions.bulkCreate([
                {
                    Amount: 1.00,
                    Category: 1,
                    Type: 1
                },
                {
                    Amount: 40.20,
                    Category: 3,
                    Type: 0
                }
            ])
        })
    } catch(e) {
        console.error("There was an error connecting with the Database!",e);
    }
}

connect().then(async () => {
})
module.exports = {
    sequelize,
    Transactions,
    Categories,
    Accounts
}