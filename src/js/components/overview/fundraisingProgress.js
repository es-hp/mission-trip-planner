import { createEl } from "@utils";
import createTile from "../design-system/createTile";

export default function fundraisingProgress({ container, tripDetails }) {
  const body = [];

  const fundraisingGoals = [
    {
      label: "Team Progress",
      slug: "team-progress",
      goalAmount: tripDetails.teamFundraising.goalAmount,
      currentAmount: tripDetails.teamFundraising.currentAmount,
    },
    {
      label: "My Progress",
      slug: "user-progress",
      goalAmount: tripDetails.individualFundraising.goalAmount,
      currentAmount: 300,
    },
  ];

  fundraisingGoals.forEach((goal) => {
    const goalGroup = createEl("div", {
      className: `goal-group ${goal.slug}-goal`,
    });
    const goalTitle = createEl("h3", { textContent: goal.label });
    const goalTextGroup = createEl("div", { className: "goal-text-group" });

    const currentAmount = parseFloat(goal.currentAmount.toFixed(2));
    const currentAmountStr = Number.isInteger(currentAmount)
      ? currentAmount.toString()
      : currentAmount.toFixed(2);

    const goalAmount = parseFloat(goal.goalAmount.toFixed(2));
    const goalAmountStr = Number.isInteger(goalAmount)
      ? goalAmount.toString()
      : goalAmount.toFixed(2);

    const currentToTotal = createEl("span", {
      className: "current-to-total",
      textContent: `$${currentAmountStr} / $${goalAmountStr}`,
    });

    const progressPercent = Math.floor(
      (goal.currentAmount / goal.goalAmount) * 100,
    );
    const currentPercent = createEl("div", {
      className: "current-percent",
      textContent: `${progressPercent}`,
    });
    const percentSign = createEl("span", {
      className: "percent-sign",
      textContent: "%",
    });
    currentPercent.append(percentSign);

    currentPercent.classList.add(
      progressPercent < 33.33
        ? "low"
        : progressPercent < 66.66
          ? "med"
          : progressPercent < 100
            ? "high"
            : "done",
    );

    goalTextGroup.append(currentPercent, currentToTotal);

    const progressBar = createEl("div", { className: "progress-bar" });
    const progress = createEl("div", { className: "progress" });
    progress.style.width = `${progressPercent}%`;
    progress.classList.add(
      progressPercent < 33.33
        ? "low"
        : progressPercent < 66.66
          ? "med"
          : progressPercent < 100
            ? "high"
            : "done",
    );
    progressBar.append(progress);

    goalGroup.append(goalTitle, goalTextGroup, progressBar);
    body.push(goalGroup);
  });

  createTile({ container, header: "Fundraising Progress", body });
}
