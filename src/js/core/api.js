let usersCache = null;

export const getUsers = async () => {
  if (usersCache) return usersCache;

  try {
    const response = await fetch("/src/data/users.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    usersCache = data;
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const clearUsersCache = () => {
  usersCache = null;
};

export const getCurrentUser = async () => {
  const currentUserId = sessionStorage.getItem("current-user-id");
  if (!currentUserId) return null;

  const users = await getUsers();
  return users.find((u) => u.id === currentUserId) ?? null;
};

/**
 * NOTE: Fetches a mock "current date and time" from the API to simulate
 * the current time to allow time-dependent features to be showcased
 * using data from 2025.
 * In production, 'Temporal.Now.plainDateTimeISO()' would be used.
 * @returns {Promise<{currentDateTime: string}>}
 */
export const getCurrentDateTimeStr = async () => {
  try {
    const response = await fetch("/src/data/current-date-time.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.currentDateTime;
  } catch (error) {
    console.error("Failed to fetch current dateTime:", error);
    return null;
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

export const getAssignments = async () => {
  try {
    const response = await fetch("/src/data/assignments.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    return [];
  }
};

export const getUserPosts = async (userId) => {
  const id = userId.split("_").at(-1);
  try {
    const response = await fetch(`/src/data/posts-user-${id}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
};
