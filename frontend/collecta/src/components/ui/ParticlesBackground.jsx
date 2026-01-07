import { useEffect } from "react";

export default function ParticlesBackground() {
  useEffect(() => {
    // evita duplicar script
    if (window.particlesJS) {
      initParticles();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;

    script.onload = () => {
      initParticles();
    };

    document.body.appendChild(script);
  }, []);

  function initParticles() {
    if (!window.particlesJS) return;

    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 90,
          density: {
            enable: true,
            value_area: 1200,
          },
        },
        color: {
          value: "#0D9488",
        },
        shape: {
          type: "star",
        },
        opacity: {
          value: 0.4,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#0D8388",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 4,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          repulse: { distance: 150 },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }

  return (
    <div id="particles-js" className="fixed inset-0 z-0 pointer-events-none" />
  );
}
