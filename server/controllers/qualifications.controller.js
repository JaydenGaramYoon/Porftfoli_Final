import Qualification from '../models/qualifications.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  const qualification = new Qualification(req.body);
  try {
    await qualification.save();
    return res.status(200).json({
      message: 'Qualification created successfully!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    let qualifications = await Qualification.find().select(
      'title first_name last_name email completion description'
    );
    res.json(qualifications);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const qualificationByID = async (req, res, next, id) => {
  try {
    let qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(400).json({
        error: 'Qualification not found',
      });
    }
    req.profile = qualification;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve qualification',
    });
  }
};

const read = (req, res) => {
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let qualification = req.profile;
    qualification = extend(qualification, req.body);
    qualification.updatedAt = Date.now();
    await qualification.save();
    res.json(qualification);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let qualification = req.profile;
    await qualification.deleteOne();
     res.json({
      message: 'Qualification deleted successfully',
      deletedQualification: qualification 
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    await Qualification.deleteMany({});
    res.json({ message: 'All qualifications removed successfully!' });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create, qualificationByID, read, list,remove, update,removeAll
};
