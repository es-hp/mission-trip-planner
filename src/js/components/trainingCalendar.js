import createCalendar from "./createCalendar";
import { getTripDetails } from "../core/api";

export default async function trainingCalendar(container) {
  const tripDetails = await getTripDetails();

  createCalendar(container, tripDetails, "trainingSchedule");
}
