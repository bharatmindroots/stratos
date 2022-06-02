import express from "express";
import mongoose from "mongoose";
import routes from './src/routes'
import { APP_PORT, CONNECTION_URL } from "./src/config";
import errorHandler from "./src/middleware/errorHandler";
import { fetchJson } from 'fetch-json';

const app = express()


// mongodb connection
mongoose.connect(`${CONNECTION_URL}`, 
	{
    useNewUrlParser: true,
    useUnifiedTopology: true
	}
).then(() => {
	console.log('Mongodb connected!')
}).catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//routes
app.use('/api', routes)

//
const url =    'https://graph.facebook.com/me?fields=id,name,email&access_token=EAAa2bUTwu3ABAJtZBQU7te5mkkzZCZArTS9BLe4qQvz8foivWBnh2JLUDY4bhpaGUymCpB7c1PJUlxl0T8i3GZAMd9HuQneZB4ktiaQmB38Cw83OvgpGZBAJaUHl0Mgeeb3415lKYDV2TuO0FSHBq9f0AenQMUpI5HZCnLIQdBSubTH0Dg3EsgSwR7uFY9o5wtFe8iB4IUjGHYv0ALZC3tDMXnIXtVkB2iDGWyZCZCQwDuBZBgNMpzRWZBhIj6M3CGWS80EZD';
const params = { api_key: 'DEMO_KEY' };
const handleData = (data) =>
   console.log('Facebook data:', data);
fetchJson.get(url, params).then(handleData);



app.use(errorHandler)

app.listen(APP_PORT, ()=> {
    console.log(`App is running on ${APP_PORT}`)
})


