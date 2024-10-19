export function slugify(text: string, id: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-')  // Replace spaces, underscores, and hyphens with a single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens

  // Ensure the slug is not empty and has a reasonable length
  const maxSlugLength = 60;
  const truncatedSlug = slug.slice(0, maxSlugLength);

  // Combine slug with ID, ensuring the ID is always present
  return `${truncatedSlug}-${id}`.replace(/-+/g, '-');
}