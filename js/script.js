document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const nav = document.querySelector(".navbar-collapse");
  document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn").forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = encodeURIComponent("Személyi edzés érdeklődés – " + data.get("name"));
    const body = encodeURIComponent(
      `Név: ${data.get("name")}\nEmail: ${data.get("email")}\nCél: ${data.get("goal")}\n\nÜzenet:\n${data.get("message") || "Nincs megadva."}`
    );
    document.getElementById("formStatus").textContent = "Megnyitjuk az email alkalmazásodat az előkészített üzenettel.";
    window.location.href = `mailto:hello@boldizsartraining.hu?subject=${subject}&body=${body}`;
  });
});
