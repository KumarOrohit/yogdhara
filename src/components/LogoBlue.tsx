import YogdharaLogo from "../assets/logo-blue.png";
import { Box } from "@mui/material";

function LogoBlue({ ...props }) {
  return (
    <Box
      component="img"
      src={YogdharaLogo}
      alt="Arogya Ananta Logo"
      sx={{
        display: { md: "flex" },
        height: 60, // adjust logo size
      }}
      {...props}
    />
  );
}

export default LogoBlue;