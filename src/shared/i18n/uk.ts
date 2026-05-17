import { auth } from './uk/auth';
import { organization } from './uk/organization';
import { common } from './uk/common';
import { sidebar } from './uk/sidebar';

export const uk = {
  auth,
  organization,
  sidebar,
  ...common
};