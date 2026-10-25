// A conceptual illustration only; the paths are not experimental observations.
(() => {
  const initialize = () => {
    document.querySelectorAll("[data-dynamics-sketch]").forEach((sketch) => {
      if (sketch.dataset.dynamicsReady === "true") return;
      const slider = sketch.querySelector("[data-trajectory-progress]");
      const replay = sketch.querySelector("[data-trajectory-replay]");
      const output = sketch.querySelector("[data-trajectory-value]");
      const paths = Array.from(sketch.querySelectorAll("[data-trajectory]"), (path) =>
        path.dataset.trajectory.split(",").map(Number)
      );
      const dots = Array.from(sketch.querySelectorAll("[data-trajectory-dot]"));
      if (!slider || !replay || !output || paths.length !== dots.length) return;
      sketch.dataset.dynamicsReady = "true";

      let frame = null;
      const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const stop = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
      };
      const render = (progress) => {
        const t = Math.min(1, Math.max(0, progress));
        const u = 1 - t;
        dots.forEach((dot, index) => {
          const p = paths[index];
          const x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6];
          const y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
          dot.setAttribute("cx", x.toFixed(3));
          dot.setAttribute("cy", y.toFixed(3));
        });
        const percent = Math.round(t * 100);
        slider.value = String(percent);
        slider.setAttribute("aria-valuetext", `${percent} percent along the illustration`);
        output.textContent = `${percent}%`;
      };

      slider.addEventListener("input", () => {
        stop();
        render(Number(slider.value) / 100);
      });
      replay.addEventListener("click", () => {
        stop();
        if (motionPreference.matches) {
          render(1);
          return;
        }
        render(0);
        let started = null;
        const step = (timestamp) => {
          if (started === null) started = timestamp;
          const progress = Math.min(1, (timestamp - started) / 4000);
          render(progress);
          frame = progress < 1 ? requestAnimationFrame(step) : null;
        };
        frame = requestAnimationFrame(step);
      });
      motionPreference.addEventListener("change", () => {
        if (motionPreference.matches && frame !== null) {
          stop();
          render(1);
        }
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
      });
      render(Number(slider.value) / 100);
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
