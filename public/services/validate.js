export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  //   console.log(formData.get('email'));
  // console.log(formData.get("username"));
  if (formData.get("username") !== null && !formData.get("username").trim())
    errors.username = "Le nom d'utilisateur est requis";
  // Regex vérif email saisi
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
  );
  // validation email
  const email = formData.get("email")?.trim();
  if (formData.get("username") !== null && !emailRegex.test(email)) {
    errors.email = "Email invalide";
  }
  // Regex mot de passe : 12 caractères minimun, 1 majuscule, 1 chiffre, 1 caractère spécial
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]{12,}$/;
  const strongPasswordRegex = new RegExp(passwordRegexPattern);
  // validation mot de passe
  const password = formData.get("password")?.trim();
  if (
    formData.get("username") !== null &&
    !strongPasswordRegex.test(password)
  ) {
    errors.password =
      "Mot de passe invalide : 12 caractères minimun, 1 majuscule, 1 chiffre, 1 caractère spécial";
  }

  if (formData.get("avatar")) {
    const file = formData.get("avatar");
    let errorsAvatarTab = [];
    // Avatar obligatoire
    //   if (!file.name) {
    //     errorsAvatarTab.push('Fichier avatar requis !');
    //   }
    if (file.name && !file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      errorsAvatarTab.push("Fichier non  valide [png|jpeg|jpg]");
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.name && file.size > maxSize) {
      errorsAvatarTab.push("Fichier trop volumineux [max: 2MB]");
    }
    if (errorsAvatarTab.length > 0) {
      errors.avatar = errorsAvatarTab.join(",");
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
