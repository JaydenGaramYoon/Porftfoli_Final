import Education from '../models/education.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  const education = new Education(req.body)
  try {
    await education.save()
    return res.status(200).json(education)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    let educations = await Education.find().sort({ createdAt: -1 })
    res.json(educations)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const educationByID = async (req, res, next, id) => {
  try {
    let education = await Education.findById(id)
    if (!education)
      return res.status('400').json({
        error: "Education not found"
      })
    req.education = education
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve education"
    })
  }
}

const read = (req, res) => {
  return res.json(req.education)
}

const update = async (req, res) => {
  try {
    let education = req.education
    education = Object.assign(education, req.body)
    await education.save()
    res.json(education)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let education = req.education
    let deletedEducation = await Education.findByIdAndDelete(education._id)
    res.json(deletedEducation)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeAll = async (req, res) => {
  try {
    await Education.deleteMany({})
    res.json({ message: "All educations deleted successfully" })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  educationByID,
  read,
  list,
  remove,
  removeAll,
  update
}
