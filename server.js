require('dotenv').config();
const {join} = require('node:path')
const fastify = require('fastify');
const { Transactions, Articles } = require('./Features/db');
const { getStock } = require('./Features/inventory');
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
    for(const transaction of transactions) {
        const article = await Articles.findOne({where: {Id: transaction.Article}});
        transaction.article = article;
    }
    return rep.view('Index', {transactions: transactions, orderBy: req.query.orderBy || "createdAt", orderDir: req.query?.orderDir || "asc"})
})

server.get('/new', async (req, rep) => {
    const articles = await Articles.findAll();
    return rep.view('Transactions/Create', {articles: articles})
})

server.post('/new', async (req, rep) => {
    const payload = {
        Quantity: req.body.createQuantity,
        Price: req.body.createPrice,
        Description: req.body.createDescription,
        Article: req.body.createArticle,
        Type: req.body.createType
    }
    if(req.body.createDate) {
        payload.createdAt = new Date(req.body.createDate);
    }
    await Transactions.create(payload);
    return rep.redirect('/')
})

server.get('/:id', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})
    if(transaction.Article) {
        const article = await Articles.findOne({where: {Id: transaction.Article }});
        transaction.article = article;
    }
    return rep.view('Transactions/Index', {transaction: transaction})
})
server.get('/:id/edit', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})
    const articles = await Articles.findAll();
    if(transaction.Article) {
        const article = await Articles.findOne({where: {Id: transaction.Article }});
        transaction.article = article;
    }
    return rep.view('Transactions/Edit', {transaction: transaction, articles: articles})
})
server.post('/:id/edit', async (req, rep) => {
    let transaction = await Transactions.findOne({where: {Id: req.params.id}})

    const payload = {
        Quantity: req.body.createQuantity,
        Price: req.body.createPrice,
        Description: req.body.createDescription,
        Article: req.body.createArticle,
        Type: req.body.createType
    }
    if(req.body.createDate) {
        payload.createdAt = new Date(req.body.createDate);
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


// Artikel (Übung 2, Punkte 1-3: hinzufügen, bearbeiten, löschen)

server.get('/articles', async (req, rep) => {
    const articles = await Articles.findAll();
    return rep.view('Articles/Index', {articles: articles})
})
server.get('/articles/new', async (req, rep) => {
    return rep.view('Articles/Create')
})
server.post('/articles/new', async (req, rep) => {
    const payload = {
        ArticleNumber: req.body.articleNumber,
        Name: req.body.articleName,
        Description: req.body.articleDescription
    }
    await Articles.create(payload);
    return rep.redirect('/articles')
})
server.get('/articles/:id', async (req, rep) => {
    const article = await Articles.findOne({where:{Id: req.params.id}});
    const bookings = await Transactions.findAll({where: {Article: req.params.id}, order: [["createdAt", "DESC"]]});
    return rep.view('Articles/Details', {article: article, bookings: bookings})
})
server.get('/articles/:id/edit', async (req, rep) => {
    const article = await Articles.findOne({where: {Id: req.params.id}})
    return rep.view('Articles/Edit', {article: article})
})
server.post('/articles/:id/edit', async (req, rep) => {
    const payload= {
        ArticleNumber: req.body.articleNumber,
        Name: req.body.articleName,
        Description: req.body.articleDescription
    }
    await Articles.update(payload, {where:{Id: req.params.id}});
    return rep.redirect('/articles')
})
server.get('/articles/:id/delete', async (req, rep) => {
    if(!req.query.confirmed)
        return rep.view('Articles/Delete');
    await Articles.destroy({where: {Id: req.params.id}})
    return rep.redirect('/articles');
})

// Bestand anzeigen (Übung 2, Punkt 4) inkl. gewichtetem Durchschnittspreis (Punkt 9)
server.get('/stock', async (req, rep) => {
    const stock = await getStock();
    return rep.view('Stock/Index', {stock: stock})
})

// Bericht generieren (Übung 2, Punkt 6)
server.get('/report', async (req, rep) => {
    const stock = await getStock();
    return rep.view('Report/Index', {stock: stock, generatedAt: new Date()})
})

// Statistik: Top 3 Artikel nach Lagerwert (Übung 2, Punkt 7)
server.get('/statistics', async (req, rep) => {
    const stock = await getStock();
    const top3 = [...stock].sort((a,b) => b.TotalValue - a.TotalValue).slice(0,3);
    return rep.view('Statistics/Index', {top3: top3})
})

server.listen({host: "127.0.0.1", port: 8080}).then(() => {
    server.log.info("Web Server started")
})
