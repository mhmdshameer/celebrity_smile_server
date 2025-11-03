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
        const { name, nameAr, specialties, specialtiesAr } = req.body;
        const updateData = { name, nameAr };

        // First get the current doctor to handle image updates
        const currentDoctor = await Doctor.findById(req.params.id);
        if (!currentDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Handle specialties
        if (specialties !== undefined) {
            updateData.specialties = Array.isArray(specialties) 
                ? specialties 
                : specialties.split(',').map(s => s.trim());
        }

        if (specialtiesAr !== undefined) {
            updateData.specialtiesAr = Array.isArray(specialtiesAr) 
                ? specialtiesAr 
                : specialtiesAr.split(',').map(s => s.trim());
        }

        // Handle image update if file is uploaded
        if (req.file) {
            try {
                // Upload new image to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "celebrity_smile/doctors",
                });

                // Remove local file after upload
                fs.unlinkSync(req.file.path);

                // Delete old image if exists
                if (currentDoctor?.image?.public_id) {
                    await cloudinary.uploader.destroy(currentDoctor.image.public_id)
                        .catch(err => console.error('Error deleting old image:', err));
                }

                updateData.image = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                // If image upload fails, keep the existing image
                updateData.image = currentDoctor.image;
            }
        } else {
            // If no new image is provided, keep the existing image
            updateData.image = currentDoctor.image;
        }

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ 
            message: 'Error updating doctor',
            error: error.message 
        });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id)
        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


