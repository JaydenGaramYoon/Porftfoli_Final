import Certificate from '../models/certificate.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  const certificate = new Certificate(req.body)
  try {
    await certificate.save()
    return res.status(200).json(certificate)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    let certificates = await Certificate.find().sort({ year: -1 })
    res.json(certificates)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const certificateByID = async (req, res, next, id) => {
  try {
    let certificate = await Certificate.findById(id)
    if (!certificate)
      return res.status('400').json({
        error: "Certificate not found"
      })
    req.certificate = certificate
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve certificate"
    })
  }
}

const read = (req, res) => {
  return res.json(req.certificate)
}

const update = async (req, res) => {
  try {
    let certificate = req.certificate
    certificate = Object.assign(certificate, req.body)
    await certificate.save()
    res.json(certificate)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let certificate = req.certificate
    let deletedCertificate = await Certificate.findByIdAndDelete(certificate._id)
    res.json(deletedCertificate)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeAll = async (req, res) => {
  try {
    await Certificate.deleteMany({})
    res.json({ message: "All certificates deleted successfully" })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  certificateByID,
  read,
  list,
  remove,
  removeAll,
  update
}
