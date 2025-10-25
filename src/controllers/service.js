import Service from "../models/service.js";



export const addService = async (req, res) => {
    try {
        // if (!req.file) return res.status(400).json({ message: "Image required" });
    
        // Upload to Cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "celebrity_smile/services",
        // });
    
        // Remove local file after upload
        // fs.unlinkSync(req.file.path);
    
        const service = await Service.create({
            service: req.body.service,
            serviceAr: req.body.serviceAr,
            description: req.body.description,
            descriptionAr: req.body.descriptionAr,
            servicePrice: req.body.servicePrice,
            slug: req.body.service.toLowerCase().replace(/\s+/g, "-"),
        });
    
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add service" });
    }
};

export const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get services" });
    }
};

export const getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get service" });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        res.status(200).json(service)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id)
        res.status(200).json(service)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
