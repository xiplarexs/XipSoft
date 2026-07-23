export type BlogItem = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  slug: string;
  source?: "static" | "firestore";
  authorName?: string;
  authorPhotoURL?: string;
};
