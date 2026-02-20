import { defineStore } from 'pinia'
import type { Ticket, TicketStatus } from '@/types/ticket'

const API_DELAY = Number(import.meta.env.VITE_API_DELAY) || 800
const delay = (ms: number = API_DELAY) => new Promise((resolve) => setTimeout(resolve, ms))

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [] as Ticket[], // Dane do wyświetlenia w aktualnym widoku (po filtrach/paginacji)
    mockTickets: null as Ticket[] | null, // Lokalna "baza danych" zainicjowana jako null - wykorzystana tylko w trybie testowania danych mock
    error: null as string | null,
    totalItems: 0,
    currentPage: 1,
    statusFilter: 'all' as TicketStatus | 'all',
    itemsPerPage: 10,
    isLoadingTicketsList: false,
    isLoadingTicket: false,
    isUpdatingTicket: false,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.totalItems / state.itemsPerPage),
    isMockMode: () => import.meta.env.VITE_API_MODE !== 'production',
    apiBaseUrl: () => import.meta.env.VITE_API_URL || '/public',
    ticketById: (state) => (id: number) => {
      const source = state.mockTickets || state.tickets
      return source.find((t) => t.id === id) || null
    },
    isLoading: (state) =>
      state.isLoadingTicketsList || state.isLoadingTicket || state.isUpdatingTicket,
  },

  actions: {
    async fetchTickets() {
      if (this.isLoadingTicketsList) {
        console.warn('fetchTickets already in progress')
        return
      }

      this.isLoadingTicketsList = true

      this.error = null

      try {
        if (this.isMockMode) {
          // Symulujemy opóźnienie tylko w trybie Mock
          await delay()

          // Pobieramy z JSONa TYLKO RAZ (gdy mockTickets jest null)
          if (this.mockTickets === null) {
            const response = await fetch(`${this.apiBaseUrl}/tickets.json`)
            if (!response.ok) {
              throw new Error(`Nie udało się pobrać danych: ${response.status}`)
            }
            this.mockTickets = await response.json()
          }

          const filtered =
            this.statusFilter === 'all'
              ? this.mockTickets!
              : this.mockTickets!.filter((t) => t.status === this.statusFilter)

          // Paginacja
          this.totalItems = filtered.length
          const start = (this.currentPage - 1) * this.itemsPerPage
          this.tickets = filtered.slice(start, start + this.itemsPerPage)
        } else {
          // --- TRYB PRODUKCYJNY (Prawdziwe API) ---
          const params = new URLSearchParams({
            page: this.currentPage.toString(),
            status: this.statusFilter,
            perPage: this.itemsPerPage.toString(),
          })

          const response = await fetch(`${this.apiBaseUrl}/tickets?${params}`)
          if (!response.ok) {
            throw new Error(`Błąd serwera: ${response.status}`)
          }

          const result = await response.json()
          this.tickets = result.data
          this.totalItems = result.total
        }
      } catch (err: any) {
        this.error = err.message
        console.error('Store Error:', err)
      } finally {
        this.isLoadingTicketsList = false
      }
    },

    async fetchTicketById(id: number): Promise<Ticket | null> {
      if (!id || isNaN(id)) return null

      if (this.isLoadingTicket) {
        console.warn('fetchTicket already in progress')
        return null
      }

      this.isLoadingTicket = true

      this.error = null

      try {
        if (this.isMockMode) {
          // Symulacja

          await delay()

          if (this.mockTickets === null) {
            await this.fetchTickets()
          }
          return this.mockTickets!.find((t) => t.id === id) || null
        }

        // Produkcja
        const response = await fetch(`${this.apiBaseUrl}/tickets/${id}`)
        if (!response.ok) return null
        return await response.json()
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.isLoadingTicket = false
      }
    },

    async updateTicketStatus(id: number, newStatus: TicketStatus) {
      if (this.isUpdatingTicket) {
        console.warn('fetchTicket already in progress')
        return
      }

      if (!id || id <= 0) throw new Error('Invalid ID')

      this.isUpdatingTicket = true

      try {
        if (this.isMockMode) {
          // Symulacja
          await delay()

          if (this.mockTickets === null) {
            await this.fetchTickets()
          }

          const ticket = this.mockTickets!.find((t) => t.id === id)

          if (ticket) {
            ticket.status = newStatus
          }
        } else {
          // Produkcyja
          const response = await fetch(`${this.apiBaseUrl}/tickets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
            headers: { 'Content-Type': 'application/json' },
          })
          if (!response.ok) throw new Error('Nie udało się zaktualizować statusu w API')
        }
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.isUpdatingTicket = false
      }
    },

    setFilter(status: TicketStatus | 'all') {
      this.statusFilter = status
      this.currentPage = 1
      this.fetchTickets()
    },

    setPage(page: number) {
      this.currentPage = page
      this.fetchTickets()
    },

    clearError() {
      this.error = null
    },
  },
})
