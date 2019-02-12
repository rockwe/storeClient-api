const LineBasket = require('../models/lineBasket');
const Factory = require('../../helpers/lineBasketFactory');



exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    LineBasket.paginate({}, { page: page, limit: limit,  sort :{article: 1}})
    //.exec()
        .then(docs => {
            res.status(200).json( docs

            );
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    LineBasket.findById(req.params.id)
        .exec()
        .then(lineBasket => {
            if (!lineBasket) {
                return res.status(404).json({
                    message: "LineBasket  not found"
                });
            }
            res.status(200).json({ lineBasket });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = async (req, res, next) => {
    let c = Factory.getBasket(req.userData);
    console.log(req.userData);
    let check = await LineBasket.findOne({ basket: c._id, product: req.body.product }).exec();
    if (check) {
        check.quantity = req.body.quantity;
        check.save();
        res.status(200).json({ message: 'OK'});
    } else {
        const lineBasket = new LineBasket({
            product: req.body.product,
            basket: c._id,
            price: req.body.price,
            quantity: req.body.quantity,
        });

        lineBasket.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Success",
                    data: {
                        _id: result._id,
                        product: result.product,
                        basket: result.basket,
                        price: result.price,
                        quantity: result.quantity
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    };
}

exports.delete = (req, res, next) => {
LineBasket.remove({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Success"
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.patch = (req, res, next) => {

    LineBasket.findByIdAndUpdate(req.params.id, {
        quantity: req.body.quantity,
        updated_at: req.body.updated_at,
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update LineBasket"})
        }
        res.send({state: "Success"})
    })
};
