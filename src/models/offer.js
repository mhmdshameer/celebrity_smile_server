import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    offerPoster: {
         url: { type: String, required: true },
    public_id: { type: String, required: true }
    },
    offerEndDate: { type: Date, required: true },
})

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;

