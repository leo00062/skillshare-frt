export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  //   console.log(formData.get("email"));
  if (!formData.get("username").trim())
    errors.username = "Le nom d'utilisateur est requis";
  // regex vérif email saisi
  //   console.log(errors.username);
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );
  // validation email
  const email = formData.get("email").trim();
  if (!emailRegex.test(email)) {
    errors.email = "Email invalide";
    // console.log(errors.email);
  }
  // Regex mot de passe : 12 caractères minimun, 1 majuscule, 1 chiffre, 1 caractère spécial
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]{12,}$/;
  const strongPasswordRegex = new RegExp(passwordRegexPattern);
  // validation mot de passe
  // validation email
  const password = formData.get("password").trim();
  if (!strongPasswordRegex.test(password)) {
    errors.password =
      "Mot de passe invalide : 12 caractères minimun, 1 majuscule, 1 chiffre, 1 caractère spécial";
  }

  const file = formData.get("avatar");
  let errorsAvatarTab = [];
  // Rendre l'avatar obligatoire
  //   if (!file.name) {
  //     errorsAvatarTab.push("Fichier avatar requis !");
  //   }
  if (file.name && !file.type.match(/^image\/(jpeg|png|jpg)$/)) {
    errorsAvatarTab.push("Fichier non valide [jpeg|png|jpg]");
  }
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.name && file.size > maxSize) {
    errorsAvatarTab.push("Fichier trop volumineux [max: 1MB]");
  }
  if (errorsAvatarTab.length > 0) {
    errors.avatar = errorsAvatarTab.join(",");
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
