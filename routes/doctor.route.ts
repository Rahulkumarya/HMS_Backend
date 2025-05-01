import express, {Response,Request, NextFunction } from 'express'
import { createDoctorProfile,updateDoctorProfile,getDoctorProfile,getAllDoctors,searchDoctors,toggleAvailability,deleteDoctorProfile, approveDoctor, toggleCommunication, getDoctorStats, addOrUpdateDoctorReview, getDoctorReviews, deleteDoctorReview } from '../controllers/doctor.controller';
import { DoctorModel } from '../modals/doctor.model';
import { isAuthneticated,authorizeRoles } from '../middleware/auth';

const doctorRoute=express.Router();






//create doctor profile 

// doctorRoute.post('/d-create-profile',createDoctorProfile);


import multer from "multer";
import { parseFormData } from '../middleware/formPaser';
import { updateMedicineShop } from '../controllers/medicineShop.controller';
const upload = multer({ dest: "uploads/" }); // or configure for Cloudinary

doctorRoute.post(
  "/d-create-profile",
 // 👈 middleware to parse stringified JSON
  createDoctorProfile
);


//updateDotorProfile 
doctorRoute.put("/d-update-profile/:id", updateDoctorProfile);

//get doctor profile (individually)
doctorRoute.get('/d-getSingle-profile/:id',getDoctorProfile);

//get all doctor profile 
doctorRoute.get('/d-allDoctor-profile',getAllDoctors);

//doctor search by name and specilization or any others keywords
doctorRoute.get('/d-searchDoctors',searchDoctors);


//doctor toogle (means available or not )
doctorRoute.patch('/d-toogle-profile/:id',toggleAvailability);

doctorRoute.patch(
  "/admin/approve-doctor/:id",
  isAuthneticated,
 authorizeRoles("admin"),
  approveDoctor
);





//doctor delete profile 
doctorRoute.delete('/d-delete-profile/:id',isAuthneticated,deleteDoctorProfile);


//doctor chat/video call router
doctorRoute.patch("/d-toggle-communication/:id", toggleCommunication);


doctorRoute.patch('/d-update/:id',updateMedicineShop);


//doctor stats by admin
doctorRoute.get("/d/admin/stats", getDoctorStats);


//review routes
doctorRoute.post("/d/review/update/:doctorId",addOrUpdateDoctorReview);

doctorRoute.get("/d/get/review/:doctorId", getDoctorReviews);

doctorRoute.delete("/d/:doctorId/review/:userId/:userType", deleteDoctorReview);

export default doctorRoute;