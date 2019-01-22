const userRoutes = require('./user');
const Device = require('../models/device')
const  subCategoryRoutes = require('./subCategory');
const  categoryRoutes = require('./category');
const  countryRoutes = require('./country');
const  townRoutes = require('./town');
const  articleRoutes = require('./article');


const Pusher = require('../../helpers/pusher')



module.exports = (app) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/sub-category', subCategoryRoutes);
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/country', countryRoutes);
    app.use('/api/v1/town', townRoutes);
    app.use('/api/v1/article', articleRoutes);



    // PUSHER
    app.post('/api/v1/pusher/auth', (req, res, next) => {
        console.log('CALLED PUSHER AUTH')
        let socketId = req.body.socket_id;
        let channel = req.body.channel_name;
        let presenceData = {
            user_id: 'unique_user_id',
            user_info: {
                name: 'Mr Channels',
                twitter_id: '@pusher'
            }
        };
        let auth = Pusher.instance().authenticate(socketId, channel, presenceData);
        res.send(auth);
    });
    app.use('/api/v1/pusher', (req, res, next) => {
        Pusher.trigger('my-channel', 'my-event', {
            "message": "Message from server"
        });
        res.status(200).json({});
    });

    app.use('/api/v1/push', async (req, res, next) => {
        const devices = await Device.find({ pushToken: { $ne: null } });
        devices.map(d => {
            FCM.send(d.pushToken, {title: 'TEST', body: 'Hello world'}, null);
        });
        res.status(200).json({});
    });


};
