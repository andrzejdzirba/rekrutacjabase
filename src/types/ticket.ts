export type TicketStatus = 'new' | 'in_progress' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high'

export const STATUS_LABELS: Record<TicketStatus | 'all', string> = {
  all: 'Wszystkie',
  new: 'Nowe',
  in_progress: 'W trakcie',
  closed: 'Zamknięte',
}

export interface Ticket {
  id: number
  customerName: string
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
}
