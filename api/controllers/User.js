/***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')
const DB = require('../db.config')
const { createUserWithDefaultRole } = require('./utils/userUtils')
const { handleServerError, handleNotFoundError, handleBadRequestError } = require('./utils/errorHandler')
const User = DB.User
const Role = DB.Role


/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getUser = async (req, res) => {
    let pid = parseInt(req.params.id)

    try {
        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid }, include: Role })
        if (user === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        return res.json({ data: user })
    } catch (err) {
        return handleServerError(res, err);
    }
}

exports.addUser = async (req, res) => {
    const { roles } = req.body;

    // Créer une nouvelle transaction
    const transaction = await DB.sequelize.transaction();

    try {
        // Créer l'utilisateur avec le rôle par défaut
        const newUser = await createUserWithDefaultRole(req, transaction);

        // Role
        let userRoles = [];
        if (roles && Array.isArray(roles)) {
            for (const roleObj of roles) {
                const roleId = roleObj.id;
                const role = await DB.Role.findOne({ where: { id: roleId } });
                if (role) {
                    userRoles.push(role);
                }
            }
        }

        // Ajout des rôles à l'utilisateur
        if (userRoles.length > 0) {
            await newUser.addRoles(userRoles, { transaction });
        }

        // Valider la transaction
        await transaction.commit();

        return res.status(201).json({ message: 'User Created', data: newUser });

    } catch (err) {
        await transaction.rollback(); // Annuler la transaction en cas d'erreur
        return handleServerError(res, err)
    }
};

exports.updateUser = async (req, res) => {
    let pid = parseInt(req.params.id)
    const { firstname, lastname, email, password, photo } = req.body

    try {
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid }, raw: true })
        if (user === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        // récupération des données
        let userp = {}
        if (firstname) { userp.firstname = firstname }
        if (lastname) { userp.lastname = lastname }
        if (email) { userp.email = email }
        if (password) {
            // Password Hash
            let hash = await bcrypt.hash(password, parseInt("process.env.BCRYPT_SALT_ROUND"))
            userp.password = hash
        }

        if (photo !== undefined) {
            userp.photo = photo;
        }

        // Mise à jour de l'utilisateur
        await User.update(userp, { where: { id: pid } })
        return res.json({ message: 'User Updated', data: { ...user, ...userp } })
    } catch (err) {
        return handleServerError(res, err)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let pid = parseInt(req.params.id)

        // Suppression
        let count = await User.destroy({ where: { id: pid } })
        // Test si résultat
        if (count === 0) {
            return handleNotFoundError(res, 'This user does not exist !')
        }
        // Message confirmation Deletion
        return res.status(200).json({ message: `User (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return handleServerError(res, err)
    }
}

exports.getUserRoles = async (req, res) => {
    try {
        let pid = parseInt(req.params.id)

        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid }, include: Role })
        if (user === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        //Recupération des roles
        return res.json({
            "data": {
                "UserId": user.id,
                "roles": user.Roles.map((role) => role.name)
            }

        })
    } catch (err) {
        return handleServerError(res, err)
    }
}

exports.addUserRole = async (req, res) => {
    try {
        let pid = parseInt(req.params.id);
        let roleId = parseInt(req.params.role);

        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid } });
        if (user === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        // Récupération du rôle et vérification
        let role = await Role.findOne({ where: { id: roleId } });
        if (role === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        // Vérification si le rôle est déjà associé à l'utilisateur
        let userRoles = await user.getRoles();
        let roleIds = userRoles.map((userRole) => userRole.id);
        if (roleIds.includes(role.id)) {
            return handleBadRequestError(res, 'This role is already associated with the user !')
        }

        // Ajout du rôle à l'utilisateur
        await user.addRole(role);

        return res.json({ message: 'User role Updated', data: { role: role.name } });
    } catch (err) {
        return handleServerError(res, err)
    }
};

exports.deleteUserRole = async (req, res) => {
    try {
        let pid = parseInt(req.params.id);
        let roleId = parseInt(req.params.role);

        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid } });
        if (user === null) {
            return handleNotFoundError(res, 'This user does not exist !')
        }

        // Récupération du rôle et vérification
        let role = await Role.findOne({ where: { id: roleId } });
        if (role === null) {
            return handleNotFoundError(res, 'This role does not exist !')
        }

        // Vérification si le rôle est déjà associé à l'utilisateur
        let userRoles = await user.getRoles();
        let roleIds = userRoles.map((userRole) => userRole.id);
        if (!roleIds.includes(role.id)) {
            return handleBadRequestError(res, 'This role is not associated with the user !')
        }

        // Suppression du rôle de l'utilisateur
        await user.removeRole(role);

        return res.json({ message: 'User role Deleted', data: { role: role.name } });
    } catch (err) {
        return handleServerError(res, err)
    }
};