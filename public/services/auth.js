export class AuthManager {
  static isLoggedIn() {
    // return !!localStorage.getItem('JWTtoken');
    const token = localStorage.getItem("JWTtoken");
    // Route sans connexion
    const notAllowedPaths = ["%2Fcompetences"];

    if (!token || this.isTokenExpired(token)) {
      const currentPath = encodeURIComponent(window.location.pathname);
      this.logout();
      if (notAllowedPaths.includes(currentPath)) {
        window.location.href = `/connexion?redirect=${currentPath}`;
      }
      return false;
    }
    return true;
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log(Date.now());
      console.log(payload.exp);
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static updateNavbar() {
    const navlinks = document.querySelector(".nav-links");
    if (!navlinks) {
      console.log("Element Ul non trouvé");
      return;
    }
    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();

    if (isLoggedIn && user) {
      navlinks.innerHTML = `
        <li><a href="/competences">Compétences</a></li>
        <li><a href="/profil">Profil</a></li>
        <li><a href="#" id="logout-btn">Déconnexion</a></li>
        `;

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
  }
}
