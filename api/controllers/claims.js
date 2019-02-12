const Claim = require('../models/claim');


exports.find = (req, res, next) => {
    Claim.findById(req.params.id)
        .exec()
        .then(contact => {
            if (!contact) {
                return res.status(404).json({
                    message: "contact  not found"
                });
            }
            res.status(200).json({town});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {

    const claim = new Claim({
        title: req.body.title,
        description: req.body.description
    });
    claim.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: result
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
    Claim.remove({_id: req.params.id})
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

    Claim.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update claim"})
        }
        res.send({state: "Success"})
    })
};