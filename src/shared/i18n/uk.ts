import { auth } from './uk/auth';
import { organization } from './uk/organization';
import { sidebar } from './uk/sidebar';
import { menu } from './uk/menu';
import { qr } from './uk/qr';
import { staff } from './uk/staff';
import { marketplace } from './uk/marketplace';
import { pos } from './uk/pos';
import { inventory } from './uk/inventory';
import { common } from './uk/common';
import { analytics } from './uk/analytics';
import { liveCalls } from './uk/live-calls';

export const uk = {
  auth,
  organization,
  sidebar,
  menu,
  qr,
  staff,
  marketplace,
  pos,
  inventory,
  ...common,
  analytics,
  liveCalls
};