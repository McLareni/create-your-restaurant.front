import { useTranslation } from '@/shared/hooks/useTranslation';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, BarChart3, BellRing, UtensilsCrossed, 
  QrCode, Users, ArrowRightLeft, FileClock, MessageSquareQuote, 
  Blocks, Palette, CreditCard, Moon, Sun, HelpCircle, ShieldAlert
} from 'lucide-react';

export type SubMenuItem = {
  id: string;
  href: string;
  label: string;
  moduleKey?: string;
};

export type MenuItem = {
  id: string;
  href?: string;
  icon: React.ElementType;
  label: string;
  moduleKey?: string;
  highlight?: boolean;
  subItems?: SubMenuItem[];
  onClick?: () => void; // Додаємо можливість вішати функції на кнопки
};

export const useNavigation = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  const menuGroups: MenuItem[][] = [
    [
      { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: t('sidebar.nav.dashboard') },
      { id: 'analytics', href: '/dashboard/analytics', icon: BarChart3, label: t('sidebar.nav.analytics'), moduleKey: 'analytics' },
    ],
    [
      { id: 'live-calls', href: '/dashboard/live', icon: BellRing, label: t('sidebar.nav.liveCalls'), moduleKey: 'live-calls' },
      { 
        id: 'menu', 
        icon: UtensilsCrossed, 
        label: t('sidebar.nav.menu'), 
        moduleKey: 'menu-engine',
        subItems: [
          { id: 'menu-constructor', href: '/dashboard/menu-builder', label: t('sidebar.nav.menuConstructor') },
          { id: 'menu-inventory', href: '/dashboard/menu-inventory', label: t('sidebar.nav.menuInventory') },
          { id: 'menu-prices', href: '/dashboard/menu-prices', label: t('sidebar.nav.menuPrices') },
        ]
      },
      { id: 'qr', href: '/dashboard/qr', icon: QrCode, label: t('sidebar.nav.qrTables'), moduleKey: 'qr-tables' },
      { id: 'staff', href: '/dashboard/staff', icon: Users, label: t('sidebar.nav.staff'), moduleKey: 'staff' },
      { id: 'pos', href: '/dashboard/pos', icon: ArrowRightLeft, label: t('sidebar.nav.posSync'), moduleKey: 'pos-sync', highlight: true },
      { id: 'audit', href: '/dashboard/audit', icon: FileClock, label: t('sidebar.nav.auditLogs') },
      { id: 'feedback', href: '/dashboard/feedback', icon: MessageSquareQuote, label: t('sidebar.nav.feedback'), moduleKey: 'feedback', highlight: true },
    ],
    [
      { id: 'marketplace', href: '/dashboard/marketplace', icon: Blocks, label: t('sidebar.nav.marketplace') },
      { id: 'visual', href: '/dashboard/visual', icon: Palette, label: t('sidebar.nav.visual'), moduleKey: 'visual' },
      { id: 'billing', href: '/dashboard/billing', icon: CreditCard, label: t('sidebar.nav.billing') },
    ],
    [
      { 
    id: 'theme', 
    icon: isDark ? Sun : Moon, 
    label: isDark ? t('sidebar.nav.themeLight') : t('sidebar.nav.themeDark'), 
    onClick: toggleTheme 
    },
      { id: 'support', href: '/dashboard/support', icon: HelpCircle, label: t('sidebar.nav.support') },
      { id: 'legal', href: '/dashboard/legal', icon: ShieldAlert, label: t('sidebar.nav.legal') },
    ]
  ];

  return { menuGroups };
};