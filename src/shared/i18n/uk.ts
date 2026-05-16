import { auth } from './uk/auth';
import { organization } from './uk/organization';
import { common } from './uk/common';

export const uk = {
  auth,
  organization,
  ...common
};