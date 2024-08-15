/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const userCtrl = require('../controllers/User')
const roleCheck = require("../middlewares/roleCheck")
const jwtCheck = require("../middlewares/jwtCheck")

const ROLES_LIST = JSON.parse(process.env.ROLES_LIST)

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */


/**********************************/
/*** Routage de la ressource User */
// router.get('/', jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin), userCtrl.getAllUsers)   
router.get('/', userCtrl.getAllUsers)

router.get('/:id([0-9]+)', userCtrl.getUser) // jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin, "owner"), 

// router.get('/me', userCtrl.getMe) // jwtCheck, 

router.put('', userCtrl.addUser) // jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin), 
// router.put('', userCtrl.addUser)

router.patch('/:id([0-9]+)', userCtrl.updateUser) // jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin, "owner"), 
router.delete('/:id([0-9]+)', userCtrl.deleteUser) // jwtCheck, roleCheck(ROLES_LIST.admin), 

router.get('/:id([0-9]+)/roles', userCtrl.getUserRoles) //jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin), 
router.post('/:id([0-9]+)/roles/:role([0-9]+)', userCtrl.addUserRole) // jwtCheck, roleCheck(ROLES_LIST.admin), 
router.delete('/:id([0-9]+)/roles/:role([0-9]+)', userCtrl.deleteUserRole) // jwtCheck, roleCheck(ROLES_LIST.admin), 
module.exports = router