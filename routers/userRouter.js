const express = require('express')
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController')

const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')

const router = express.Router()

// All routes in this file are protected and restricted to admins
router.use(auth)
router.use(authorize('admin'))

router.route('/').post(createUser).get(getUsers)

router.route('/:id').all(auth).get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
