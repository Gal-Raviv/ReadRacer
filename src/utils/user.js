export function getOrCreateUserId() {
  const storedId = localStorage.getItem("userId");
  if (storedId) return storedId;
  // If no storedId, you should NOT generate a new UUID blindly here,
  // because you might have to fetch from backend or wait until login
  return null; 
}