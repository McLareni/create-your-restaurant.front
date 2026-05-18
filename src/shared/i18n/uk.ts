import { auth } from './uk/auth';
import { organization } from './uk/organization';
import { common } from './uk/common';
import { sidebar } from './uk/sidebar';
import { menu } from './uk/menu';
import { qr } from './uk/qr';
import { staff } from './uk/staff';
import { marketplace } from './uk/marketplace';

export const uk = {
  auth,
  organization,
  sidebar,
  menu,
  qr,
  staff,
  marketplace,
  ...common
};