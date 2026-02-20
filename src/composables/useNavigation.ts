import type { MenuItem } from '@/types/navigation'

export function useNavigation() {
  const menuItems: MenuItem[] = [
    {
      to: '/',
      label: 'Zgłoszenia',
      icon: 'ticket',
    },
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      to: '/settings',
      label: 'Ustawienia',
      icon: 'settings',
    },
  ]

  return { menuItems }
}
