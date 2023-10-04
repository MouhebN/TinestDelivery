const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const port = 3000;


app.use(express.json());
app.use(cors());
const factureRoute = require('./Routes/facture');
app.use('', factureRoute);

const chefAgenceRoute = require('./Routes/chefAgence');
app.use('', chefAgenceRoute);

const echangeColisRoutes =require('./Routes/echangerColisRoutes')
app.use('', echangeColisRoutes);

const colisRoute = require('./Routes/colis.js');
app.use('', colisRoute);

const historiqueRoute = require('./Routes/colisHistorique.js');
app.use('', historiqueRoute);

const agenceRoute = require('./Routes/agence.js');
app.use('', agenceRoute);

const magasinierRoute = require('./Routes/magasinier.js');
app.use('', magasinierRoute);

const authRoute = require('./Routes/auth');
app.use('', authRoute);

const livreurRoute = require('./Routes/livreur.js');
app.use('', livreurRoute);

const stockRoute = require('./Routes/stock.js');
const colisHistorique = require('./Models/colisHistorique');
app.use('', stockRoute);


mongoose.connect('mongodb://127.0.0.1:27017/tinestDL',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', function () {
    console.log('MongoDB database connection established successfully');
});
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});