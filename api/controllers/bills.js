const Bill = require('../models/bill');


exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;
    Bill.paginate({}, { page: page, limit: limit,  sort: {_id: 1}, lean: true})
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
    Bill.findById(req.params.id)
        .exec()
        .then(bill => {
            if (!bill) {
                return res.status(404).json({
                    message: "bill  not found"
                });
            }
            res.status(200).json({ bill });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const bill = new Bill({
        user: req.body.user
    });
    bill.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    user: result.user,
                    created_at: result.created_at,
                    updated_at: result.updated_at
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
    Bill.remove({ _id: req.params.id })
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

    Bill.findByIdAndUpdate(req.params.id, {
        updated_at: req.body.updated_at,
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update Bill"})
        }
        res.send({state: "Success"})
    })
};
