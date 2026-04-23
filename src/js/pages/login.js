import loginBackground from "@/js/components/login/loginBackground";
import loginCard from "@/js/components/login/loginCard";

export default function initLoginPage() {
  const loginMain = document.getElementById("login");
  if (loginMain) loginBackground({ container: loginMain });

  const loginCardDiv = document.querySelector(".login-card");
  if (loginCardDiv) loginCard({ container: loginCardDiv });
}
