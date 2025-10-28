import Service from "../models/service.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// -----------------------------
// Add Service
// -----------------------------

export const addService = async (req, res) => {
  try {
    // Multer stores the uploaded file in req.file
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    // ✅ Upload to Cloudinary from local path
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "celebrity_smile/services",
    });

    // ✅ Clean up local file after upload
    fs.unlinkSync(req.file.path);

    // ✅ Create service entry in MongoDB
    const service = await Service.create({
      service: req.body.service,
      serviceAr: req.body.serviceAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      serviceImage: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      slug: req.body.service.toLowerCase().replace(/\s+/g, "-"),
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Error in addService:", error);
    res
      .status(500)
      .json({ message: "Failed to add service", error: error.message });
  }
};

// -----------------------------
// Get Services
// -----------------------------

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get services" });
  }
};

// -----------------------------
// Get Service
// -----------------------------

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get service" });
  }
};

// -----------------------------
// Update Service
// -----------------------------

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Delete Service
// -----------------------------

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
