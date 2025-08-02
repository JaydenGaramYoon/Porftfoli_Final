import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Project title is required'
    },
    image: {
        type: String,
        trim: true,
        required: 'Project image is required'
    },
    description: {
        type: String,
        trim: true,
        required: 'Project description is required'
    },
    technologies: [{
        type: String,
        trim: true
    }],
    role: {
        type: String,
        trim: true,
        required: 'Role is required'
    },      
    github: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                // 빈 문자열이거나 null/undefined인 경우 검증 통과
                if (!v || v.trim() === '') return true;
                // 값이 있는 경우에만 URL 형식 검증
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    liveDemo: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v || v.trim() === '') return true;
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    problemLog: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v || v.trim() === '') return true;
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    testingLog: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v || v.trim() === '') return true;
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'projects'
});

export default mongoose.model('Project', ProjectSchema);


