import Service from '../models/services.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
    try {
        // 빈 문자열 필드 제거
        const cleanedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedBody[key] = value;
            }
        }
        
        const service = new Service(cleanedBody);
        await service.save();
        
        return res.status(200).json({
            message: "Successfully created the service!",
            service: service
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const list = async (req, res) => {
    try {
        const services = await Service.find()
            .select('title category services created updated')
            .sort({ created: -1 }); // 최신순 정렬
        res.json(services);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const serviceByID = async (req, res, next, id) => {
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                error: "Service not found"
            });
        }
        req.profile = service;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve service"
        });
    }
};

const read = (req, res) => {
    return res.json(req.profile);
};

const update = async (req, res) => {
    try {
        // 빈 문자열 필드 제거
        const cleanedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedBody[key] = value;
            }
        }
        
        let service = req.profile;
        service = extend(service, cleanedBody);
        service.updated = Date.now();
        await service.save();
        
        res.json(service);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const remove = async (req, res) => {
    try {
        const service = req.profile;
        const deletedService = await service.deleteOne();
        res.json({
            message: 'Service deleted successfully',
            deletedService: deletedService
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const removeAll = async (req, res) => {
    try {
        await Service.deleteMany({});
        res.json({ 
            message: "All services deleted successfully!" 
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default { create, serviceByID, read, list, remove, update, removeAll };
