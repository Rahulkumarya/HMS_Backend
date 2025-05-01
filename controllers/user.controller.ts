require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../modals/user_model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { error } from "console";
import { send } from "process";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import { json } from "stream/consumers";
import cloudinary from "cloudinary";
import { PatientModel } from "../modals/patient.model";
import { DoctorModel } from "../modals/doctor.model";
import { ClinicModel } from "../modals/clinic.model";
import { DiagnosticModel } from "../modals/diagnostic.model";
import { ResortModel } from "../modals/resort.model";
import { MedicineModel } from "../modals/medicineshop.model";

//register user

interface IRegistrationBody {
  name: string;
  email: string;
  role: string;
  password: string;
  avatar?: string;
}

// export const registrationUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;
//       const isEmailExist = await userModel.findOne({ email });
//       if (isEmailExist) {
//         return next(new ErrorHandler("Email already exist", 400));
//       }

//       const user: IRegistrationBody = {
//         name,
//         email,
//         password,
//       };

//       const activationToken = createActivationToken(user);

//       const activationCode = activationToken.activationCode;

//       const data = { user: { name: user.name }, activationCode };
//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/activation-mail.ejs"),
//         data
//       );

//       console.log("User data before token:", user);
//       console.log("Activation Token:", activationToken);
//       console.log("Email to be sent to:", user.email);

//       // try {
//        await sendMail({
//           email: user.email,
//           subject: "Activate your account ",
//           template: "activation-mail.ejs",
//           text:"hello",
//           data
//         });

//         res.status(201).json({
//           success: true,
//           message: `Please check your email : ${user.email} to activate your account!`,
//           activationToken: activationToken.token,
//         });

//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//       }
//     // } catch (error: any) {
//     //   return next(new ErrorHandler(error.message, 400));
//     // }
//   }
// );

// export const registrationUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;
//       const isEmailExist = await userModel.findOne({ email });
//       if (isEmailExist)
//         return next(new ErrorHandler("Email already exists", 400));

//       const user: IRegistrationBody = { name, email, password };
//       const activationToken = createActivationToken(user);
//       const activationCode = activationToken.activationCode;

//       const data = { user: { name: user.name }, activationCode };

//       console.log("✅ User data before token:", user);
//       console.log("✅ Activation Token:", activationToken);
//       console.log("✅ Email to be sent to:", user.email);

// }

// export const registrationUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;
//       const isEmailExist = await userModel.findOne({ email });
//       if (isEmailExist) {
//         return next(new ErrorHandler("Email already exist", 400));
//       }

//       const user: IRegistrationBody = {
//         name,
//         email,
//         password,
//       };

//       const activationToken = createActivationToken(user);

//       const activationCode = activationToken.activationCode;

//       const data = { user: { name: user.name }, activationCode };
//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/activation-mail.ejs"),
//         data
//       );

//       // console.log(`html is `,html);
//       console.log(`data is `,data);
//       try {
//        const d= await sendMail({
//           email: user.email,
//           subject: "Activate your account ",
//           template: "activation-mail.ejs",
//           text:"Hello",
//           data,
//         });

//         res.status(201).json({
//           success: true,
//           message: `Please check your email : ${user.email} to activate your account!`,
//           activationToken: activationToken.token,

//         });
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

