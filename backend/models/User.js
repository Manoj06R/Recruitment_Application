const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  contactEmail: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  accountType: {
    type: String,
    enum: ['CANDIDATE', 'EMPLOYER', 'ADMIN'],
    default: 'CANDIDATE',
  },
  photoUrl: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: [],
  },
  experiences: [{
    role: String,
    company: String,
    period: String,
    desc: String,
  }],
  resumes: [{
    name: String,
    size: String,
    uploadDate: String,
  }],
  jobAlerts: [{
    keyword: String,
    frequency: { type: String, enum: ['Daily', 'Weekly'], default: 'Daily' },
    isActive: { type: Boolean, default: true },
  }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
