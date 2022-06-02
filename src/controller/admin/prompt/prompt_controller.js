import {Prompts} from "../../../model"
import Joi from "joi"
import CustomErrorHandler from '../../../services/CustomErrorHandler'

const prompt_controller = {
    async createprompt (req, res, next) {
        //requested data valid or not
        const promptschema = Joi.object({
            prompt_title: Joi.string().required()
        })

       const { error } = promptschema.validate(req.body)
        if (error) {
            return next(error)
        }
       const { prompt_title } = req.body

       const prompt = new Prompts({
        prompt_title
        })
        let data
        try {
            data = await prompt.save()

        } catch (err) {
            return next(err)
        }
        res.json({status: 201, data , message:"Prompts Create successfully"}).status(201);
    },
    async destroy(req, res, next) {
        const document = await Prompts.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
            return res.json({document, message:"Prompts delete successfully" }).status(201);
    },
    
    async update(req, res, next) {
        let updatePrompt
        //requested data valid or not
        const promptschema = Joi.object({
            prompt_title: Joi.string().required()
        })

       const { error } = promptschema.validate(req.body)
        if (error) {
            return next(error)
        }
        updatePrompt = await Prompts.findOneAndUpdate({_id: req.params.id}, {$set:{prompt_title: req.body.prompt_title}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something went wrong please try again!");
            }
            
            return res.json({updatePrompt, message:"Prompt Update successfully" }).status(201);
        });
    },
    async getprompt(req, res, next) {
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
            
            documents =  await Prompts.find(
                {
                    "$or":[
                        {prompt_title:{$regex:key,$options: "i"}}
                    ]
                }
            ).limit(setlimit).skip(offsetval).sort(sort);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
       return res.json(documents);
    },
    
}

export default prompt_controller