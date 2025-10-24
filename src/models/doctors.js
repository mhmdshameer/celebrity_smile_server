import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  specialties: [String],
  specialtiesAr: [String],
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  slug: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate slug
doctorSchema.pre("save", function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
