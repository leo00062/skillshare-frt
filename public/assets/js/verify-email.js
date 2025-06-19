import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const msg = document.querySelector("#verify-msg");

  const API_URL = document.querySelector("#api-url").value;
  const loginLink = document.querySelector("#login-link");

  if (!token) {
    msg.textContent = "Token is missing in the URL.";
    msg.computedStyleMap.color = "red";
    return;
  }

  try {
    const result = await fetchData({
      route: "/api/verify-email",
      api: API_URL,
      options: {
        params: { token },
      },
    });
    if (result.success) {
      msg.textContent = result.message;
      msg.style.color = "green";
      loginLink.style.display = "block";
    }
  } catch (error) {
    msg.textContent = "An error occurred while processing the token.";
    const contactButton = document.createElement("a");
    contactButton.setAttribute("href", "mailto:Contact@skillshare.com");
    contactButton.textContent = "Contact Support";
    msg.appendChild(contactButton);
    msg.style.color = "red";
  }
});
