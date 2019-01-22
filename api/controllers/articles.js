const sharp = require('sharp');
const slugify = require('@sindresorhus/slugify');
const fs = require('fs');
const NotificationManager = require('../../helpers/notifications');

const Article = require('../models/article');

exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let dateSort = parseInt(req.query.dateSort) || -1;
    let priceSort = parseInt(req.query.priceSort) || null;
    let priceMax = parseFloat(req.query.priceMax) || null;
    let priceMin = parseFloat(req.query.priceMin) || null;
    let regionFilter = req.query.region || '';
    let subCatFilter = req.query.subCategory || '';
    let fixedPrice = req.query.hasOwnProperty('priceFixed') ? req.query.priceFixed : null;
    let exchange = req.query.hasOwnProperty('exchange') ? req.query.exchange : null;
    let query = req.query.search || '';
    let owner = req.query.user || null;

    if (!priceMin)
        priceMin = 0;
    if (!priceMax)
        priceMax = Infinity;

    let search = {published: true, available: true};
    let sort = {updated_at: -1};

    search['price.amount'] = { $gte: priceMin, $lte: priceMax };

    if (regionFilter.trim().length) {
        let regions = regionFilter.split(',').filter(r => r.length > 0);
        // TODO why not $in ?
        search['region'] = { $in: regions };
    }
    if (subCatFilter.trim().length) {
        // TODO why not $in ?
        search['subCategory'] = { $in: subCatFilter.split(',') };
    }
    if (fixedPrice !== null)
        search['price.fixed'] = fixedPrice;
    if (exchange !== null)
        search['exchange'] = exchange;
    if (query.length) {
        query = '.*' + query + '.*';
        search['$or'] = [
            { title: { $regex: query, $options: 'is' } },
            { description: { $regex: query, $options: 'is' } },
        ];
    }

    if (priceSort) {
        sort['price.amount'] = priceSort;
        delete sort['updated_at'];
    } else if (dateSort)
        sort['updated_at'] = dateSort;

    if (owner) {
        search['user'] = owner;
    }
    Article.paginate(search,
        {
            page: page, limit: limit,
            sort: sort,
            populate: [
                { path: 'user', select: 'name' },
                { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
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
    Article.findById(req.params.id)
        .populate([
            { path: 'user', select: '_id name acceptChats acceptPhone phoneNumber acceptSMS email' },
            { path: 'subCategory', select: 'name', populate: { path: 'category', model: 'Category', select: 'name' } },
            { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
        ])
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "article  not found"
                });
            }
            if (req.userData && doc._id !== req.userData.id) {
                NotificationManager.trigger(NotificationManager.EVENTS.NEW_VISIT, { user: req.userData, article: doc });
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
    let article = await Article.findById(req.params.id).exec();
    if (!article) {
        return res.status(404).json({error: 'Not found'});
    }

    let similar = await Article.paginate({
        subCategory: article.subCategory,
        _id: { $ne: article._id }
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
    /*if (!pictures.length)
        pictures.push('res://ic_no_image');*/
    if (pictures.length === 1 && pictures[0] === '*') {
        // IMAGES TO BE UPLOADED
        pictures = [];
    }
    const article = new Article({
        title: req.body.title,
        slug: slugify(req.body.title, { customReplacements: [['&', '']] }),
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            fixed: req.body.price.fixed
        },
        currency: req.body.currency,
        //picture: req.body.picture,
        region: req.body.region,
        //displayPhoneNumber: req.body.displayPhoneNumber, // Moved to user model
        //displayEmail: req.body.displayEmail,  // Moved to user model
        user: req.userData.id,
        subCategory: req.body.subCategory,
        exchange: req.body.exchange,
        published: true, //req.body.published, // TODO set to false if articles are to be validated before publishing
        available: true, //req.body.available,
        // pictures: pictures

    }).save()
        .then(data => {
            NotificationManager.trigger(NotificationManager.EVENTS.NEW_ARTICLE, data);
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
    Article.remove({ _id: req.params.id })
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

    Article.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        price: { amount: req.body.price.amount, fixed: req.body.price.fixed },
        currency: req.body.currency,
        region: req.body.region,
        subCategory: req.body.subCategory,
        updated_at: new Date()
        //displayPhoneNumber: req.body.displayPhoneNumber,
        //displayEmail: req.body.displayEmail,
        //picture: req.body.picture,
        // user: req.body.user,
        //published: req.body.published,
        //available: req.body.available,
    }, {new: true}, function (err, data) {
        if (err) {
            res.send({state: "erreur update article"})
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
        Article.findOneAndUpdate({_id: req.params.id}, { $push: { pictures: process.env.APP_URL + '/' + random } }).then(res => {
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
