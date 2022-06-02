import Joi from 'joi'
import {User, RefreshToken} from '../../model'
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtServices from '../../services/JwtServices';
import bcrypt from 'bcrypt'
import { REFRESH_SECRET } from '../../config';

const login_controller = {
    async login (req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const {error} = loginSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try {
            const user = await User.findOne({email : req.body.email})
            if(!user) {
                return next({message:"Invalid Credentials"})
            }
            const matchingPasswrod = await bcrypt.compare(req.body.password, user.password)
            if(!matchingPasswrod) {
                return next(CustomErrorHandler.wrongCredentials())
            }
            const access_token = JwtServices.sign({_id: user._id, role: user.role})
            const refresh_token = JwtServices.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)
            await RefreshToken.create({token: refresh_token})
            res.json({access_token, refresh_token})

        } catch (err) {
            return next(err)
        }
    },

    async logout (req, res, next) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const {error} = refreshSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        try {
            await RefreshToken.deleteOne({token : req.body.refresh_token})
        } catch (err) {
            return next(new Error('Something went wrong in the database'));
        }
        res.json({status: 1, message: "logged out successfully"})
    }


}

export default login_controller