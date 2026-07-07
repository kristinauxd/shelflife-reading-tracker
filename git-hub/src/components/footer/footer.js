import './footer.css';
import template from './footer.html?raw';

import { fillTemplate } from '../../utils/template.js';

export function renderFooter() {
  return fillTemplate(template, {
    year: new Date().getFullYear(),
  });
}