//test
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if email already exists
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // User data
      const user: IRegistrationBody = {
        name,
        email,
        password,
        role,
      };

      // Create activation token
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      // Prepare email data
      const data = { user: { name: user.name }, activationCode };

      // Log data for debugging
      console.log("Activation email data:", data);

      // Render email template
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        // Send the activation email
        const emailResponse = await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          text: "Hello", // Optional text version of the email
          data,
        });

        console.log("Email send response:", emailResponse);

        // Response after successful email sending
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (emailError: any) {
        console.error("Error sending email:", emailError);
        return next(new ErrorHandler("Failed to send activation email", 500));
      }

      //creating a model which is used by the role
    } catch (error: any) {
      console.error("Error during registration:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

//Activation user

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code ", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//LOGIN USER

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Password doesn't match", 400));
      }

      const id = user._id;
      const newName = user.name;
      const Role = user.role;

      // 👉 Now based on role, first check and create related model
      if (Role === "doctor") {
        let doctor = await DoctorModel.findOne({ userId: id });

        if (!doctor) {
          doctor = await DoctorModel.create({
            userId: id,
            name: newName,
            specialization: ["General"],
            profileImage: "https://dummyimage.com/600x400/000/fff",
            gender: "Other",
            location: {
              type: "Point",
              coordinates: [0, 0],
              city: "Dummy City",
              state: "Dummy State",
              pincode: "000000",
            },
            isAvailable: false,
            isApproved: false,
            onlineStatus: false,
            lastseen: new Date(),
            status: "offline",
            consultationFee: 0,
            videoCallEnabled: false,
            chatEnabled: false,
            availableSlots: [{ day: "Monday", slots: [] }],
            qualifications: [
              {
                text: "MBBS",
                links: [],
                certificate: [],
                universityName: "",
                session: "",
              },
            ],
            experienced: [],
            publications: [],
            rewards: [],
            socialLinks: [],
            rating: 0,
            reviews: [],
            offices: [],
          });

          // ❌ Don't send token if model was just created
          return res.status(200).json({
            success: true,
            message: "Login successful. Please complete your profile.",
            doctorId: doctor._id,
          });
        }
      }

      if (Role === "patient") {
        let patient = await PatientModel.findOne({ userId: id });

        if (!patient) {
          patient = await PatientModel.create({
            userId: id,
            name: newName,
            age: 0,
            gender: "Male",
            contactNumber: "0000000000",
            email: "dummy@example.com",
            address: "Unknown",
            location: {
              type: "Point",
              coordinates: [0, 0],
              city: "Unknown City",
              state: "Unknown State",
              pincode: "000000",
            },
          });

          // ❌ Don't send token if model was just created
          return res.status(201).json({
            success: true,
            message: "Patient registered. Please complete profile!",
            patientId: patient._id,
          });
        }
      }

      //role is clinic
      if (Role === "clinic") {
        let hospital = await ClinicModel.findOne({ userId: id });

        console.log(`hospit`, hospital);

        if (!hospital) {
          hospital = await ClinicModel.create({
            userId: id,
            name: newName,
            charge: 500,
            location: {
              type: "Point",
              coordinates: [77.5946, 12.9716], // [longitude, latitude]
              city: "Bangalore",
              state: "Karnataka",
              pincode: "560001",
              address: "MG Road",
              landmark: "Near Metro Station",
            },
            bio: "One of the best dental clinics providing affordable care.",
            isApproved: false,
            onlineStatus: false,
            socketId: "socket123",
            status: "active",
            socialLinks: [
              {
                platform: "Instagram",
                url: "https://instagram.com/sunshineclinic",
              },
              {
                platform: "Facebook",
                url: "https://facebook.com/sunshineclinic",
              },
            ],
            rating: 0,
            reviews: [],
          });

          console.log(`hospital`, hospital);

          // ❌ Don't send token if model was just created
          return res.status(201).json({
            success: true,
            message: "Hospital registered. Please complete profile!",
            hospitalId: hospital._id,
          });
        }
      }


      //diagnostic role for
        if (Role === "diagnostic") {
          let diagnostic = await DiagnosticModel.findOne({ userId: id });

          

          if (!diagnostic) {
            diagnostic = await DiagnosticModel.create({
              userId: id,
              name: newName,
              charge: 500,
          
              location: {
                type: "Point",
                coordinates: [0, 0], // Empty coordinates
                address: "Not Provided",
                landmark: "Not Provided",
              },
              isApproved: false,
              onlineStatus: false,
              socketId: "",
              status: "active",
              diagnostic: [], // No diagnostic services yet
              rating: 0,
              reviews: [],
            });

       

            // ❌ Don't send token if model was just created
            return res.status(201).json({
              success: true,
              message: "Diagnostic registered. Please complete profile!",
              diagnosticId: diagnostic._id,
            });
          }
        }


        //resort for the role

             if (Role === "resort") {
               let resort = await ResortModel.findOne({ userId: id });

               if (!resort) {
                 resort = await ResortModel.create({
                   userId: id,
                   name: newName,
                   charge: 500,

                   location: {
                     type: "Point",
                     coordinates: [0, 0], // Empty coordinates
                     address: "Not Provided",
                     landmark: "Not Provided",
                   },
                
                 });

                 // ❌ Don't send token if model was just created
                 return res.status(201).json({
                   success: true,
                   message: "Resort registered. Please complete profile!",
                   resortId: resort._id,
                 });
               }
             }



             //medicineshop for the role
               if (Role === "medicineshop") {
                 let medicine = await MedicineModel.findOne({ userId: id });

                 if (!medicine) {
                   medicine = await MedicineModel.create({
                     userId: id,
                     name: newName,
                     charge: 0,
                     location: {
                       coordinates: [0, 0],
                       address: "No address provided",
                       landmark: "No landmark provided",
                     },
                     medicineService: [],
                   });

                   // ❌ Don't send token if model was just created
                   return res.status(201).json({
                     success: true,
                     message: "MedicineShop registered. Please complete profile!",
                     medicineShopId: medicine._id,
                   });
                 }
               }


      // Now after model exists (doctor/patient), finally login

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//logout user

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated

      // Clear cookies
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      // res.cookie("access_token", " ", { maxAge: 1 });
      // res.cookie("refresh_token", " ", { maxAge: 1 });

      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User ID not found", 400));
      }

      console.log(req.user?._id);

      await redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token ";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "10d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);

      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); //7 days for 604800

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

//social auth

export const SocialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user info

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      // if (email && user) {
      //   const isEmailExist = await userModel.findOne({ email });
      //   if (isEmailExist) {
      //     return next(new ErrorHandler("Email already exist ", 400));
      //   }

      //   user.email = email;
      // }

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("please enter old and new password ", 400)
        );
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user ", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password ", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: "password updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user profile pictures

interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;

      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        //if user have avatar then call this if
        if (user?.avatar?.public_id) {
          //fist delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          // second upload new image
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatarss",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatarss",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "profile picture updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all users --only for admin

export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user role ---only for admin

export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete user ---only for admin

export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found ", 404));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
