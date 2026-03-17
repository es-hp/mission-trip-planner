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

/**
 * NOTE: Fetches a mock "current date and time" from the API to simulate
 * the current time to allow time-dependent features to be showcased
 * using data from 2025.
 * In production, 'Temporal.Now.plainDateTimeISO()' would be used.
 * @returns {Promise<{currentDateTime: string}>}
 */
export const getCurrentDateTime = async () => {
  try {
    const response = await fetch("/src/data/current-date-time.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch current dateTime:", error);
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
