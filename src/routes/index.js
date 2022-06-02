import express from "express";
import { register_controller, blog_controller, login_controller, otp_controller,layer_controller, prompt_controller} from "../controller";
import {auth, admin} from '../middleware'

const router = express.Router()

//Authentication
router.post('/register', register_controller.register)
router.post('/login', login_controller.login)
router.post('/logout', login_controller.logout)
router.post('/sendotp', auth, otp_controller.otp_register)

//Admin

//layers
router.post('/createlayer',[auth, admin],layer_controller.createlayer)
router.delete('/deletelayer/:id',[auth, admin],layer_controller.destroy)
router.put('/updatelayer/:id',[auth, admin],layer_controller.update)
router.get('/getlayer',[auth, admin],layer_controller.getLayer)


//prompt
router.post('/createprompt',[auth, admin],prompt_controller.createprompt)
router.delete('/deleteprompt/:id',[auth, admin],prompt_controller.destroy)
router.put('/updateprompt/:id',[auth, admin],prompt_controller.update)
router.get('/getprompt',[auth, admin],prompt_controller.getprompt)

//User

//Blog
router.post('/createblog',auth, blog_controller.createblog)
router.get('/getblog',auth, blog_controller.getblog)
router.delete('/deleteblog/:id',auth,blog_controller.destroy)
router.put('/updateblog/:id',auth,blog_controller.update)



export default router