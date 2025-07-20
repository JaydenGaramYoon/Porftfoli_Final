import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BuildIcon from "@mui/icons-material/Build";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import auth from "../lib/auth-helper.js";
import { list as listEducation, create as createEducation, update as updateEducation, remove as removeEducation } from "./api-education.js";
import { list as listCertificates, create as createCertificate, update as updateCertificate, remove as removeCertificate } from "./api-certificates.js";
import { list as listSkills, create as createSkill, update as updateSkill, remove as removeSkill } from "./api-skills.js";

const About = () => {
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'education', 'certificate', 'skill'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const isAdmin = auth.isAuthenticated() && auth.isAuthenticated().user && auth.isAuthenticated().user.admin;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    Promise.all([
      listEducation(signal),
      listCertificates(signal),
      listSkills(signal)
    ])
    .then(([educationData, certificatesData, skillsData]) => {
      setEducation(Array.isArray(educationData) ? educationData : []);
      setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Error fetching about data:', err);
      }
    })
    .finally(() => {
      setLoading(false);
    });

    return () => abortController.abort();
  }, []);

  const handleAdd = (type) => {
    setDialogType(type);
    setEditingItem(null);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEdit = (type, item) => {
    setDialogType(type);
    setEditingItem(item._id);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (type, itemId) => {
    const jwt = auth.isAuthenticated();
    if (!jwt || !jwt.user.admin) return;

    try {
      let result;
      switch (type) {
        case 'education':
          result = await removeEducation({ educationId: itemId }, { t: jwt.token });
          if (result && !result.error) {
            setEducation(education.filter(item => item._id !== itemId));
          }
          break;
        case 'certificate':
          result = await removeCertificate({ certificateId: itemId }, { t: jwt.token });
          if (result && !result.error) {
            setCertificates(certificates.filter(item => item._id !== itemId));
          }
          break;
        case 'skill':
          result = await removeSkill({ skillId: itemId }, { t: jwt.token });
          if (result && !result.error) {
            setSkills(skills.filter(item => item._id !== itemId));
          }
          break;
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleSubmit = async () => {
    const jwt = auth.isAuthenticated();
    if (!jwt || !jwt.user.admin) return;

    try {
      let result;
      if (editingItem) {
        // Update
        switch (dialogType) {
          case 'education':
            result = await updateEducation({ educationId: editingItem }, { t: jwt.token }, formData);
            if (result && !result.error) {
              setEducation(education.map(item => item._id === editingItem ? result : item));
            }
            break;
          case 'certificate':
            result = await updateCertificate({ certificateId: editingItem }, { t: jwt.token }, formData);
            if (result && !result.error) {
              setCertificates(certificates.map(item => item._id === editingItem ? result : item));
            }
            break;
          case 'skill':
            result = await updateSkill({ skillId: editingItem }, { t: jwt.token }, formData);
            if (result && !result.error) {
              setSkills(skills.map(item => item._id === editingItem ? result : item));
            }
            break;
        }
      } else {
        // Create
        switch (dialogType) {
          case 'education':
            result = await createEducation({ t: jwt.token }, formData);
            if (result && !result.error) {
              setEducation([result, ...education]);
            }
            break;
          case 'certificate':
            result = await createCertificate({ t: jwt.token }, formData);
            if (result && !result.error) {
              setCertificates([result, ...certificates]);
            }
            break;
          case 'skill':
            result = await createSkill({ t: jwt.token }, formData);
            if (result && !result.error) {
              setSkills([result, ...skills]);
            }
            break;
        }
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || '' : value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: "1200px", margin: "auto", mt: 5, px: 3 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", mt: 5, px: 3 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#3eb93e",
          mb: 4,
          textAlign: "center",
        }}
      >
        About Me
      </Typography>

      <Grid container spacing={4}>
        {/* Education Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, width: "1400px" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SchoolIcon sx={{ color: "#3eb93e", mr: 2, fontSize: 30 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3eb93e" }}>
                  Education
                </Typography>
              </Box>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAdd('education')}
                  sx={{ backgroundColor: "#3eb93e", marginRight: 40}}
                >
                  Add Education
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Grid container spacing={6} sx={{ maxWidth: "800px" }}>
                {education.map((edu, index) => (
                  <Grid item xs={12} sm={6} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                    <Card sx={{ width: "100%", maxWidth: "350px", position: "relative" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {edu.degree}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          {edu.institution}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.years}
                        </Typography>
                        {isAdmin && (
                          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                            <IconButton size="small" onClick={() => handleEdit('education', edu)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete('education', edu._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {education.length === 0 && (
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No education records available.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Certificates Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, width: "1400px" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmojiEventsIcon sx={{ color: "#3eb93e", mr: 2, fontSize: 30 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3eb93e" }}>
                  Certificates
                </Typography>
              </Box>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAdd('certificate')}
                  sx={{ backgroundColor: "#3eb93e", marginRight: 40 }}
                >
                  Add Certificate
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Grid container spacing={6} sx={{ maxWidth: "800px" }}>
                {certificates.map((cert, index) => (
                  <Grid item xs={12} sm={6} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                    <Card sx={{ width: "100%", maxWidth: "350px", position: "relative" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {cert.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          {cert.issuer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cert.year}
                        </Typography>
                        {isAdmin && (
                          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                            <IconButton size="small" onClick={() => handleEdit('certificate', cert)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete('certificate', cert._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {certificates.length === 0 && (
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No certificates available.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Skills Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, width: "1400px" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BuildIcon sx={{ color: "#3eb93e", mr: 2, fontSize: 30 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3eb93e" }}>
                  Skills
                </Typography>
              </Box>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAdd('skill')}
                  sx={{ backgroundColor: "#3eb93e", marginRight: 40 }}
                >
                  Add Skill
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
              {skills.map((skill, index) => (
                <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                  <Chip
                    label={skill.name}
                    sx={{
                      backgroundColor: "#3eb93e",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#2a8a2a",
                      },
                      pr: isAdmin ? 6 : 2,
                    }}
                  />
                  {isAdmin && (
                    <Box sx={{ position: "absolute", top: 0, right: 0, display: "flex" }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit('skill', skill)}
                        sx={{ 
                          color: "white", 
                          padding: "2px",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete('skill', skill._id)}
                        sx={{ 
                          color: "white", 
                          padding: "2px",
                          "&:hover": { backgroundColor: "rgba(255,0,0,0.3)" }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            {skills.length === 0 && (
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No skills available.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${dialogType}` : `Add ${dialogType}`}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'education' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="degree"
                label="Degree"
                fullWidth
                variant="outlined"
                value={formData.degree || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="institution"
                label="Institution"
                fullWidth
                variant="outlined"
                value={formData.institution || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="years"
                label="Years"
                fullWidth
                variant="outlined"
                value={formData.years || ''}
                onChange={handleFormChange}
              />
            </>
          )}
          {dialogType === 'certificate' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Certificate Title"
                fullWidth
                variant="outlined"
                value={formData.title || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="issuer"
                label="Issuer"
                fullWidth
                variant="outlined"
                value={formData.issuer || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="year"
                label="Year"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.year || ''}
                onChange={handleFormChange}
              />
            </>
          )}
          {dialogType === 'skill' && (
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Skill Name"
              fullWidth
              variant="outlined"
              value={formData.name || ''}
              onChange={handleFormChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default About;