import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        width: "120vh",
        height: "100vh", // 고정 높이
        margin: "auto",
        mt: 1, // margin-top 제거
        position: "relative",
      }}
    >
      {/* 첫 번째 카드 (기본) */}
      <Card
        sx={{
          width: "100%",
          height: "40vh",
          background: "white",
          position: "absolute",
          paddingTop: 0,
          top: 0,
          left: 0,
          overflow: "hidden",
          textAlign: "left",
          px: 5,
          py: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 9,
          boxShadow: 'none', // 박스 쉐도우 제거
          pt: 1,
          pb: 1,
          pl: 10,
        }}
      >
        {/* 왼쪽: 이미지 */}
        <Box
          component="img"
          src="/photo-of-me.png"
          alt="Garam Yoon"
          sx={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
          }}
        />

        {/* 오른쪽: 텍스트 */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#3eb93e",
              mb: 2,
            }}
          >
            Garam Yoon
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontSize: "1.2rem", color: "#000000", mb: 2 }}
          >
            Full-stack Developer · QA Analyst · Strong Communicator
          </Typography>

          {/* 버튼들 */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Link to="/project" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  color: "#3eb93e",
                  "&:hover": {
                    color: "#2a8a2a",
                    cursor: "pointer",
                  },
                }}
              >
                Projects
              </Typography>
            </Link>

            <Link to="/contact" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  color: "#3eb93e",
                  "&:hover": {
                    color: "#2a8a2a",
                    cursor: "pointer",
                  },
                }}
              >
                Contact
              </Typography>
            </Link>
          </Box>
        </Box>
      </Card>

      {/* 두 번째 카드 (상세 정보) */}
      <Card
        sx={{
          width: "100%",
          height: "50vh",
          background: "white",
          position: "absolute",
          top: "40vh", // 첫 번째 카드 바로 아래에 배치
          left: 0,
          px: 5,
          py: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 'none', // 박스 쉐도우 제거
          mt: 0,
          pt: 1
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: "90%" }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              color: "#000000",
              mb: 3,
              lineHeight: 1.6,
              textAlign: "justify",
            }}
          >
            As a highly skilled QA Analyst and Full-Stack Developer, I bring a strong technical foundation and a deep understanding of the software development lifecycle. My expertise spans both front-end and back-end technologies, allowing me to effectively contribute to all stages of development. I am committed to delivering high-quality, bug-free applications through rigorous testing and efficient development practices. In addition to my technical capabilities, I excel in communication, ensuring seamless collaboration with cross-functional teams and stakeholders to meet project objectives and timelines. I am passionate about problem-solving and dedicated to delivering results that drive business success.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#3eb93e",
              mb: 1,
            }}
          >
            QA analyst | Full-stack Developer | Strong Communicator
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              color: "#666666",
              fontStyle: "italic",
              mb: 2,
            }}
          >
            Location: Toronto, Canada
          </Typography>

          <Typography
            variant="body2"
            component="a"
            href="/Resume.pdf"
            download="Resume.pdf"
            sx={{
              fontSize: "1rem",
              color: "#3eb93e",
              fontWeight: "bold",
              textDecoration: "none",
              "&:hover": {
                color: "#2a8a2a",
                cursor: "pointer",
                textDecoration: "underline",
              },
            }}
          >
            Resume
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Home;
