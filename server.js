require('dotenv').config();
const {join} = require('node:path')
const fastify = require('fastify');
const { Transactions, Accounts, Categories, sequelize } = require('./Features/db');
const server = new fastify({
    logger:true
});

server.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs')
    },
    root: join(__dirname,'Views'),
    layout: '_Layout'
})
.register(require('@fastify/static'), {
    root: join(__dirname,'Views','Static'),
    prefix: '/assets'
})
.register(require('@fastify/formbody'))

server.get('/', async (req, rep) => {
    let filterRule = [];
    // Order By Filter
    filterRule.push(req.query.orderBy || "createdAt", req.query.orderDir || "ASC")
    const transactions = await Transactions.findAll({order: [filterRule]});
    // Statistics
    const statsDaily = await Transactions.findAll({
        attributes: [
            [sequelize.literal(`DATE("createdAt")`), 'date'],
            [sequelize.fn('COUNT', sequelize.col('Id')),'count'],
            [sequelize.fn('SUM', sequelize.col('Amount')), 'totalAmount']
        ],
        group: [sequelize.literal(`DATE("createdAt")`)],
        raw:true
    })
    const statsWeekly = await Transactions.findAll({
        attributes: [
            [sequelize.literal(`strftime('%Y-%W', "createdAt")`), 'week'],
            [sequelize.fn('COUNT', sequelize.col('Id')), 'count'],
            [sequelize.fn('SUM', sequelize.col('Amount')), 'totalAmount']
        ],
        group: [sequelize.literal(`strftime('%%Y-%%W', "createdAt")`)],
        raw: true
    })
    const statsMonthly = await Transactions.findAll({
        attributes: [
            [sequelize.literal(`strftime('%Y-%m', "createdAt")`), 'month'],
            [sequelize.fn('COUNT', sequelize.col('Id')), 'count'],
            [sequelize.fn('SUM', sequelize.col('Amount')), 'totalAmount']
        ],
        group: [sequelize.literal(`strftime('%Y-%m', "createdAt")`)],
        raw: true
    })
    const account = await Accounts.findOne({where: {Id: 1}})
    for(const transaction of transactions) {
        const category = await Categories.findOne({where: {Id: transaction.Category}});
        transaction.category = category;
    }
    return rep.view('Index', {transactions: transactions, account: account, orderBy: req.query.orderBy || "createdAt", orderDir: req.query?.orderDir || "asc", statsDaily: statsDaily, statsWeekly: statsWeekly, statsMonthly: statsMonthly}) 
})

server.get('/new', async (req, rep) => {
    const categories =await Categories.findAll();
    return rep.view('Transactions/Create', {categories: categories})
})

server.post('/new', async (req, rep) => {
    const payload = {
        Amount: req.body.createAmount,
        Description: req.body.createDescription,
        Category: req.body.createCategory,
        Type: req.body.createType
    }
    await Transactions.create(payload);
    if(payload.Type == 1)
        await Accounts.increment({Balance: payload.Amount}, {where: {Id: 1}})
    else
        await Accounts.increment({Balance: -payload.Amount}, {where: {Id: 1}})
    return rep.redirect('/')
})

server.get('/:id', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})
    if(transaction.Category) {
        const category = await Categories.findOne({where: {Id: transaction.Category }});
        transaction.category = category;

    }
    return rep.view('Transactions/Index', {transaction: transaction})
})
server.get('/:id/edit', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})
    const categories =await Categories.findAll();
    if(transaction.Category) {
        const category = await Categories.findOne({where: {Id: transaction.Category }});
        transaction.category = category;
    }
    return rep.view('Transactions/Edit', {transaction: transaction, categories: categories})
})
server.post('/:id/edit', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})

    if(transaction.Category) {
        const category = await Categories.findOne({where: {Id: transaction.Category }});
        transaction.category = category;
    }
    const payload = {
        Amount: req.body.createAmount,
        Description: req.body.createDescription,
        Category: req.body.createCategory,
        Type: req.body.createType
    }
    await transaction.update(payload, {where: {Id: req.params.id}})
    return rep.redirect('/')
})

server.get('/:id/delete', async (req, rep) => {
    if(!req.query.confirmed)
        return rep.view('Transactions/Delete');
    await Transactions.destroy({where: {Id: req.params.id}})
    return rep.redirect('/');
})


// Categories

server.get('/categories', async (req, rep) => {
    const categories = await Categories.findAll();
    return rep.view('Categories/Index', {categories: categories})
})
server.get('/categories/:id', async (req, rep) => {
    const category = await Categories.findOne({where:{Id: req.params.id}});
    return rep.view('Categories/Details', {category: category})
})
server.get('/categories/:id/edit', async (req, rep) => {
    const category = await Categories.findOne({where: {Id: req.params.id}})
    return rep.view('Categories/Edit', {category: category})
})
server.post('/categories/:id/edit', async (req, rep) => {
    const payload= {
        Name: req.body.categoryName,
        Colour: req.body.categoryColour
    }
    await Categories.update(payload, {where:{Id: req.params.id}});
    return rep.redirect('/categories')
})
server.get('/categories/:id/delete', async (req, rep) => {
    if(!req.query.confirmed)
        return rep.view('Categories/Delete');
    await Categories.destroy({where: {Id: req.params.id}})
    return rep.redirect('/');
})

server.listen({host: "127.0.0.1", port: 8080}).then(() => {
    server.log.info("Web Server started")
})