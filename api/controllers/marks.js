const Mark = require('../models/mark');


exports.fetch =(req, res, next) => {
    Mark.find()
        .exec()
        .then(docs => {
            res.status(200).json({docs})
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Mark.findById(req.params.id)
        .exec()
        .then(mark => {
            if (!mark) {
                return res.status(404).json({
                    message: "mark  not found"
                });
            }
            res.status(200).json({ mark });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const mark = new Mark({
        name: req.body.name
    });
    mark.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    name: result.name
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
    Mark.remove({ _id: req.params.id })
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

    Mark.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update mark"})
        }
        res.send({state: "Success"})
    })
};
