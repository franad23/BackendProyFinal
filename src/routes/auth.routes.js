import { Router } from "express";
import { 
  register, 
  login, 
  verifyTokenToFront, 
  logout,
  getUserToVerify,
  verifyUser,
  sendEmailToRecovery,
  modifyPasswordUser } from "../controllers/auth.controllers.js";


const router =  Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyTokenToFront)
router.get('/toverifyemail/:id', getUserToVerify)
router.patch('/toverifyemail/:id', verifyUser)
router.post('/recoverypassword', sendEmailToRecovery)
router.post('/recoverypasswordPage/:id', modifyPasswordUser)

export default router;