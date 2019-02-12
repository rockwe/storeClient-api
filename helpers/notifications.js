const FCM = require('./firebase');

const User = require('../api/models/user');
const Device = require('../api/models/device');
const Category = require('../api/models/category');
const SubCategory = require('../api/models/subCategory');
const Mark = require('../api/models/mark');

let TITLE = '';
let MESSAGE = '';

const NOTIFICATION_EVENTS = {
    NEW_PRODUCT: 'product',
    NEW_VISIT: 'visit',
    NEW_STOCK: 'stock',
};

exports.EVENTS = NOTIFICATION_EVENTS;

exports.trigger = async (event, data) => {
    // TODO validate data with the above rules to prevent errors
    MESSAGE = '';
    let users = [];
    switch (event) {
        case NOTIFICATION_EVENTS.NEW_PRODUCT:
            TITLE = 'New product';
            let cat_id = null, cat_name = null;
            if (!data.subCategory.category) {
                const subcat = await SubCategory.findOne({_id: data.subCategory }).populate('category', '_id name').exec();
                cat_id = subcat.category._id;
                cat_name = subcat.category.name;
            } else {
                cat_id = data.subCategory.category._id;
            }
            const owner = await User.findOne({ _id: data.user }).exec();
            if (cat_name)
                MESSAGE = `${owner.name} a publié un nouveau produit dans la catégorie ${cat_name}`;

            users = await User.find({pushCategories: cat_id, _id: { $ne: data.user }}).exec();
            break;
        case NOTIFICATION_EVENTS.NEW_STOCK:
            TITLE = 'Nouveau stock';
            const mark_name = await Mark.findOne({ _id: data.name}).exec();
            if(mark_name){
                MESSAGE = `${owner.mane} a ajouter un nouveau stock de la marque ${mark_name}`
            }
            break;

        case NOTIFICATION_EVENTS.NEW_VISIT:
            const visitor = await User.findOne({ _id: data.user.id}).exec();
            TITLE = 'Nouvelle visite';
            MESSAGE = `${visitor.name} a visiter votre Produit  ${data.product.title}`;
            users = await User.find({ $and: [ {_id: data.product.user._id}, {_id: { $ne: visitor._id}} ], notifyOnProductVisite: true}).exec();
            break;
    }
    //console.log(users);
    users.map(u => {
       Device.find({ user: u._id, pushToken: { $ne: null } }).exec().then(devices => {
           devices.map(d => {
               FCM.send(d.pushToken, { title: TITLE, body: MESSAGE, event: event });
           })
       });
    });
};
