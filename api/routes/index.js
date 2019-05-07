const userRoutes = require('./user');
const Device = require('../models/device')
const  subCategoryRoutes = require('./subCategory');
const  categoryRoutes = require('./category');
const  countryRoutes = require('./country');
const  townRoutes = require('./town');
const  articleRoutes = require('./article');
const  lineBasketRoutes = require('./lineBasket');
const  configurationRoutes = require('./configuration');
const orderRoutes = require('./order');
const contactRoutes = require('./contact');
const claimRoutes = require('./claim');
const markRoutes = require('./mark');
const  conversationRoutes = require('./conversation');
const  messageRoutes = require('./message');






module.exports = (app) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/sub-category', subCategoryRoutes);
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/country', countryRoutes);
    app.use('/api/v1/town', townRoutes);
    app.use('/api/v1/article', articleRoutes);
    app.use('/api/v1/basket', lineBasketRoutes);
    app.use('/api/v1/config', configurationRoutes);
    app.use('/api/v1/order', orderRoutes);
    app.use('/api/v1/contact', contactRoutes);
    app.use('/api/v1/claim', claimRoutes);
    app.use('/api/v1/mark', markRoutes);
    app.use('/api/v1/conversation', conversationRoutes);
    app.use('/api/v1/message', messageRoutes);

    // DB seeding
    app.use('/api/v1/seed', require('../../seeder').seed);
    app.use('/api/v1/faker', require('../../facker').fake);
    app.use('/api/v1/faker/clear', require('../../facker').clear);

};
