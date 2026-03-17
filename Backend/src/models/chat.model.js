import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Update updatedAt before saving
chatSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
