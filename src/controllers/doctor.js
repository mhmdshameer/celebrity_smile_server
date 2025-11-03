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
        console.log('Update request received:', {
            params: req.params,
            body: req.body,
            file: req.file ? 'File received' : 'No file received'
        });

        const { name, nameAr, specialties, specialtiesAr, imageUrl, imagePublicId } = req.body;
        const updateData = { name, nameAr };
        
        console.log('Initial update data:', updateData);

        // First get the current doctor to handle image updates
        const currentDoctor = await Doctor.findById(req.params.id);
        if (!currentDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Handle specialties
        if (specialties !== undefined) {
            updateData.specialties = Array.isArray(specialties) 
                ? specialties 
                : (typeof specialties === 'string' ? specialties.split(',').map(s => s.trim()) : []);
        }

        if (specialtiesAr !== undefined) {
            updateData.specialtiesAr = Array.isArray(specialtiesAr) 
                ? specialtiesAr 
                : (typeof specialtiesAr === 'string' ? specialtiesAr.split(',').map(s => s.trim()) : []);
        }

        // Handle image update
        console.log('Processing image update...');
        if (req.file) {
            console.log('New file detected, uploading to Cloudinary...');
            // If a new file is uploaded
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
                return res.status(500).json({ message: 'Error uploading image' });
            }
        } else if (imageUrl && imagePublicId) {
            console.log('Using existing image from client:', { imageUrl, imagePublicId });
            // If no new file but we have image URL and public_id from the client
            updateData.image = {
                url: imageUrl,
                public_id: imagePublicId
            };
        } else {
            console.log('No image changes, keeping existing image');
            // If no image data is provided, keep the existing image
            updateData.image = currentDoctor.image;
        }

        console.log('Final update data:', JSON.stringify(updateData, null, 2));
        
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!doctor) {
            console.error('Doctor not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        console.log('Doctor updated successfully:', doctor);
        
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error updating doctor:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        res.status(500).json({ 
            message: 'Error updating doctor', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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


