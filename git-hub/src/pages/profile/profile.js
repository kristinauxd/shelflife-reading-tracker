import './profile.css';
import template from './profile.html?raw';

import { getUser } from '../../state/auth.js';
import { fillTemplate } from '../../utils/template.js';

export function render() {
  const user = getUser() ?? { name: 'Reader', role: 'member', initials: 'R' };

  return fillTemplate(template, {
    name: user.name,
    role: user.role,
    initials: user.initials,
  });
}

export function init() {}