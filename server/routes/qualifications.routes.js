import express from 'express'
import qualificationsCtrl from '../controllers/qualifications.controller.js' 
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/qualifications')
    .get(qualificationsCtrl.list)
    .post(qualificationsCtrl.create)
    .delete(qualificationsCtrl.removeAll)

router.route('/api/qualifications/:qualificationId')
    .get(qualificationsCtrl.read)
    .put(qualificationsCtrl.update)
    .delete(qualificationsCtrl.remove)

router.param('qualificationId', qualificationsCtrl.qualificationByID)

export default router
