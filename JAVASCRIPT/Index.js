document.addEventListener("DOMContentLoaded", function() {
  const profileLink = document.getElementById("profileLink");
  const modal = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".close");

  // When profile icon is clicked
  profileLink.addEventListener("click", function(event) {
    event.preventDefault();
    modal.style.display = "block"; // show the modal
  });

  // When close (×) button is clicked
  closeBtn.addEventListener("click", function() {
    modal.style.display = "none"; // hide the modal
  });

  // When clicking outside the modal box
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});