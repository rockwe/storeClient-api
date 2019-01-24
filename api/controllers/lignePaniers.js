const LignePanier = require('../models/lignePanier');
const Panier = require('../models/panier');
const Factory = require('../../helpers/LignePanierFactory');



exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    LignePanier.paginate({}, { page: page, limit: limit,  sort :{article: 1}})
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
    LignePanier.findById(req.params.id)
        .exec()
        .then(lignePanier => {
            if (!lignePanier) {
                return res.status(404).json({
                    message: "LignePanier  not found"
                });
            }
            res.status(200).json({ lignePanier });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = async (req, res, next) => {
    let c = Factory.getPanier(req.userData);
    console.log(req.userData);
    let check = await LignePanier.findOne({ panier: c._id, article: req.body.article }).exec();
    if (check) {
        check.quantity = req.body.quantity;
        check.save();
        res.status(200).json({ message: 'OK'});
    } else {
        const lignePanier = new LignePanier({
            article: req.body.article,
            panier: c._id,
            price: req.body.price,
            quantity: req.body.quantity,
        });

        lignePanier.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Success",
                    data: {
                        _id: result._id,
                        article: result.article,
                        panier: result.panier,
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
LignePanier.remove({_id: req.params.id})
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

    LignePanier.findByIdAndUpdate(req.params.id, {
        quantity: req.body.quantity,
        updated_at: req.body.updated_at,
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update LignePanier"})
        }
        res.send({state: "Success"})
    })
};
