const { Articles, Transactions } = require('./db');

// Berechnet für jeden Artikel: aktuelle Menge (Bestand), gewichteten
// Durchschnittspreis der Zugänge und den daraus resultierenden Gesamtwert.
// (Übung 2, Punkte 4, 6, 7, 9)
async function getStock() {
    const articles = await Articles.findAll({raw: true});
    const bookings = await Transactions.findAll({raw: true});

    return articles.map(article => {
        const articleBookings = bookings.filter(b => b.Article === article.Id);

        let quantity = 0;
        let inQuantity = 0;
        let inValue = 0;

        for (const booking of articleBookings) {
            const qty = Number(booking.Quantity);
            const price = Number(booking.Price);
            if (booking.Type) { // Zugang
                quantity += qty;
                inQuantity += qty;
                inValue += qty * price;
            } else { // Abgang
                quantity -= qty;
            }
        }

        const averagePrice = inQuantity > 0 ? inValue / inQuantity : 0;
        const totalValue = quantity * averagePrice;

        return {
            Id: article.Id,
            ArticleNumber: article.ArticleNumber,
            Name: article.Name,
            Description: article.Description,
            Quantity: quantity,
            AveragePrice: averagePrice,
            TotalValue: totalValue
        }
    })
}

module.exports = { getStock }
