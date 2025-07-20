import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import photoOfMe from  "./../assets/images/photo-of-me.png";

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 5,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          color: theme.custom?.openTitle || theme.palette.primary.main,
        }}
      >
        Card Title
      </Typography>
      <CardMedia
        sx={{ minHeight: 400 }}
        image={photoOfMe}
        title="Photo of Me"
      />
      <CardContent>
        <Typography variant="body2" component="p">
          Welcome to the MERN Skeleton home page.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MyComponent;
