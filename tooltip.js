const tooltip = document.getElementById("tooltip");

// Optional: assign tooltips to countries
const tooltips = {
  DE: "Germany – Lived here",
  CN: "China – Went here 3 times",
  FR: "France – Visited Paris",
  JP: "Japan – Want to visit",
  TH: "Thailand – Visited Chiang Mai"
};

document.querySelectorAll(".map path").forEach(path => {
  path.addEventListener("mousemove", (e) => {
    const hint = tooltips[path.id];
    if (hint) {
      tooltip.innerText = hint;
      tooltip.style.display = "block";
      tooltip.style.left = (e.pageX + 12) + "px";
      tooltip.style.top = (e.pageY - 30) + "px";
    }
  });

  path.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});