import mongoose, { Document, Schema } from "mongoose";

// import mongoose, { Schema } from "mongoose";

// export interface IAvailableSlot {
//   day: string; // ISO date-time string
//   slots: string[]; // ISO date-time string
// }

// export interface IQualificationDetail {
//   text: string; // Name of the qualification (e.g., "MDS in Orthodontics")
//   links?: string[]; // Any reference links or proof (e.g., university profile)
//   certificate?: string[]; // URLs of certificates (uploaded to Cloudinary or similar)
//   universityName?: string;
//   session?: string; // e.g., "2015-2018"
// }

// export interface IExperienceDetail {
//   experience: number; // Total years in that role
//   department: string; // Department of work
//   from: string; // Start date (ISO string preferred)
//   to: string; // End date (or "Present")
//   hospitalOrClinic?: string; // Where they worked
//   description?: string; // What they did
// }

// export interface IPublicationDetail {
//   name: string; // Title of the publication
//   department: string; // Related department or field
//   webLink: string; // Link to journal/paper
//   publishedDate: string | Date; // Date of publication
//   coverPages?: string[]; // URLs of cover page images
//   description?: string; // Abstract or summary
// }

// export interface IRewardsDetail {
//   name: string; // Name of the award/reward
//   awardedFor: string; // Reason or category of award
//   awardedDate?: string | Date; // Date when awarded
//   pictures?: string[]; // URLs of images (optional)
//   certificate?: string; // Certificate file URL
// }

// export interface ISocialLink {
//   platform: string; // e.g., "Facebook", "Twitter", "LinkedIn"
//   url: string; // Link to profile
// }

// export interface IDoctor extends Document {
//   userId: mongoose.Types.ObjectId;
//   name: string;
//   specialization: string[];
//   experience: number;
//   experienced:IExperienceDetail[];
//   qualifications:string[];
//   bio?: string;
//   gender?: string;
//   languages?: string[];
//   location: {
//     type: "Point";
//     coordinates: [number, number]; // [longitude, latitude]
//     city?: string;
//     state?: string;
//     pincode?: string;
//   };
//   profileImage?: string;
//   availableSlots: IAvailableSlot[];
//   isAvailable: Boolean;
//   isApproved: Boolean;
//   consultationFee: number;
//   priceoffer?: number;
//   hospitalname: string;
//   register?: number;

//   videoCallEnabled: Boolean;
//   chatEnabled: Boolean;
//   socketId: string;
//   onlineStatus: Boolean;
//   lastseen: Date;
//   offices?: string;
//   status: "active" | "inactive";
//   rating?: number;
//   reviews?: string[];
// }

// const availableSlotSchema = new Schema<IAvailableSlot>(
//   {
//     day: { type: String, required: true },
//     slots: [{ type: String, required: true }],
//   },
//   { _id: false }
// );

// const doctorSchema = new Schema<IDoctor>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     specialization: [{ type: String, required: true, index: true }],
//     experience: { type: Number, required: true },
//     qualifications: [{ type: String, required: true }],

//     bio: { type: String },
//     gender: { type: String, enum: ["Male", "Female", "Other","male","female"] },
//     languages: [{ type: String }],
//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         required: true,
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         required: true,
//       },
//       city: String,
//       state: String,
//       pincode: String,
//     },
//     profileImage: { type: String }, // URL to cloudinary or local file
//     availableSlots: [availableSlotSchema],
//     isAvailable: { type: Boolean, default: true },
//     isApproved: { type: Boolean, default: false },
//     consultationFee: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     priceoffer: { type: Boolean },
//     hospitalname: { type: String },
//     register: { type: Number }, //how many patient to see

//     videoCallEnabled: { type: Boolean, default: false },
//     chatEnabled: { type: Boolean, default: true },
//     socketId: { type: String },
//     onlineStatus: { type: Boolean, default: false },
//     lastseen: { type: Date },
//     offices: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Office",
//       },
//     ],

//     status: { type: String, enum: ["active", "inactive"], default: "active" },
//     rating: { type: Number, default: 0 },
//     reviews: [{ type: String }],
//   },
//   { timestamps: true }
// );

// //creating index by using name so that search fast by doctor
// doctorSchema.index({name:1});

// doctorSchema.index({ location: "2dsphere" });

// export const DoctorModel = mongoose.model<IDoctor>("DoctorModel", doctorSchema);

