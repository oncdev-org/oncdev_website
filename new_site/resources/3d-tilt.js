/* 3D Button Tilt Rotation Script */
document.addEventListener('DOMContentLoaded', () => {
  const tiltElements = document.querySelectorAll('.btn-kltzqu, .cmd-trigger, .nav-tab, .button, button.primary, button.secondary');

  tiltElements.forEach(el => {
    el.style.perspective = '800px';
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease-out, background-color 0.25s ease, border-color 0.25s ease';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = -((y - centerY) / centerY) * 14;
      const rotateY = ((x - centerX) / centerX) * 14;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
});
