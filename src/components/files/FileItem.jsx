import { Checkbox, Stack } from "@mui/material";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";

export default function FileItem({ item, onSelect, onNavigate, isSelected }) {
  const handleSelection = (event) => {
    onSelect(
      {
        fileType:
          item.type === "directory"
            ? "folder"
            : item.type === "file"
            ? "document"
            : "document",
        path: item.path,
      },
      event.target.checked
    );
  };
  const handleClick = () => {
    if (item.type === "directory") {
      onNavigate(item.path);
    }
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Checkbox checked={isSelected} onChange={handleSelection} />
      {item.type === "directory" ? <FolderIcon /> : <FileIcon />}
      <span onClick={handleClick}>{item.name}</span>
    </Stack>
  );
}
