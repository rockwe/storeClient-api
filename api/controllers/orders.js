const Order = require('../models/order');


exports.fetch =(req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        user: doc.user,
                        code: doc.code,
                       // line_basket: doc.line_basket,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/order/" + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Order.findById(req.params.id)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "commander  not found"
                });
            }
            res.status(200).json({ data: order });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const order = new Order({
        user: req.body.user,
        //line_basket: req.body.line_basket,
        reference: req.body.user,

    });
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    user: result.user,
                    line_basket: result.line_basket
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
exports.delete = (req, res, next) => {
    Order.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Succes"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.patch = (req, res, next) => {

    Order.findByIdAndUpdate(req.params.id, {
        isvalid: req.body.isvalid,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update order"})
        }
        res.send({state: "Success"})
    })
};