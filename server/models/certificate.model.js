import mongoose from 'mongoose'

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Certificate title is required'
  },
  issuer: {
    type: String,
    trim: true,
    required: 'Issuer is required'
  },
  year: {
    type: Number,
    required: 'Year is required'
  }
}, {
  timestamps: true
})

export default mongoose.model('Certificate', CertificateSchema)
