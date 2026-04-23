import membersTable from "@/js/components/team/membersTable";

export default function initTeamPage({ users }) {
  const teamContent = document.querySelector(".team-content");
  if (teamContent) membersTable({ container: teamContent, users });
}
