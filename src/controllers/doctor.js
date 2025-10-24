// src/controllers/doctorController.js
import Doctor from "../models/doctors.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const addDoctor = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "celebrity_smile/doctors",
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    const doctor = await Doctor.create({
      name: req.body.name,
      nameAr: req.body.nameAr,
      specialties: req.body.specialties ? req.body.specialties.split(',') : [],
      specialtiesAr: req.body.specialtiesAr ? req.body.specialtiesAr.split(',') : [],
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add doctor" });
  }
};


export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
        res.status(200).json(doctors)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id)
        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


