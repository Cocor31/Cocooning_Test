/*************************/
/*** Import used modules */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const DB = require("../db.config")
const { createUserWithDefaultRole } = require('./utils/userUtils')
const { handleBadRequestError, handleNotFoundError, handleUnauthorizedError, handleServerError } = require('./utils/errorHandler')
const User = DB.User
const Role = DB.Role

/**********************************/
/*** Unit route for Auth resource */

exports.login = async (req, res) => {
    const { email, password } = req.body
    // Check data from request
    if (!email || !password) {
        return handleBadRequestError(res, 'Bad credentials')
    }

    try {
        // Get user
        let user = await User.findOne({ where: { email: email }, include: Role })
        // Test si résultat
        if (user === null) {
            return handleNotFoundError(res, `This user does not exist !`)
        }
        // Password check  
        let test = await bcrypt.compare(password, user.password)
        if (!test) {
            return handleUnauthorizedError(res, `This user does not exist !`)
        }

        // Get roles
        const roles = user.Roles.map((role) => role.name)

        // JWT generation
        const token = jwt.sign({
            payload: { userId: user.id, userName: user.pseudo, roles: roles } // roles: JSON.parse(user.roles).roles
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        // User public data
        const userPublicData = {
            id: user.id,
            pseudo: user.pseudo,
            photo: user.photo,
        };

        return res.json({ access_token: token, user_public_data: userPublicData })
    } catch (err) {
        return handleServerError(res, err)
    }
}

exports.signIn = async (req, res) => {
    // Créer une nouvelle transaction
    const transaction = await DB.sequelize.transaction();

    try {
        // Créer l'utilisateur avec le rôle par défaut
        const newUser = await createUserWithDefaultRole(req, transaction);

        // Valider la transaction
        await transaction.commit();

        return res.status(201).json({ message: 'User Created', data: newUser });

    } catch (err) {
        await transaction.rollback(); // Annuler la transaction en cas d'erreur
        return handleServerError(res, err)
    }
};

