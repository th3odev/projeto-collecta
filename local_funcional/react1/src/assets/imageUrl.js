export function resolveItemImage(path) {
  if (!path) return null;

  // remove qualquer prefixo indevido
  let filename = path
    .replace(/^\/+/, "") // remove barras iniciais
    .replace(/^images\//, "") // remove images/
    .replace(/^uploads\//, ""); // remove uploads/

  return `${window.location.origin}/images/${filename}`;
}
