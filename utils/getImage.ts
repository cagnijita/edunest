export const getImage = (path?: string | null) => {
  if (!path) return "/placeholder.png";

  // external image
  if (path.startsWith("http")) return path;

  // base64 image
  if (path.startsWith("data:image")) return path;

  // backend upload
  if (!path.startsWith("/")) path = "/" + path;

  return `http://localhost:5000${path}`;
};