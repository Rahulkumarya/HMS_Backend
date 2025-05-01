import mongoose, { Schema, Document } from "mongoose";


export interface ImedicalReport {
  fileUrl: string;
  fileName: string;
  uploadedAt:Date,
}



export interface IReport {
  
  _id: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

const patientReportsSchema = new Schema<IReport>(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true } // Mongoose auto-generates _id
);



const medicalReportsSchema = new Schema<ImedicalReport>(
  {
    fileUrl: { type: String},
    fileName: [{ type: String}],
    uploadedAt:[{type:Date,default:Date.now}]
  }
  
);


export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    city?: string;
    state?: string;
    pincode?: string;
  };
  bloodGroup?: string;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalHistory?: string[];
  medicalReport?: ImedicalReport[];
  reports?: IReport[];
  notifications: boolean;
  allergies?: string[];
  medications?: string[];
  communicationPreference?: {
    sms: boolean;
    email: boolean;
  };
  displine?: string[];
}

const patientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      city: String,
      state: String,
      pincode: String,
    },
    bloodGroup: { type: String },
    profileImage: { type: String },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    medicalHistory: [String],
    allergies: [String],
    medications: [String],

    medicalReport: [medicalReportsSchema],
    reports: [patientReportsSchema],

    notifications: {
      appointmentReminders: { type: Boolean, default: true },
      reportUploadAlerts: { type: Boolean, default: true },
      promotionalMessages: { type: Boolean, default: false },
    },
    communicationPreference: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
    },

    displine: [String],
  },
  { timestamps: true }
);



patientSchema.index({ location: "2dsphere" });
export const PatientModel = mongoose.model<IPatient>("Patient", patientSchema);




