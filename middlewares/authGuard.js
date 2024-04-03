const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authGuard = async (req, res, next) => {

    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(" ")[1];

    if(!token) {
        res.status(401).json({errors: ["Acesso negado, authorization header not found"]});
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        req.user = await User.findById(verified.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({errors: ["Token inválido..."]});
    }
}

module.exports = authGuard;