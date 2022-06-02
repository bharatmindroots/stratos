import {Layer} from "../../../model"
import Joi from "joi"
import CustomErrorHandler from '../../../services/CustomErrorHandler'

const layer_controller = {
    async createlayer (req, res, next) {
        //requested data valid or not
        const layerschema = Joi.object({
            layer_name: Joi.string().required()
        })

       const { error } = layerschema.validate(req.body)
        if (error) {
            return next(error)
        }
       const { layer_name } = req.body

       const layer = new Layer({
        layer_name
        })
        let data
        try {
            data = await layer.save()

        } catch (err) {
            return next(err)
        }
        res.json({status: 201, data , message:"Layer Create successfully"}).status(201);
    },
    async destroy(req, res, next) {
        console.log(req.params.id)
        const document = await Layer.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
            return res.json({document, message:"Layer delete successfully" }).status(201);
    },
    
    async update(req, res, next) {

        let updateLayer
         //requested data valid or not
         const layerschema = Joi.object({
            layer_name: Joi.string().required()
        })

       const { error } = layerschema.validate(req.body)
        if (error) {
            return next(error)
        }
        updateLayer = await Layer.findOneAndUpdate({_id: req.params.id}, {$set:{layer_name: req.body.layer_name}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something went wrong please try again!");
            }
            
            return res.json({updateLayer, message:"Layer Update successfully" }).status(201);
        });
    },
    async getLayer(req, res, next) {
        let documents;
        const sort = {} 
        let setlimit = 10;
        if(req.query.perPage)
          setlimit = req.query.perPage;
        let page = 1;
        if(req.query.page)
          page = req.query.page;
        const offsetval = (parseInt(page)-1)*parseInt(setlimit);
        if(req.query.sortBy){
            const str = req.query.sortBy.split(':')
            sort[str[0]] = str[1] === 'desc' ? -1:1
        }
        let key = '';
        if(req.query.key){
            key = req.query.key
        }
        console.log(req.query.key);
        try {
            
            documents =  await Layer.find(
                {
                    "$or":[
                        {layer_name:{$regex:key,$options: "i"}}
                    ]
                }
            ).limit(setlimit).skip(offsetval).sort(sort);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
       return res.json(documents);
    },
    
}

export default layer_controller