import { createEl } from "@utils";
import createTile from "../design-system/createTile";
import { Temporal } from "@js-temporal/polyfill";

export default function userPrayers({ container, user }) {
  createTile({ container, header: "Prayer Requests", body });
}
