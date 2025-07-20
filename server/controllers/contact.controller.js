import Contact from '../models/contact.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
    const contact = new Contact(req.body)
    try {
        await contact.save()
        return res.status(200).json({
            message: "Successfully created contact!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    try {
        let contacts = await Contact.find()
            .populate('userId', '_id name email')
            .select('userId first_name last_name email_address contact_number message created updated')
            .sort({ created: -1 })
        res.json(contacts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByUser = async (req, res) => {
    try {
        let contacts = await Contact.find({ userId: req.params.userId })
            .select('userId first_name last_name email_address contact_number message created updated')
            .sort({ created: -1 })
        res.json(contacts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const contactByID = async (req, res, next, id) => {
    try {
        let contact = await Contact.findById(id)
        if (!contact)
            return res.status(400).json({
                error: "Contact not found"
            })
        req.profile = contact
        next()
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve contact"
        })
    }
}

const read = (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res) => {
    try {
        let contact = req.profile
        contact = extend(contact, req.body)
        contact.updated = Date.now()
        await contact.save()
        res.json({
            message: "Contact updated successfully!",
            contact: contact
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let contact = req.profile
        let deletedContact = await contact.deleteOne()
        res.json({
            message: 'Contact deleted successfully!'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeAll = async (req, res) => {
    try {
        await Contact.deleteMany();  // Delete all contacts
        res.json({ message: 'All contacts deleted successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete all contacts' });
    }
};


export default { create, contactByID, read, list, listByUser, remove, update, removeAll }
