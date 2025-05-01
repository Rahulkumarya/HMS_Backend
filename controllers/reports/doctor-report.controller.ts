import { uploadToCloudinary } from "../../utils/cloudinary";
import { DoctorModel } from "../../modals/doctor.model";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();

import twilio from "twilio";


interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadDoctorGallery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Hello");
    const _id = req.params; // Correct way to get doctorId from params
    console.log("doctorId is ", _id);

    const files = req.files as Express.Multer.File[]; // Typecasting

    // Find doctor by _id
    const doctor = await DoctorModel.findById(_id);
    console.log("Doctor found:", doctor);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Upload all images to Cloudinary and get URLs and public_ids
    const urls: CloudinaryResponse[] = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, "doctor/gallery"))
    );

    // Update doctor's qualifications with new certificates (URLs and public_ids)
    const updatedQualifications = doctor.qualifications.map((qualification) => {
      // Assuming we want to add these certificates to the qualification.certificate array
      qualification.certificate = [
        ...(qualification.certificate || []), // Retain existing certificates if any
        ...urls.map((urlData) => ({
          url: urlData.secure_url,
          public_id: urlData.public_id,
        })),
      ];
      return qualification;
    });

    // Update the doctor document with new qualifications
    doctor.qualifications = updatedQualifications;

    // Save the updated doctor
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Gallery uploaded and qualifications updated successfully",
      certificates: urls, // Send the uploaded URLs and public_ids
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};





export const uploadDoctorCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];
    const doctorId = req.params.id; // Get doctor id from route params

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // 1. Upload files to Cloudinary
    const certificateUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, "doctor/certificates"))
    );

    // 2. Find Doctor
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 3. Push certificates into qualifications array
    doctor.qualifications.forEach((qualification) => {
      if (!qualification.certificate) {
        qualification.certificate = [];
      }
      qualification.certificate.push(...certificateUrls);
    });

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Certificates uploaded successfully",
      data: certificateUrls,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};




export const messagess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(`accountSid: ${process.env.accountSid}`);
    console.log(`authToken: ${process.env.authToken}`);

    const client = twilio(process.env.accountSid, process.env.authToken);

    const message = await client.messages.create({
      body: "Congratulations Rahul, you have been selected!", // Use full sentence
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: "whatsapp:+919027948867", // Your WhatsApp number
    });

    console.log("Message SID:", message.sid);
    console.log("Message Status:", message.status);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      sid: message.sid, // ✅ Only send SID string
      status: message.status, // ✅ Also return status
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};



export const trackMessageStatus = async (req: Request, res: Response) => {
  try {
    const { sid } = req.params; // Get Message SID from URL parameter

    const client = twilio(process.env.accountSid, process.env.authToken);

    const message = await client.messages(sid).fetch();

    res.status(200).json({
      success: true,
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      dateSent: message.dateSent,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
