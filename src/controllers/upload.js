
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "celebrity_smile",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    fs.unlinkSync(filePath); // remove local file

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
