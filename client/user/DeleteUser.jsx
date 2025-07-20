import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import auth from "../lib/auth-helper.js";
import { remove } from "./api-user.js";
import { Navigate } from "react-router-dom";

export default function DeleteUser({ userId }) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();
  
  // 권한 체크: 본인의 계정이거나 admin 권한이 있어야 함
  const canDelete = jwt && (jwt.user._id === userId || jwt.user.admin);
  const isDeletingOwnAccount = jwt && jwt.user._id === userId;

  const clickButton = () => {
    setOpen(true);
  };

  const deleteAccount = () => {
    remove({ userId }, { t: jwt.token }).then((data) => {
      if (data?.error) {
        console.error(data.error);
      } else {
        // 자신의 계정을 삭제한 경우에만 JWT 클리어
        if (isDeletingOwnAccount) {
          auth.clearJWT(() => console.log("deleted"));
        }
        setRedirect(true);
      }
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    // 자신의 계정을 삭제한 경우 홈으로, 다른 사용자를 삭제한 경우 사용자 목록으로
    return <Navigate to={isDeletingOwnAccount ? "/" : "/users"} />;
  }

  // 권한이 없으면 아무것도 렌더링하지 않음
  if (!canDelete) {
    return null;
  }

  return (
    <>
      <IconButton
        aria-label="Delete account"
        onClick={clickButton}
        color="error"
      >
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>
          {isDeletingOwnAccount ? "Delete Your Account" : "Delete User Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isDeletingOwnAccount 
              ? "Are you sure you want to delete your account? This action is irreversible and you will be logged out."
              : "Are you sure you want to delete this user's account? This action is irreversible."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="error"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
