import createCalendar from "../design-system/createCalendar";

export default async function trainingCalendar({
  container,
  tripDetails,
  now,
}) {
  createCalendar({
    container,
    data: tripDetails,
    scheduleKey: "trainingSchedule",
    now,
  });
}
