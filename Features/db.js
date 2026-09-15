require('dotenv').config();
const Sequelize = require("sequelize");
const TransactionModel = require('../Models/Transactions.model');
const ArticleModel = require('../Models/Articles.models');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/database.sqlite3'
})
const Transactions = TransactionModel(sequelize);
const Articles = ArticleModel(sequelize)
async function connect() {
    try {

        await sequelize.authenticate();
        console.info("Connected with the Database")
        sequelize.sync({force:true}).then(() => {
            Articles.bulkCreate([
                {
                    Id: 1,
                    ArticleNumber: "A-1000",
                    Name: "Schraube M8",
                    Description: "Sechskantschraube M8x40, verzinkt"
                },
                {
                    Id: 2,
                    ArticleNumber: "A-1001",
                    Name: "Kartonbox klein",
                    Description: "Versandkarton 20x20x20cm"
                },
                {
                    Id: 3,
                    ArticleNumber: "A-1002",
                    Name: "Klebeband",
                    Description: "Paketklebeband braun, 66m"
                }
            ]).then(() => {
                Transactions.bulkCreate([
                    { Quantity: 100, Price: 0.15, Description: "Erstbestellung", Article: 1, Type: 1 },
                    { Quantity: 20, Price: 0.18, Description: "Nachbestellung", Article: 1, Type: 1 },
                    { Quantity: 30, Price: 0.15, Description: "Verkauf", Article: 1, Type: 0 },
                    { Quantity: 50, Price: 1.20, Description: "Erstbestellung", Article: 2, Type: 1 },
                    { Quantity: 200, Price: 2.50, Description: "Erstbestellung", Article: 3, Type: 1 },
                    { Quantity: 40, Price: 2.50, Description: "Verkauf", Article: 3, Type: 0 }
                ])
            })
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
    Articles
}
