import YogdharaLogo from "../assets/logo-white.png";
import { Box } from "@mui/material";

function LogoWhite({ ...props }) {
  return (
    <Box
      component="img"
      src={YogdharaLogo}
      alt="Yogdhara Logo"
      sx={{
        display: { xs: "none", md: "flex" },
        height: 70, // adjust logo size
      }}
      {...props}
    />
  );
}

export default LogoWhite;