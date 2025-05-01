import express from "express";
import { upload } from "../../utils/multer";
import {
 
  messagess,
  trackMessageStatus,
  uploadDoctorCertificates,
  uploadDoctorGallery,
  
} from "../../controllers/reports/doctor-report.controller";

export const reports = express.Router();

reports.post(
  "/upload/gallery/:_id",
  upload.array("gallery", 5),
  uploadDoctorGallery
);
reports.post(
  "/upload/certifications",
  upload.array("certifications", 5),
  uploadDoctorCertificates
);
// reports.post(
//   "/upload/awards",
//   upload.array("awards", 5),
//   uploadDoctorAwards
// );









require("dotenv").config();

export const client = require("twilio")(
  process.env.accountSid,
  process.env.authToken
);


reports.post("/hh",messagess);

reports.get("/hhs/:sid",trackMessageStatus)











export default reports;
