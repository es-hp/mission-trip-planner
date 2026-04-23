import createCalendar from "../design-system/createCalendar";

export default function trainingCalendar({
  container,
  tripDetails,
  now,
  initialDate,
}) {
  createCalendar({
    container,
    data: tripDetails,
    scheduleKey: "trainingSchedule",
    now,
    initialDate,
  });
}
