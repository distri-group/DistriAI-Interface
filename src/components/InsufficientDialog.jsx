import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function InsufficientDialog({ open, close }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>DIST insufficient</DialogTitle>
      <DialogContent>
        <p>Sorry, you don't have sufficient DIST.</p>
        <p>Go to DIST Faucet to obtain DIST airdrop.</p>
      </DialogContent>
      <DialogActions>
        <Button
          className="cbtn"
          style={{ width: 160 }}
          onClick={() => navigate("/faucet")}>
          Go to Faucet
        </Button>
        <Button className="cbtn" style={{ width: 100 }} onClick={close}>
          Later
        </Button>
      </DialogActions>
    </Dialog>
  );
}
