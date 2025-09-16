export interface GalleryProps {
  groupId: number;
}

export interface ImageData {
  imageUrl: string;
  postTitle: string;
  postContent: string;
  authorName: string;
  createdAt: string;
}

export interface ImageModalProps extends ImageData {
  isOpen: boolean;
  onClose: () => void;
}
