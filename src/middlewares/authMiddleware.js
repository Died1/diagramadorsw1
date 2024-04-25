const authMiddleware = async function (req, res, next) {    
    if (req.session.user) {
        req.user = req.session.user;
        return next();
    } else {
        return res.redirect('/login');
    }
};
module.exports = authMiddleware;