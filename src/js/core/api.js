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

export const getTripSchedule = async () => {
  try {
    const response = await fetch("/src/data/trip-schedule.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch trip schedule:", error);
    return [];
  }
};

export const getTripDetails = async () => {
  try {
    const response = await fetch("/src/data/trip-details.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch trip details:", error);
    return [];
  }
};
