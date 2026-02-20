export type IconName = 'callcenter' | 'ticket' | 'dashboard' | 'settings' | 'menu' | 'close'

export interface MenuItem {
  to: string
  label: string
  icon: IconName
}
