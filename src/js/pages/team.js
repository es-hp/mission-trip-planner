import membersTable from "@/js/components/team/membersTable";

export default function initTeamPage({ users, roleChipMap }) {
  const teamContent = document.querySelector(".team-content");
  if (teamContent) membersTable({ container: teamContent, users, roleChipMap });
}
