import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Chip,
    IconButton,
    Alert,
    Fab,
    CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { list, create, update, remove } from './api-services.js';
import auth from '../lib/auth-helper.js';

const Services = () => {
    const [services, setServices] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        services: ['']
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

    useEffect(() => {
        const abortController = new AbortController();
        
        loadServices(abortController.signal);
        checkAdminStatus();
        
        return () => {
            abortController.abort();
        };
    }, []);

    const checkAdminStatus = () => {
        const authData = auth.isAuthenticated();
        setIsAdmin(authData && authData.user && authData.user.admin);
    };

    const loadServices = async (signal = null) => {
        try {
            setLoading(true);
            const data = await list(signal);
            if (Array.isArray(data)) {
                setServices(data);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                // 요청이 중단된 경우 조용히 처리 (컴포넌트 언마운트 시 정상적인 동작)
                console.log('Request aborted');
                return;
            }
            console.error('Error loading services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (service = null) => {
        if (service) {
            setEditMode(true);
            setCurrentService(service);
            setFormData({
                title: service.title,
                category: service.category,
                services: service.services || ['']
            });
        } else {
            setEditMode(false);
            setCurrentService(null);
            setFormData({
                title: '',
                category: '',
                services: ['']
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setCurrentService(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceItemChange = (index, value) => {
        const newServices = [...formData.services];
        newServices[index] = value;
        setFormData(prev => ({
            ...prev,
            services: newServices
        }));
    };

    const addServiceItem = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, '']
        }));
    };

    const removeServiceItem = (index) => {
        if (formData.services.length > 1) {
            const newServices = formData.services.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                services: newServices
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const serviceData = {
                ...formData,
                services: formData.services.filter(service => service.trim() !== '')
            };

            let result;
            if (editMode) {
                result = await update({ serviceId: currentService._id }, serviceData);
            } else {
                result = await create(serviceData);
            }

            if (result.error) {
                setAlert({ show: true, message: result.error, severity: 'error' });
            } else {
                setAlert({ 
                    show: true, 
                    message: editMode ? 'Service updated successfully!' : 'Service created successfully!', 
                    severity: 'success' 
                });
                loadServices();
                handleClose();
            }
        } catch (err) {
            setAlert({ show: true, message: 'Error saving service', severity: 'error' });
        }
    };

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                const result = await remove({ serviceId });
                if (result.error) {
                    setAlert({ show: true, message: result.error, severity: 'error' });
                } else {
                    setAlert({ show: true, message: 'Service deleted successfully!', severity: 'success' });
                    loadServices();
                }
            } catch (err) {
                setAlert({ show: true, message: 'Error deleting service', severity: 'error' });
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ maxWidth: "1200px", margin: "auto", mt: 5, px: 3 }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
                <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "bold",
                          color: "#3eb93e",
                          mb: 4,
                          textAlign: "center",
                        }}
                      >
                        Services
                      </Typography>
            </Box>

            {alert.show && (
                <Alert 
                    severity={alert.severity} 
                    onClose={() => setAlert({ ...alert, show: false })}
                    sx={{ mb: 2 }}
                >
                    {alert.message}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Loading services...
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid item xs={12} md={6} key={service._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Typography variant="h6" component="h2">
                                        {service.title}
                                    </Typography>
                                    {isAdmin && (
                                        <Box>
                                            <IconButton onClick={() => handleOpen(service)} size="small">
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(service._id)} size="small">
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                                
                                <Chip 
                                    label={service.category} 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ mb: 2 }} 
                                />
                                
                                <Box>
                                    {service.services && service.services.map((item, index) => (
                                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                            • {item}
                                        </Typography>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                </Grid>
            )}

            {auth.isAuthenticated() && auth.isAuthenticated().user && auth.isAuthenticated().user.admin && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: "fixed", bottom: 16, right: 16 }}
                    onClick={() => handleOpen()}
                >
                    <Add />
                </Fab>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Service Title"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="category"
                        label="Category"
                        fullWidth
                        variant="outlined"
                        value={formData.category}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Service Items:
                    </Typography>
                    
                    {formData.services.map((service, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={1}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={service}
                                onChange={(e) => handleServiceItemChange(index, e.target.value)}
                                placeholder={`Service item ${index + 1}`}
                            />
                            {formData.services.length > 1 && (
                                <IconButton color="error" onClick={() => removeServiceItem(index)} size="small">
                                    <Close />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    
                    <Button onClick={addServiceItem} variant="outlined" size="small" sx={{ mt: 1 }}>
                        Add Service Item
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Services;
