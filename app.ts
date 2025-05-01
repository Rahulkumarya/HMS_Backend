require('dotenv').config();
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
// import exp from 'constants';
import { Request,Response,NextFunction } from 'express';
import {ErrorMiddleware} from './middleware/error';
import userRouter from './routes/user.route';
import doctorRouter from './routes/doctor.route'
import patientRouter from './routes/patient.route';
import { appointmentRouter } from './routes/appointment.route';
import orderRouter from './routes/order.route';
import notificationRoute from './routes/notification.route';
import { reportRouter } from './routes/patient-report.router';
import layoutRouter from './routes/layout.route';
import { setupSocket } from './socket';


import http from "http"
import { availabilityRouter } from './routes/availability.route';
import officeRouter from './routes/admin-office.router';
import { getrecRouter } from './routes/getrecommended.route';
import reports from './routes/reports/doctor-report.route';
import  medicineRouter from './routes/medicine.route';
import clinicRouter from './routes/clinic.route';
import diaRouter from './routes/diagnostic.route';
import resortRouter from './routes/resort.route';
// import { reportRouter } from './routes/patient-report.router';


export const app = express();

const server =http.createServer(app);

//initialize the socket.io for chat and video calling
setupSocket(server)


//body parser
app.use(express.json({limit:"500mb"}));


//cookie parser
app.use(cookieParser());

app.set('trust proxy', 1);


// cors == cross origin resource sharing


app.use(cors({
    // origin:process.env.ORIGIN
    //fronted part running port url
    origin:['http://localhost:8000'],

    

    credentials:true,
}));




//routes

app.use("/api/vs",userRouter);
app.use("/api/vs",doctorRouter);
app.use("/api/vs/patient",patientRouter);
app.use("/api/vs/patient",reportRouter);
app.use("/api/vs/doctor", reports);
app.use("/api/vs/appointment",appointmentRouter)
app.use("/api/vs/availability",availabilityRouter);
app.use("/api/vs/office",officeRouter);
app.use("/api/vs/recommended",getrecRouter);
app.use("/api/vs",orderRouter);
app.use("/api/vs",notificationRoute);
app.use("/api/vs/",layoutRouter);
app.use("/api/vs/medicine",medicineRouter);
app.use("/api/vs/clinic",clinicRouter);
app.use("/api/vs/diagnostic",diaRouter)
app.use("/api/vs/resort",resortRouter)

//testing route
app.get("/test",(req: Request ,res: Response ,next: NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"Api is Working",
    });
});


//all route

app.all("*",(req: Request,res: Response,next: NextFunction)=>{
    const err=new Error(`Route ${req.originalUrl}not found`) as any;
    err.statusCode=404;
    next(err);
});



//error handler uses

app.use(ErrorMiddleware);


