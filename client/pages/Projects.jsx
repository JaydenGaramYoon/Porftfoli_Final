import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import auth from "../lib/auth-helper.js";
import { list, create, update, remove } from "./api-projects.js";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    image: "",
    description: "",
    technologies: "",
    role: "",
    github: "",
    liveDemo: "",
  });
  // jwt 변수 제거 - 필요할 때마다 동적으로 가져오기

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && !data.error) {
        setProjects(data);
      }
    });

    return () => abortController.abort();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const currentJwt = auth.isAuthenticated(); // 최신 JWT 토큰 가져오기
    
    // 필수 필드 검증
    if (!projectForm.title.trim()) {
      alert('Project title is required');
      return;
    }
    if (!projectForm.image.trim()) {
      alert('Project image URL is required');
      return;
    }
    // 이미지 URL 형식 검증
    if (!projectForm.image.startsWith('http://') && !projectForm.image.startsWith('https://')) {
      alert('Please provide a valid image URL (starting with http:// or https://)');
      return;
    }
    if (!projectForm.description.trim()) {
      alert('Project description is required');
      return;
    }
    if (!projectForm.role.trim()) {
      alert('Your role is required');
      return;
    }
    
    const projectData = {
      title: projectForm.title.trim(),
      image: projectForm.image.trim(),
      description: projectForm.description.trim(),
      technologies: projectForm.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
      role: projectForm.role.trim(),
    };

    // URL 필드가 비어있지 않고 유효한 경우에만 추가
    if (projectForm.github && projectForm.github.trim() && projectForm.github.trim() !== '') {
      const githubUrl = projectForm.github.trim();
      if (githubUrl.startsWith('http://') || githubUrl.startsWith('https://')) {
        projectData.github = githubUrl;
      } else {
        alert('Please provide a valid GitHub URL (starting with http:// or https://)');
        return;
      }
    }
    
    if (projectForm.liveDemo && projectForm.liveDemo.trim() && projectForm.liveDemo.trim() !== '') {
      const liveDemoUrl = projectForm.liveDemo.trim();
      if (liveDemoUrl.startsWith('http://') || liveDemoUrl.startsWith('https://')) {
        projectData.liveDemo = liveDemoUrl;
      } else {
        alert('Please provide a valid Live Demo URL (starting with http:// or https://)');
        return;
      }
    }

    console.log('Sending project data:', projectData); // 디버그 로그

    if (editingProject) {
      update({ projectId: editingProject }, { t: currentJwt.token }, projectData).then((data) => {
        if (data && !data.error) {
          setProjects(projects.map(p => p._id === editingProject ? data : p));
          handleClose();
        } else {
          console.error('Update error:', data);
          alert('Failed to update project: ' + (data.error || 'Unknown error'));
        }
      });
    } else {
      console.log('Creating project with JWT:', currentJwt); // 디버그 로그 추가
      create({ t: currentJwt.token }, projectData).then((data) => {
        if (data && !data.error) {
          list().then((updatedData) => {
            if (updatedData && !updatedData.error) {
              setProjects(updatedData);
            }
          });
          handleClose();
        } else {
          console.error('Create error:', data);
          alert('Failed to create project: ' + (data.error || 'Unknown error'));
        }
      });
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project._id);
    setProjectForm({
      title: project.title,
      image: project.image,
      description: project.description,
      technologies: project.technologies.join(', '),
      role: project.role,
      github: project.github || "",
      liveDemo: project.liveDemo || "",
    });
    setOpen(true);
  };

  const handleDelete = (projectId) => {
    const currentJwt = auth.isAuthenticated(); // 최신 JWT 토큰 가져오기
    remove({ projectId }, { t: currentJwt.token }).then((data) => {
      if (data && !data.error) {
        setProjects(projects.filter(p => p._id !== projectId));
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
    setProjectForm({
      title: "",
      image: "",
      description: "",
      technologies: "",
      role: "",
      github: "",
      liveDemo: "",
    });
  };

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
        Projects
      </Typography>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={project.image}
                alt={project.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Role: {project.role}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {project.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {project.github && (
                    <Button
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={project.github}
                      target="_blank"
                    >
                      GitHub
                    </Button>
                  )}
                  {project.liveDemo && (
                    <Button
                      size="small"
                      startIcon={<LaunchIcon />}
                      href={project.liveDemo}
                      target="_blank"
                    >
                      Live Demo
                    </Button>
                  )}
                </Box>
                {auth.isAuthenticated() && auth.isAuthenticated().user && auth.isAuthenticated().user.admin && (
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(project)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(project._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          Loading projects...
        </Typography>
      )}

      {auth.isAuthenticated() && auth.isAuthenticated().user && auth.isAuthenticated().user.admin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Project Title"
            fullWidth
            variant="outlined"
            required
            value={projectForm.title}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            variant="outlined"
            required
            value={projectForm.image}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            required
            value={projectForm.description}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="technologies"
            label="Technologies (comma separated)"
            fullWidth
            variant="outlined"
            value={projectForm.technologies}
            onChange={handleFormChange}
            helperText="e.g., React, Node.js, MongoDB"
          />
          <TextField
            margin="dense"
            name="role"
            label="Your Role"
            fullWidth
            variant="outlined"
            required
            value={projectForm.role}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="github"
            label="GitHub URL"
            fullWidth
            variant="outlined"
            value={projectForm.github}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="liveDemo"
            label="Live Demo URL"
            fullWidth
            variant="outlined"
            value={projectForm.liveDemo}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProject ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;
