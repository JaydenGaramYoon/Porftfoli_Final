import Project from '../models/projects.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
    try {
        // 빈 문자열 필드 제거
        const cleanedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedBody[key] = value;
            }
        }
        
        const project = new Project(cleanedBody);
        await project.save();
        
        return res.status(200).json({
            message: "Successfully created the project!",
            project: project
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const list = async (req, res) => {
    try {
        const projects = await Project.find()
            .select('title image description technologies role github liveDemo created updated')
            .sort({ created: -1 }); // 최신순 정렬
        res.json(projects);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const projectByID = async (req, res, next, id) => {
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                error: "Project not found"
            });
        }
        req.profile = project;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve project"
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
        
        let project = req.profile;
        project = extend(project, cleanedBody);
        project.updated = Date.now();
        await project.save();
        
        res.json(project);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const remove = async (req, res) => {
    try {
        const project = req.profile;
        const deletedProject = await project.deleteOne();
        res.json({
            message: 'Project deleted successfully',
            deletedProject: deletedProject
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const removeAll = async (req, res) => {
    try {
        await Project.deleteMany({});
        res.json({ 
            message: "All projects deleted successfully!" 
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default { create, projectByID, read, list, remove, update, removeAll };
