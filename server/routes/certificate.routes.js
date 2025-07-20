import express from 'express'
import certificateCtrl from '../controllers/certificate.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/certificates')
    .get(certificateCtrl.list)
    .post(authCtrl.requireSignin, authCtrl.requireAdmin, certificateCtrl.create)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, certificateCtrl.removeAll)

router.route('/api/certificates/:certificateId')
    .get(certificateCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.requireAdmin, certificateCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, certificateCtrl.remove)

router.param('certificateId', certificateCtrl.certificateByID)

export default router
