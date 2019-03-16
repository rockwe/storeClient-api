const sharp = require('sharp');
const slugify = require('@sindresorhus/slugify');
const fs = require('fs');
const NotificationManager = require('../../helpers/notifications');

const Product = require('../models/product');

exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let priceMax = parseFloat(req.query.priceMax) || null;
    let priceMin = parseFloat(req.query.priceMin) || null;
    let query = req.query.search || '';

    if (!priceMin)
        priceMin = 0;
    if (!priceMax)
        priceMax = Infinity;

    let search = {published: true, available: true};
    let sort = {updated_at: -1};

    search['price'] = { $gte: priceMin, $lte: priceMax };



    if (query.length) {
        query = '.*' + query + '.*';
        search['$or'] = [
            { title: { $regex: query, $options: 'is' } },
            { description: { $regex: query, $options: 'is' } },
        ];
    }



    Product.paginate(search,
        {
            page: page, limit: limit,
            sort: sort,
            populate: [
                { path: 'user', select: 'name' },
            ]
        },
    )
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Product.findById(req.params.id)
        .populate([
            { path: 'user', select: '_id name acceptChats acceptPhone phoneNumber acceptSMS email' },
            { path: 'subCategory', select: 'name', populate: { path: 'category', model: 'Category', select: 'name' } },
            { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
        ])
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "product  not found"
                });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.findSimilar = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 3;
    let product = await Product.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({error: 'Not found'});
    }

    let similar = await Product.paginate({
        subCategory: product.subCategory,
        _id: { $ne: product._id }
    }, {
        page: 1,
        limit: limit,
        sort: { updated_at: -1 },
        populate: [
            { path: 'user', select: '_id name acceptChats acceptPhone phoneNumber acceptSMS' },
            { path: 'subCategory', select: 'name', populate: { path: 'category', model: 'Category', select: 'name' } },
            { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
        ]
    });
    return res.status(200).json(similar);
};

exports.create = (req, res, next) => {
    let pictures = req.body.pictures || [];
    if (pictures.length === 1 && pictures[0] === '*') {
        // IMAGES TO BE UPLOADED
        pictures = [];
    }
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency,
        original_language: req.body.original_language,
        region: req.body.region,
        mark: req.body.mark,
        amount: req.body.amount,
        bar_code: req.body.bar_code,
        number_serial: req.body.number_serial,
        user: req.userData.id,
        subCategory: req.body.subCategory,
        published: true, //req.body.published, // TODO set to false if products are to be validated before publishing
        available: true, //req.body.available,
        // pictures: pictures

    }).save()
        .then(data => {
            NotificationManager.trigger(NotificationManager.EVENTS.NEW_PRODUCT, data);
            res.status(201).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete = (req, res, next) => {
    // TODO delete files
    Product.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Success",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.patch = (req, res, next) => {

    Product.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        price:  req.body.price,
        currency: req.body.currency,
        region: req.body.region,
        subCategory: req.body.subCategory,
        updated_at: new Date(),
        amount: req.body.amount,
        bar_code: req.body.bar_code,
        number_serial: req.body.number_serial
    }, {new: true}, function (err, data) {
        if (err) {
            res.send({state: "erreur update product"})
        }
        if(amount){
            NotificationManager.trigger(NotificationManager.EVENTS.NEW_STOCK, data);
        }
        res.send(data);
    })
}

exports.upload = async (req, res, next) => {
    // console.log(req);
    let random = req.file.destination.replace('./', '') + '/ok/' + [...Array(60)].map(() => Math.random().toString(36)[3]).join('');
    let ext =  req.file.path.split('.');
    ext = ext[ext.length - 1];
    random += '.' + ext;
    sharp(req.file.path).rotate().resize(1024, 800,{
        kernel: sharp.kernel.nearest, // plus proche des bordure que possible
        fit: sharp.fit.contain,
        position: 'center',
        //background: { r: 255, g: 205, b: 195, alpha: 0.5 }
    }).toFile(random).then(res => {
        Product.findOneAndUpdate({_id: req.params.id}, { $push: { pictures: process.env.APP_URL + '/' + random } }).then(res => {
            // TODO create CRON to unlink files
            setTimeout(() => {
                try {
                    fs.unlinkSync(req.file.path); //fs pluging pour manipuler les fichiers
                    console.log(req.file.path + ' successfully unlinked !!!');
                } catch (err) {
                    console.log('COULD NOT DELETE FILE ' + req.file.path, err)
                    // handle the error
                }
            }, (1000 * 60 * 1));
        });
    });

    res.status(200).json({ message: 'Ok' });
};
