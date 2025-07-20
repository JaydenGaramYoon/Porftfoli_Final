import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Skill name is required'
  }
}, {
  timestamps: true
})

export default mongoose.model('Skill', SkillSchema)
