import Offer from "../models/offer.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const createOffer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "celebrity_smile/offers",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    try { fs.unlinkSync(req.file.path); } catch {}

    const offer = await Offer.create({
      offerPoster: { url: result.secure_url, public_id: result.public_id },
      offerEndDate: req.body.offerEndDate,
    });
    res.status(201).json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create offer" });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const existing = await Offer.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Offer not found" });

    let offerPoster = existing.offerPoster;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "celebrity_smile/offers",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });
      try { fs.unlinkSync(req.file.path); } catch {}

      if (offerPoster?.public_id) {
        try { await cloudinary.uploader.destroy(offerPoster.public_id); } catch {}
      }

      offerPoster = { url: result.secure_url, public_id: result.public_id };
    }

    if (typeof req.body.offerEndDate !== "undefined") {
      existing.offerEndDate = req.body.offerEndDate;
    }
    existing.offerPoster = offerPoster;

    const saved = await existing.save();
    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update offer" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (offer?.offerPoster?.public_id) {
      try { await cloudinary.uploader.destroy(offer.offerPoster.public_id); } catch {}
    }
    res.json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete offer" });
  }
};


