import  express from 'express';
import {dbConnection } from './config/db.js';
import  authRouter from './routes/auth.route.js';
import  userRouter from './routes/user.route.js';
import {configDotenv} from 'dotenv';
import messageRouter from './routes/message.route.js';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();

configDotenv();
app.use(cors());

app.use(express.json())

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/messages', messageRouter );


// Handle unhandled routes
app.use((req,res) =>{
    res.json({message: "not handler path"})
})

// Global error handler
app.use((err,req,res,next)=>{
    const statusCode = err.status || 500;
    res.status(statusCode).json({Error:err.message, status: statusCode})
})


const serverApp = app.listen(parseInt(process.env.PORT), () => {
    console.log('Server is running')
    dbConnection();
})

// Connect ass a Backend wih socket.io
const io = new Server(serverApp, {
    cors: { origin: '*' }
});  

io.on ('connection', (socket) => {
    console.log(socket);
});
    