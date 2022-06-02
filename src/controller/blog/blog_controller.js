import Joi from "joi"
import {Blog} from "../../model"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import { auth } from "../../middleware"
const blog_controller = {
    async createblog (req, res, next) {
        
       //requested data valid or not
        const blogschema = Joi.object({
            blog_desc: Joi.string().required(),
            prompts: Joi.string().required(),
        })
        const { blog_desc, prompts } = req.body
        const { error } = blogschema.validate({ blog_desc, prompts } )
        if (error) {
            return next(error)
        }
       
        const blog = new Blog({
            blog:blog_desc,
            prompts,
            users:req.user._id
            })
            let data
            try {
                data = await blog.save()
    
            } catch (err) {
                return next(err)
            }
            res.json({status: 201, data , message:"Blog Create successfully"}).status(201);
    },
    async getblog(req, res, next) {
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
            documents =  await Blog.find(
                {
                    "$or":[
                        {blog:{$regex:key,$options: "i"}},
                    ]
                }
             ).populate({
                path: 'prompts',
                select: 'prompt_title',
                match: { prompt_title: {$ne: key}}
            })
             .populate({ path: 'users', select: 'first_name email' })
            .limit(setlimit).skip(offsetval).sort(sort);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
       return res.json(documents);
    },
    async destroy(req, res, next) {
    
        const documents = await Blog.findOneAndRemove({ _id: req.params.id });
        if (!documents) {
            return next(new Error('Nothing to delete'));
        }
            return res.json({documents, message:"Blog delete successfully" }).status(201);
    },
    
    async update(req, res, next) {
        let updateBlog
        //requested data valid or not
        const blogschema = Joi.object({
            blog_desc: Joi.string().required(),
            prompts: Joi.string().required(),
        })
        const { blog_desc, prompts } = req.body
        const { error } = blogschema.validate({ blog_desc, prompts } )
        if (error) {
            return next(error)
        }
        updateBlog = await Blog.findOneAndUpdate({_id: req.params.id}, {$set:{blog: req.body.blog_desc,prompts: req.body.prompts}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something went wrong please try again!");
            }
            
            return res.json({updateBlog, message:"Blog Update successfully" }).status(201);
        });
    },
    

}

export default blog_controller