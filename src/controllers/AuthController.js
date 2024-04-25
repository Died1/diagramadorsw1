const User = require('../models/User')

class AuthController {

    /**
     * Este método redirige a la vista con el formulario login
     * @param {*} req 
     * @param {*} res 
     * @returns void   
     */
    login(req, res) {
        console.log(req.body);
        res.render('auth/login')
    }

    /**
     * Este método valida que el el usuario exista
     * @param {*} req 
     * @param {*} res 
     * @returns void   
     */
    async verify(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email, password }).exec();
            if (user) {
                req.session.user = user;
                req.session.admin = true;
                res.redirect('/home');
                return;

            } else {
                res.render('auth/login', { alert: 'Usuario no encontrado' })
            }

        } catch (error) {
            console.error('Error al buscar usuario:', err);
            res.render('auth/login', { alert: { alert: 'Error al buscar usuario' } })
        }

    }

    /**
     * Este método redirige a la vista con el formulario para registrar nuevo usuario
     * @param {*} req 
     * @param {*} res 
     * @returns void   
     */
    register(req, res) {
        res.render('auth/register')
    }

    async save(req, res) {
        const user = new User(req.body);
        const result = await user.save();
        console.log(result);
        res.redirect('/home');
    }

    logout(req, res) {
        req.session.destroy(function (err) {
            console.log("Error Al Destruir la session");
        })
        res.redirect('/');
    }

}

module.exports = new AuthController();