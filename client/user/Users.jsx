import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { list } from "./api-user.js";
import { Link as RouterLink } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data?.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    }).catch((err) => {
      // abort 에러가 아닌 경우만 처리
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch users:', err);
      }
    });

    return () => abortController.abort();
  }, []);

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
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#3eb93e",
          mb: 4,
          textAlign: "center",
        }}
      >
        Users
      </Typography>
      <List dense>
        {users.map((item, i) => (
          <Link
            component={RouterLink}
            to={`/user/${item._id}`}
            underline="none"
            key={item._id}
            sx={{ color: "inherit" }}
          >
            <ListItem 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    </Paper>
  );
}
