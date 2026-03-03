export const getUsers = async () => {
  try {
    const response = await fetch("/src/data/users.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};
