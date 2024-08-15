const bcrypt = require('bcrypt');
const DB = require('../../db.config');
const User = DB.User;
const Role = DB.Role;
const ROLES_LIST = JSON.parse(process.env.ROLES_LIST)

async function createUserWithDefaultRole(req, transaction) {
    const { firstname, lastname, email, password } = req.body;

    // Validation des données reçues
    if (!firstname || !lastname || !email || !password) {
        throw new Error('Missing Data');
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email: email }, raw: true });
    if (existingUser !== null) {
        throw new Error('This email is already associated with a user!');
    }

    // Hashage du mot de passe utilisateur
    let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
    req.body.password = hash;

    // Création utilisateur
    const newUser = await User.create(req.body, { transaction });

    // Ajout du rôle utilisateur par défaut
    let created;
    let role;
    [role, created] = await Role.findOrCreate({
        where: { name: ROLES_LIST.client },
        transaction,
    });

    // Ajout du rôle à l'utilisateur
    await newUser.addRole(role, { transaction });

    return newUser;
}

module.exports = { createUserWithDefaultRole };