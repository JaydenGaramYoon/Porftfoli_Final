import express from 'express';
import serviceCtrl from '../controllers/services.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/services')
    .get(serviceCtrl.list)  // 모든 사용자가 조회 가능
    .post(authCtrl.requireSignin, authCtrl.requireAdmin, serviceCtrl.create)  // Admin만 생성 가능
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, serviceCtrl.removeAll);  // Admin만 전체 삭제 가능

router.route('/api/services/:serviceId')
    .get(serviceCtrl.read)  // 모든 사용자가 개별 조회 가능
    .put(authCtrl.requireSignin, authCtrl.requireAdmin, serviceCtrl.update)  // Admin만 수정 가능
    .delete(authCtrl.requireSignin, authCtrl.requireAdmin, serviceCtrl.remove);  // Admin만 삭제 가능

router.param('serviceId', serviceCtrl.serviceByID);

export default router;
