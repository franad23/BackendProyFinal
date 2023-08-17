import { Router } from "express";
import { postNewForm, 
  gettingUserAllForms, 
  gettingForm, 
  deleteForm,
  modifyForm,
  gettingFormToResp,
  postUserForm,
  gettingResponses} from "../controllers/forms.controllers.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router =  Router();

router.get('/getFormtoresp/:id', gettingFormToResp);
router.post('/postFormToResp/:id', postUserForm);

router.post('/postForm', verifyToken, postNewForm);
router.get('/getFormuserform', verifyToken, gettingUserAllForms);
router.get('/getFormuserform/:id', verifyToken, gettingForm);
router.get('/gettingResponses/:id', verifyToken, gettingResponses);
router.delete('/deleteform/:id', verifyToken, deleteForm);
router.patch('/modifyform/:id', verifyToken, modifyForm);


export default router;