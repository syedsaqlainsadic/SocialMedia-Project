const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: { type: String, require: true, trim: true },
    email: { type: String, require: true, trim: true, unique: true },
    username: { type: String, require: true, trim: true, unique: true },
    password: { type: String, require: true },
    profilePic: { type: String, default: "/images/Profile.png" },
    likes: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
