import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import auth from "../lib/auth-helper.js";
import { read, update } from "./api-user.js";
import { Navigate, useParams } from "react-router-dom";

export default function EditProfile() {
  const { userId } = useParams();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    admin: false,
    error: "",
    NavigateToProfile: false,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    // 로그인되지 않았으면 접근 거부
    if (!jwt) {
      setValues((prev) => ({ ...prev, error: "Please sign in to access this page." }));
      return;
    }

    // 본인의 프로필이 아니면서 admin도 아닌 경우 접근 거부
    if (jwt.user._id !== userId && !jwt.user.admin) {
      setValues((prev) => ({ ...prev, error: "Access denied. You can only edit your own profile." }));
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log('EditProfile: Loading user data for userId:', userId);
    console.log('EditProfile: Current user:', jwt.user._id);
    console.log('EditProfile: Is admin:', jwt.user.admin);

    read(
      {
        userId: userId, // URL 파라미터의 userId 사용
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data?.error) {
        console.error('EditProfile: Error loading user data:', data.error);
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        console.log('EditProfile: User data loaded:', data);
        setValues((prev) => ({ ...prev, name: data.name, email: data.email, admin: data.admin }));
      }
    }).catch((err) => {
      // abort 에러가 아닌 경우만 처리
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch user data:', err);
        setValues((prev) => ({ ...prev, error: 'Failed to load user data' }));
      }
    });

    return () => abortController.abort();
  }, [userId]); // jwt 객체 제거, userId만 dependency로 유지


  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      // admin 상태는 toggle에서 별도로 처리하므로 제외
    };

    // password가 비어있으면 제거
    if (!user.password) {
      delete user.password;
    }

    update(
      {
        userId: userId, // URL 파라미터의 userId 사용
      },
      { t: jwt.token },
      user
    ).then((data) => {
      if (data?.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        // 본인의 프로필을 수정한 경우에만 auth 정보 업데이트
        if (jwt.user._id === userId) {
          auth.updateUser(data, () => {
            setValues({
              ...values,
              userId: data._id,
              NavigateToProfile: true,
            });
          });
        } else {
          // 다른 사용자의 프로필을 수정한 경우
          setValues({
            ...values,
            userId: data._id,
            NavigateToProfile: true,
          });
        }
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleAdminToggle = (event) => {
    const newAdminStatus = event.target.checked;
    const updatedUser = { admin: newAdminStatus }; // admin 필드만 전송

    update({ userId: userId }, { t: jwt.token }, updatedUser).then((data) => {
      if (data && data.error) {
        console.log('Admin toggle error:', data.error);
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        console.log('Admin status updated successfully:', data.admin);
        setValues((prev) => ({ ...prev, admin: data.admin }));

        // 본인의 프로필을 수정한 경우에만 auth 정보 업데이트
        if (jwt.user._id === userId) {
          auth.updateUser(data, () => {
            console.log("Admin status updated in auth");
          });
        }
      }
    }).catch((err) => {
      console.error('Failed to update admin status:', err);
      setValues((prev) => ({ ...prev, error: 'Failed to update admin status' }));
    });
  };

  if (values.NavigateToProfile) {
    return <Navigate to={`/user/${values.userId}`} />;
  }

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        textAlign: "center",
        pb: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#3eb93e",
            mb: 4,
            textAlign: "center",
          }}
        >
          Edit Profile
        </Typography>

        <TextField
          id="name"
          label="Name"
          value={values.name}
          onChange={handleChange("name")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />
        <br />

        <TextField
          id="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />
        <br />

        <TextField
          id="password"
          type="password"
          label="Password"
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />

        {/* Admin 스위치는 본인 프로필일 때 항상 표시, 다른 사용자 프로필은 admin만 표시 */}
        {(jwt.user._id === userId || jwt.user.admin) && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
              Admin Status
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={values.admin}
                  onChange={handleAdminToggle}
                  color="primary"
                />
              }
              label={values.admin ? "Admin" : "User"}
            />
            <br />
          </>
        )}

        {values.error && (
          <Typography component="p" color="error" sx={{ mt: 1 }}>
            <Icon color="error" sx={{ verticalAlign: "middle", mr: 1 }}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          sx={{ mb: 2 }}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
