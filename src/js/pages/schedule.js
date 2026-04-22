import trainingCalendar from "@/js/components/schedule/trainingCalendar";
import tripSchedule from "@/js/components/schedule/tripSchedule";

export default async function initSchedulePage({ tripDetails, now }) {
  const calendarDiv = document.getElementById("training-calendar");
  if (calendarDiv)
    trainingCalendar({ container: calendarDiv, tripDetails, now });

  const tripScheduleDiv = document.getElementById("trip-schedule");
  if (tripScheduleDiv) {
    await tripSchedule(tripScheduleDiv);
  }
}
