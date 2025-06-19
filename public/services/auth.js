export class AuthManager {
  static isLoggedIn(message) {
    // return !!localStorage.getItem('JWTtoken');
    const token = localStorage.getItem("JWTtoken");
    // Routes sans connexion

    if (!token || this.isTokenExpired(token)) {
      this.redirectUserToLogin(message);
      return false;
    }
    return true;
  }

  static redirectUserToLogin(message) {
    // console.log(message);
    const notAllowedPaths = ["%2Fcompetences", "%2Fprofil", "%2Fdashboard"];
    const currentPath = encodeURIComponent(window.location.pathname);
    this.logout();
    if (notAllowedPaths.includes(currentPath)) {
      window.location.href = `/connexion?redirect=${currentPath}${
        message ? `&message=${encodeURIComponent(message)}` : ""
      }`;
    }
    return false;
  }

  static hasRole(role) {
    const token = localStorage.getItem("JWTtoken");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role.includes(`ROLE_${role}`);
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  static getUser() {
    const token = localStorage.getItem("JWTtoken");
    if (!token) return false;
    const userStr = JSON.parse(localStorage.getItem("user"));
    const payload = JSON.parse(atob(token.split(".")[1]));
    const completeUser = { ...userStr, ...payload };
    return userStr && payload ? completeUser : null;
  }

  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) {
      console.log("Element UL non trouvé");
      return;
    }
    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();

    if (isLoggedIn && user) {
      // Vérifier si l'utilisateur est admin pour afficher le lien du dashboard
      const isAdmin = this.hasRole("ADMIN");

      let navHTML = `
        <li><a href="/competences">Compétences</a></li>
        <li><a href="/profil">Profil</a></li>
        `;

      // Afficher le lien du dashboard uniquement pour les admins
      if (isAdmin) {
        navHTML += `<li><a href="/dashboard" class="admin-link">Dashboard</a></li>`;
      }

      navHTML += `<li><a href="#" id="logout-btn">Déconnexion</a></li>`;

      navLinks.innerHTML = navHTML;

      // Gestion déconnexion
      const logoutBtn = document.querySelector("#logout-btn");
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
        window.location.href = "/connexion";
      });
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
    // window.location.href = "/connexion";
  }

  /**
   * Vérifie si l'utilisateur a le rôle ADMIN
   * Redirige vers la connexion si non connecté ou vers la page d'accueil si pas admin
   * @returns {boolean} true si l'utilisateur est admin, false sinon
   */
  static checkAdminAccess() {
    // Vérifier d'abord si l'utilisateur est connecté
    this.isLoggedIn();
    // Vérifier ensuite s'il a le rôle ADMIN
    if (!this.hasRole("ADMIN")) {
      // Rediriger vers la page de connexion si non admin
      console.warn("Accès refusé : utilisateur non admin");
      // Redirection vers la page de connexion
      this.redirectUserToLogin(
        "Vous devez être administrateur pour accéder au dashboard."
      );
      return false;
    }
    return true;
  }
}
