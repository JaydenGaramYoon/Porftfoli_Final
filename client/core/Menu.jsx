import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import auth from "../lib/auth-helper";
import { Link, useNavigate, useLocation } from "react-router-dom";


const isActive = (location, path) =>
  location.pathname === path ? "#3eb96bff" : "#000000";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", gap: 2, alignItems: "center", backgroundColor: "#ffffff", color: "#000000", height: "100px"}}>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{
            textDecoration: "none", 
            color: isActive(location, "/"),
            display: 'inline-block',
            transition: 'transform 0.2s ease',
          }}>
            <img 
              src={"/custom-logo.png"} 
              alt="Logo" 
              style={{ 
                borderRadius: "50px", 
                marginTop: "10px",
                marginLeft: "30px",
                height: "70px",
                transition: 'transform 0.5s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseDown={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </Link>
        </Typography>

        <Link to="/">
          <IconButton aria-label="Home" sx={{ color: isActive(location, "/") }}>
            <HomeIcon />
          </IconButton>
        </Link>

        <Link to="/services">
          <Button sx={{
            color: isActive(location, "/services"),
            fontSize: '1.2rem',
            '&:focus': {
              borderRadius: "25px",
              outline: '2px solid #ffffff'
            },
            '&:hover': {
              color: "#3eb96bff",
              backgroundColor: '#ffffff'
            }
          }}>
            Services
          </Button>
        </Link>
        <Link to="/project">
          <Button sx={{
            color: isActive(location, "/project"),
            fontSize: '1.2rem',
            '&:focus': {
              borderRadius: "25px",
              outline: '2px solid #ffffff'
            },
            '&:hover': {
              color: "#3eb96bff",
              backgroundColor: '#ffffff'
            }
          }}>
            Projects
          </Button>
        </Link>
        <Link to="/about">
          <Button sx={{
            color: isActive(location, "/about"),
            fontSize: '1.2rem',
            '&:focus': {
              borderRadius: "25px",
              outline: '2px solid #ffffff'
            },
            '&:hover': {
              color: "#3eb96bff",
              backgroundColor: '#ffffff'
            }
          }}>
            About
          </Button>
        </Link>
        <Link to="/contact">
          <Button sx={{
            color: isActive(location, "/contact"),
            fontSize: '1.2rem',
            '&:focus': {
              borderRadius: "25px",
              outline: '2px solid #ffffff'
            },
            '&:hover': {
              color: "#3eb96bff",
              backgroundColor: '#ffffff'
            }
          }}>
            Contact
          </Button>
        </Link>

        {/* Admin Only - Users Tab */}
        {auth.isAuthenticated() && auth.isAuthenticated().user.admin && (
          <Link to="/users">
            <Button sx={{
              color: isActive(location, "/users"),
              fontSize: '1.2rem',
              '&:focus': {
                borderRadius: "25px",
                outline: '2px solid #ffffff'
              },
              '&:hover': {
                color: "#3eb96bff",
                backgroundColor: '#ffffff'
              }
            }}>
              Users
            </Button>
          </Link>
        )}

        {!auth.isAuthenticated() && (
          <>
            <Link to="/signup">
              <Button sx={{
                color: isActive(location, "/signup"),
                fontSize: '1.2rem',
                '&:focus': {
                  borderRadius: "25px",
                  outline: '2px solid #ffffff'
                },
                '&:hover': {
                  color: "#3eb96bff",
                  backgroundColor: '#ffffff'
                }
              }}>
                Sign up
              </Button>
            </Link>
            <Link to="/signin">
              <Button sx={{
                color: isActive(location, "/signin"),
                fontSize: '1.2rem',
                '&:focus': {
                  borderRadius: "25px",
                  outline: '2px solid #ffffff'
                },
                '&:hover': {
                  color: "#3eb96bff",
                  backgroundColor: '#ffffff'
                }
              }}>
                Sign In
              </Button>
            </Link>
          </>
        )}

        {auth.isAuthenticated() && (
          <>
            <Link to={`/user/${auth.isAuthenticated().user._id}`}>
              <Button
                sx={{
                  color: isActive(
                    location,
                    `/user/${auth.isAuthenticated().user._id}`
                  ),
                  fontSize: '1.2rem',
                  '&:focus': {
                    outline: '2px solid #ffffff'
                  },
                  '&:hover': {
                    backgroundColor: '#ffffff'
                  }
                }}
              >
                My Profile
              </Button>
            </Link>
            <Button
              sx={{
                color: "#000000",
                fontSize: '1.2rem',
                '&:focus': {
                  borderRadius: "25px",
                  outline: '2px solid #ffffff'
                },
                '&:hover': {
                  color: "#3eb96bff",
                  backgroundColor: '#ffffff'
                }
              }}
              onClick={() => {
                auth.completeLogout(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}


