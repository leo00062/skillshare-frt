import { AuthManager } from "../../services/auth.js";

window.addEventListener("DOMContentLoaded", () => {
  // vérification des droits d'acces a la page
  console.log(AuthManager.checkAdminAccess());
  if (!AuthManager.checkAdminAccess()) {
    return;
  }

  console.log("Dashboard admin chagré");
});