//second doctor model
// import mongoose, { Document, Schema } from "mongoose";

export interface IAvailableSlot {
  day: string;
  slots: string[];
}

export interface IQualificationDetail {
  text: string;
  links?: string[];
  certificate?: [
    {
      url: string;
      public_id: string;
    }
  ];
  universityName?: string;
  session?: string;
}

export interface IExperienceDetail {
  experience: number;
  department: string;
  from: string;
  to: string;
  hospitalOrClinic?: string;
  description?: string;
}

export interface IPublicationDetail {
  name: string;
  department: string;
  webLink: string;
  publishedDate: string | Date;
  coverPages?:  [
    {
      url: string;
      public_id: string;
    }
  ];
  description?: string;
}

export interface IDoctorReview {
  userId: mongoose.Types.ObjectId;
  userType: "Patient" | "Doctor";
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface IRewardsDetail {
  name: string;
  awardedFor: string;
  awardedDate: string | Date;
  pictures?:  [
    {
      url: string;
      public_id: string;
    }
  ];
  certificate?:  [
    {
      url: string;
      public_id: string;
    }
  ];
}

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  specialization: string[];
  avatar?: {
    url:string;
    public_id:string;
  };
  bio?: string;
  gender?: string;
  languages?: string[];

  location: {
    type: "Point";
    coordinates: [number, number];
    city?: string;
    state?: string;
    pincode?: string;
  };

  isAvailable: boolean;
  isApproved: boolean;
  onlineStatus: boolean;
  socketId: string;
  lastseen: Date;
  status: "active" | "inactive";

  consultationFee: number;
  priceoffer?: number;
  hospitalname: string;
  register?: number;

  videoCallEnabled: boolean;
  chatEnabled: boolean;

  availableSlots: IAvailableSlot[];
  qualifications: IQualificationDetail[];
  experienced: IExperienceDetail[];
  publications?: IPublicationDetail[];
  rewards?: IRewardsDetail[];
  socialLinks?: ISocialLink[];
  reviews?: IDoctorReview[];
}

// Subschemas

const doctorReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "reviews.userType",
  },
  userType: { type: String, required: true, enum: ["Patient", "Doctor"] },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const availableSlotSchema = new Schema<IAvailableSlot>(
  {
    day: { type: String, required: true },
    slots: [{ type: String, required: true }],
  },
  { _id: false }
);

const qualificationSchema = new Schema<IQualificationDetail>(
  {
    text: { type: String, required: true },
    links: [{ type: String }],
    certificate: [{url: String ,public_id:String}],
    universityName: String,
    session: String,
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperienceDetail>(
  {
    experience: { type: Number, required: true },
    department: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    hospitalOrClinic: String,
    description: String,
  },
  { _id: false }
);

const publicationSchema = new Schema<IPublicationDetail>(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    webLink: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    coverPages: [{ url: String ,public_id:String}],
    description: String,
  },
  { _id: false }
);

const rewardSchema = new Schema<IRewardsDetail>(
  {
    name: { type: String, required: true },
    awardedFor: { type: String, required: true },
    awardedDate: { type: Date, required: true },
    pictures: [{ url: String, public_id: String }],
    certificate: [{ url: String, public_id: String }],
  },
  { _id: false }
);

const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    specialization: [{ type: String, required: true, index: true }],
    avatar:{
      url:String,
      public_id:String,
    },
    bio: String,
    gender: { type: String },
    languages: [{ type: String }],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
      city: String,
      state: String,
      pincode: String,
    },

    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    onlineStatus: { type: Boolean, default: false },
    socketId: String, //for communication via audio, video and chat b/w patient and doctor
    lastseen: Date,
    status: { type: String,  default: "active" },

    consultationFee: { type: Number, required: true },
    priceoffer: Number,
    hospitalname: { type: String },
    register: Number,

    videoCallEnabled: { type: Boolean, default: false },
    chatEnabled: { type: Boolean, default: true },

    availableSlots: [availableSlotSchema],
    qualifications: [qualificationSchema],
    experienced: [experienceSchema],
    publications: [publicationSchema],
    rewards: [rewardSchema],
    socialLinks: [socialLinkSchema],
    reviews: [doctorReviewSchema],
    
  },
  { timestamps: true }
);

doctorSchema.index({ location: "2dsphere" });

export const DoctorModel = mongoose.model<IDoctor>("DoctorModel", doctorSchema);
