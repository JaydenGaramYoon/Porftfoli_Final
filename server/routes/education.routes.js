import express from 'express'
import educationCtrl from '../controllers/education.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/education')
    .get(educationCtrl.list)
    .post(authCtrl.requireSignin, authCtrl.requireAdmin, educationCtrl.create)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, educationCtrl.removeAll)

router.route('/api/education/:educationId')
    .get(educationCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.requireAdmin, educationCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, educationCtrl.remove)

router.param('educationId', educationCtrl.educationByID)

export default router
