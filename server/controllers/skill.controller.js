import Skill from '../models/skill.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  const skill = new Skill(req.body)
  try {
    await skill.save()
    return res.status(200).json(skill)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    let skills = await Skill.find().sort({ name: 1 })
    res.json(skills)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const skillByID = async (req, res, next, id) => {
  try {
    let skill = await Skill.findById(id)
    if (!skill)
      return res.status('400').json({
        error: "Skill not found"
      })
    req.skill = skill
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve skill"
    })
  }
}

const read = (req, res) => {
  return res.json(req.skill)
}

const update = async (req, res) => {
  try {
    let skill = req.skill
    skill = Object.assign(skill, req.body)
    await skill.save()
    res.json(skill)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let skill = req.skill
    let deletedSkill = await Skill.findByIdAndDelete(skill._id)
    res.json(deletedSkill)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeAll = async (req, res) => {
  try {
    await Skill.deleteMany({})
    res.json({ message: "All skills deleted successfully" })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  skillByID,
  read,
  list,
  remove,
  removeAll,
  update
}
