import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteUser from "./DeleteUser";
import auth from "../lib/auth-helper.js";
import { read, update } from "./api-user.js";
import { list as listContacts, update as updateContact, remove as removeContact } from "./api-contact.js";
import { useLocation, Navigate, Link, useParams } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    message: "",
  });
  const jwt = auth.isAuthenticated();
  const { userId } = useParams();

  useEffect(() => {
    // JWT가 없으면 로그인 페이지로 리다이렉트
    if (!jwt) {
      setRedirectToSignin(true);
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    }).catch((err) => {
      // abort 에러가 아닌 경우만 처리
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch user data:', err);
        setRedirectToSignin(true);
      }
    });

    // admin이면 contact 정보 가져오기
    if (jwt.user && jwt.user.admin) {
      listContacts(signal).then((data) => {
        if (data && !data.error) {
          console.log('Fetched contacts:', data); // 디버깅용
          setContacts(data);
        } else {
          console.error('Error fetching contacts:', data);
        }
      }).catch((err) => {
        if (err.name === 'AbortError') {
          // 요청이 중단된 경우 조용히 처리 (컴포넌트 언마운트 시 정상적인 동작)
          console.log('Contact list request aborted');
          return;
        }
        console.error('Failed to fetch contacts:', err);
      });
    }

    return () => abortController.abort();
  }, [userId]);

  const handleAdminToggle = (event) => {
    const newAdminStatus = event.target.checked;
    const updatedUser = { ...user, admin: newAdminStatus };
    
    update({ userId: user._id }, { t: jwt.token }, updatedUser).then((data) => {
      if (data && data.error) {
        console.log(data.error);
        console.log(jwt.token);
      } else {
        setUser(data);
        // Update local storage with new user data
        auth.updateUser(data, () => {
          // 페이지 새로고침으로 메뉴 상태 즉시 반영
          window.location.reload();
        });
        
        // admin이 true로 변경되면 contacts 페치, false로 변경되면 contacts 클리어
        if (newAdminStatus) {
          const abortController = new AbortController();
          const signal = abortController.signal;
          
          listContacts(signal).then((contactData) => {
            if (contactData && !contactData.error) {
              console.log('Fetched contacts after admin toggle:', contactData);
              setContacts(contactData);
            } else {
              console.error('Error fetching contacts after admin toggle:', contactData);
            }
          }).catch((err) => {
            if (err.name !== 'AbortError') {
              console.error('Failed to fetch contacts after admin toggle:', err);
            }
          });
        } else {
          // admin이 false가 되면 contacts 클리어
          setContacts([]);
        }
      }
    });
  };

  const handleContactEdit = (contact) => {
    console.log('Editing contact:', contact); // 디버깅용
    setEditingContact(contact._id);
    setContactForm({
      first_name: contact.first_name || "",
      last_name: contact.last_name || "",
      email: contact.email_address || contact.email || "",
      contact_number: contact.contact_number || "",
      message: contact.message || "",
    });
  };

  const handleContactUpdate = () => {
    updateContact({ contactId: editingContact }, { t: jwt.token }, contactForm).then((data) => {
      if (data && !data.error) {
        setContacts(contacts.map(contact => 
          contact._id === editingContact ? data : contact
        ));
        setEditingContact(null);
        setContactForm({
          first_name: "",
          last_name: "",
          email: "",
          contact_number: "",
          message: "",
        });
      }
    });
  };

  const handleContactDelete = (contactId) => {
    removeContact({ contactId }, { t: jwt.token }).then((data) => {
      if (data && !data.error) {
        setContacts(contacts.filter(contact => contact._id !== contactId));
      }
    });
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "text.primary" }}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
        
        <Divider />
        
        {/* Admin Toggle - admin 권한이 있는 사용자만 표시 */}
        {auth.isAuthenticated().user &&
          auth.isAuthenticated().user.admin && (
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={user.admin || false}
                    onChange={handleAdminToggle}
                    color="primary"
                  />
                }
                label={`${user.admin ? 'Admin' : 'User'}`}
              />
            </ListItem>
          )}
        
        <Divider />
        
        {/* Edit/Delete 버튼 - 본인 프로필이거나 admin일 때 보임 */}
        {auth.isAuthenticated().user && (
          <ListItem>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Edit 버튼 - 본인 프로필이거나 admin일 때 보임 */}
              {(auth.isAuthenticated().user._id === user._id || 
                auth.isAuthenticated().user.admin) && (
                <Link to={`/user/edit/${user._id}`}>
                  <IconButton aria-label="Edit" color="primary">
                    <EditIcon />
                  </IconButton>
                </Link>
              )}
              
              {/* Delete 버튼 - 본인 프로필이거나 admin일 때 보임 */}
              {(auth.isAuthenticated().user._id === user._id || 
                auth.isAuthenticated().user.admin) && (
                <DeleteUser userId={user._id} />
              )}
            </Box>
          </ListItem>
        )}
        
        <Divider />
        
        <ListItem>
          <ListItemText
            primary={
              user.created
                ? `Joined: ${new Date(user.created).toDateString()}`
                : "Loading..."
            }
          />
        </ListItem>

        {/* Admin Contact Management Section - 본인 프로필에서만 보임 */}
        {jwt.user && jwt.user.admin && userId === jwt.user._id && (
          <>
            <Divider />
            <ListItem 
              onClick={() => setShowContacts(!showContacts)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <ContactMailIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="All Contact Messages" 
                secondary={`${contacts.length} messages`} 
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => setShowContacts(!showContacts)}>
                  {showContacts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            <Collapse in={showContacts} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                {contacts.map((contact) => (
                  <Card key={contact._id} sx={{ mb: 2 }}>
                    <CardContent>
                      {editingContact === contact._id ? (
                        <Box>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={contactForm.first_name}
                            onChange={handleContactFormChange}
                            margin="normal"
                          />
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={contactForm.last_name}
                            onChange={handleContactFormChange}
                            margin="normal"
                          />
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleContactFormChange}
                            margin="normal"
                          />
                          <TextField
                            fullWidth
                            label="Contact Number"
                            name="contact_number"
                            value={contactForm.contact_number}
                            onChange={handleContactFormChange}
                            margin="normal"
                          />
                          <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactFormChange}
                            multiline
                            rows={3}
                            margin="normal"
                          />
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleContactUpdate}>
                              Update
                            </Button>
                            <Button variant="outlined" onClick={() => setEditingContact(null)}>
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="h6">
                            {contact.first_name} {contact.last_name}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {contact.email_address || contact.email} • {contact.contact_number}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {contact.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Received: {new Date(contact.created).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              onClick={() => handleContactEdit(contact)}
                              startIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              color="error"
                              onClick={() => handleContactDelete(contact._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {contacts.length === 0 && (
                  <Typography color="textSecondary" align="center">
                    No contact messages yet.
                  </Typography>
                )}
              </Box>
            </Collapse>
          </>
        )}
      </List>
    </Paper>
  );
}
