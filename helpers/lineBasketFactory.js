const Basket = require('../api/models/basket');

exports.getBasket = async (user) => {
    let panier = await Basket.findOne(
        {user: user.id}

    ).exec();

    if(!panier) {
        basket = await new Basket({
            user: user.id,
        }).save();
    }

    return Promise.resolve(basket);
};