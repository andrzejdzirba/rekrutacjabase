import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTicketsStore } from '../stores/tickets'
import type { Ticket } from '../types/ticket'

describe('Tickets Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('powinien poprawnie obliczać totalPages', () => {
    const store = useTicketsStore()
    store.totalItems = 25
    store.itemsPerPage = 10
    expect(store.totalPages).toBe(3)
  })

  it('powinien filtrować dane w trybie mockMode', async () => {
    const store = useTicketsStore()

    store.mockTickets = [
      { id: 1, status: 'new', subject: 'A' } as Ticket,
      { id: 2, status: 'closed', subject: 'B' } as Ticket,
    ]

    store.statusFilter = 'new'
    await store.fetchTickets()

    expect(store.tickets).toHaveLength(1)
    expect(store.tickets[0]?.status).toBe('new')
  })
})
