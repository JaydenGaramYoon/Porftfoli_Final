import mongoose from 'mongoose'

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    trim: true,
    required: 'Degree is required'
  },
  institution: {
    type: String,
    trim: true,
    required: 'Institution is required'
  },
  years: {
    type: String,
    trim: true,
    required: 'Years is required'
  }
}, {
  timestamps: true
})

export default mongoose.model('Education', EducationSchema)
