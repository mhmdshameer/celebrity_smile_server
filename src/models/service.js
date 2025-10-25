const serviceSchema = new mongoose.Schema({
    service:{type:String,required:true},
    serviceAr:{type:String,required:true},
    description:{type:String,required:true},
    descriptionAr:{type:String,required:true},
    servicePrice:{type:Number,required:true},
    slug:{type:String,unique:true},
},
{timestamps:true});

// Auto-generate slug
serviceSchema.pre("save", function(next) {
  if (!this.slug && this.service) {
    this.slug = this.service.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
