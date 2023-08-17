import mongoose, { Schema } from "mongoose";

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
      trim: true,
    },
    titleForm: {
      type: Object,
      require: true,
      trim: true,
    },
    typeForm: {
      type: String,
      require: true,
    },
    typeIdentify: {
      type: Object,
      require: true,
    },
    urlImgPort: {
      type: String,
      require: true,
    },
    questionsForm: {
      type: Object,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Deshabilitar la generación del campo "__v"
  }
);

export default mongoose.model("FormsFinalProject", formSchema);
