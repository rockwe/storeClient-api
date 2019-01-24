const Panier = require('../api/models/panier');

exports.getPanier = async (user) => {
    let panier = await Panier.findOne(
        {user: user.id}

    ).exec();

    if(!panier) {
        panier = await new Panier({
            user: user.id,
        }).save();
    }

    return Promise.resolve(panier);
};