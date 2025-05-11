import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB  from './DB/connection.js';
import authRouter from './src/modules/auth/auth.router.js';
import userRouter from './src/modules/user/user.router.js';
import postRouter from './src/modules/posts/post.router.js';
import morgan from 'morgan';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB.connect();

app.use(morgan('dev'));

app.use(express.json());
app.use(cors())

app.use('/auth', authRouter);
app.use("/user", userRouter);
app.use('/posts', postRouter);


app.use((error ,req ,res , next)=>{
  const statusCode = error.cause||500
  
  return res.status(statusCode).json({
      success:false,
      message:error.message,
      stack:error.stack
  })
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
