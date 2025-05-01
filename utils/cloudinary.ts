import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto", folder }, (error, result) => {
          if (error) return reject(error);

          // Resolving the complete result from Cloudinary (includes secure_url and public_id)
          resolve({
            secure_url: result?.secure_url ?? "",
            public_id: result?.public_id ?? "",
          });
        })
        .end(fileBuffer);
    }
  );
};

export const deleteFromCloudinary = (public_id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default cloudinary;
