export const formatCurrency = (amount: number, t: (key: string) => string): string => {
  return `${amount} ${t('menu.currency')}`;
};