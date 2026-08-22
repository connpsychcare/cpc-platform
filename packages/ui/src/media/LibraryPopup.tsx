import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@workspace/ui/components/dialog";
import type { MediaResponse } from "@workspace/contracts/media";
import MediaLibrary from "./library";

interface LibraryPopupProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (media: MediaResponse) => void;
}

const LibraryPopup = ({ open, setOpen, onSelect }: LibraryPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Media Library</DialogTitle>
      <DialogContent className="flex flex-col min-w-[80%] h-[80svh] overflow-hidden p-0 gap-0">
        <div className="flex-1 min-h-0 overflow-auto p-6">
          <MediaLibrary onSelect={onSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LibraryPopup;
