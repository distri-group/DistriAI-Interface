import { Button, Popper, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

const theme = createTheme({});
function DropdownMenu({ className, children, title, keyName }) {
  let currentHovering = false;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleHover = () => {
    currentHovering = true;
  };
  const handleCloseHover = () => {
    currentHovering = false;
    setTimeout(() => {
      if (!currentHovering) {
        handleClose();
      }
    }, 50);
  };
  theme.props = {
    MuiPopper: {
      onMouseEnter: handleHover,
      onMouseLeave: handleCloseHover,
    },
  };
  return (
    <div className={className}>
      <ThemeProvider theme={theme}>
        <Button
          disableRipple
          onMouseOver={(e) => setAnchorEl(e.currentTarget)}
          onMouseLeave={handleCloseHover}
          className={open ? "dropdown" : "disabled"}>
          {title}
        </Button>
        <Popper
          anchorEl={anchorEl}
          open={open}
          slotProps={{
            root: {
              style: {
                marginTop: "8px",
                padding: "6px",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 255, 0.24)",
                backdropFilter: "blur(12px)",
              },
            },
          }}
          placement="bottom-start"
          onMouseEnter={handleHover}
          onMouseLeave={handleCloseHover}
          style={{ zIndex: 1000 }}>
          {children}
        </Popper>
      </ThemeProvider>
    </div>
  );
}
export default styled(DropdownMenu)``;
