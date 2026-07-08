import './home.css';
import template from './home.html?raw';

export function render() {
  return template;
}

export function init() {
  const revealTargets = document.querySelectorAll('[data-scroll-reveal], [data-reveal-item]');

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}