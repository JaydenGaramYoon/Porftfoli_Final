import express from 'express'
import skillCtrl from '../controllers/skill.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/skills')
    .get(skillCtrl.list)
    .post(authCtrl.requireSignin, authCtrl.requireAdmin, skillCtrl.create)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, skillCtrl.removeAll)

router.route('/api/skills/:skillId')
    .get(skillCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.requireAdmin, skillCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, skillCtrl.remove)

router.param('skillId', skillCtrl.skillByID)

export default router
