import Joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken, User } from '../../model';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtServices from '../../services/JwtServices';

const refreshController = {
    async refresh (req, res, next) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const {error} = refreshSchema.validate(req.body)
        if (error) {
            return next(error)
        }
        let refreshToken;
        try {
            const refreshToken = await RefreshToken.findOne({token : req.body.refresh_token})
            if (!refreshToken) {
                return next(CustomErrorHandler.unAuthorized("Invalid Token"))
            }
            let userId
            try {
                const {_id} = JwtServices.verify(refreshToken.token, REFRESH_SECRET)
                const userId = _id
            }catch (err) {
                return next(CustomErrorHandler.unAuthorized("Invalid Token"))
            }
            const user = await User.findOne({_id: userId})
            if(!user) {
                return next(CustomErrorHandler.unAuthorized('User not Found'))
            }
            // Toekn
            const access_token = JwtServices.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
            // database whitelist
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token, refresh_token });
        } catch (err) {
            return next(err)
        }
    } 
}

export default refreshController