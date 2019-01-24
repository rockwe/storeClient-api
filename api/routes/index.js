const userRoutes = require('./user');
const Device = require('../models/device')
const  subCategoryRoutes = require('./subCategory');
const  categoryRoutes = require('./category');
const  countryRoutes = require('./country');
const  townRoutes = require('./town');
const  articleRoutes = require('./article');
const  lignepanierRoutes = require('./lignePagne');
const  billRoutes = require('./bill');


const Pusher = require('../../helpers/pusher')



module.exports = (app) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/sub-category', subCategoryRoutes);
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/country', countryRoutes);
    app.use('/api/v1/town', townRoutes);
    app.use('/api/v1/article', articleRoutes);
    app.use('/api/v1/shopeDetail', lignepanierRoutes);
    app.use('/api/v1/bill', billRoutes);

};
