import { auth } from './uk/auth';
import { organization } from './uk/organization';
import { common } from './uk/common';
import { sidebar } from './uk/sidebar';
import { menu } from './uk/menu';

export const uk = {
  auth,
  organization,
  sidebar,
  menu,
  ...common
};