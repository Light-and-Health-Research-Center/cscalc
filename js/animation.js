function prep() {
  anime({
    targets: "#main-card-row",
    translateY: 50,
    opacity: 0,
    duration: 0,
  });
  anime({
    targets: "#logo-container",
    translateY: 50,
    opacity: 0,
    duration: 0,
  });
}

function animateMainCard() {
  anime({
    targets: "#main-card-row",
    opacity: {
      value: 1,
      easing: "easeOutQuad",
      duration: 1000,
      delay: 1000,
    },
    translateY: {
      value: 0,
      easing: "easeOutQuad",
      duration: 1000,
      delay: 1000,
    },
  });
}

function animateLogo() {
  anime({
    targets: "#logo-container",
    opacity: {
      value: 1,
      easing: "easeOutQuad",
      duration: 1000,
      delay: 500,
    },
    translateY: {
      value: 0,
      easing: "easeOutQuad",
      duration: 1000,
      delay: 500,
    },
  });
}

$(window).on("load", function () {
  prep();
  animateMainCard();
  animateLogo();
});
