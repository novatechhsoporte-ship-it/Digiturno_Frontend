import { useAbility } from "@hooks/";
import { useTicketList } from "./useTicketList";
import { useTicketFilters } from "./useTicketFilters";
import { useCreateTicket } from "./useCreateTicket";
import { useEditCustomer } from "./useEditCustomer";
import { useTicketTable } from "./useTicketTable";

/**
 * Main orchestrator hook for Tickets feature
 * Acts as a barrel export that combines all sub-hooks
 */
export const useTickets = () => {
  const { canAny } = useAbility();

  // Filters hook
  const filters = useTicketFilters();
  const { selectedTenant, selectedModule, tenantOptions, moduleOptions, moduleFilterOptions, isSuperAdmin } = filters;

  const ticketList = useTicketList(selectedTenant);
  const { pendingTickets, loading: listLoading, loadPendingTickets } = ticketList;

  // Edit customer hook
  const editCustomer = useEditCustomer(loadPendingTickets);
  const { handleEditCustomer } = editCustomer;

  // Ticket table hook
  const ticketTable = useTicketTable(selectedModule, loadPendingTickets, handleEditCustomer);
  const { ticketColumns, ticketActions, callTicket, startTicket, completeTicket } = ticketTable;

  // Permissions
  const canCreate = canAny(["tickets.manage", "tickets.create"]);

  // Create ticket hook
  const createTicket = useCreateTicket(selectedTenant, canCreate);

  return {
    // State from filters
    ...filters,
    // State from ticket list
    pendingTickets,
    loading: listLoading || createTicket.loading || editCustomer.loading,
    // State from create ticket
    showCreateModal: createTicket.showCreateModal,
    showCreateButton: createTicket.showCreateButton,
    // State from edit customer
    showEditModal: editCustomer.showEditModal,
    editingCustomer: editCustomer.editingCustomer,
    // Forms
    register: createTicket.register,
    handleSubmit: createTicket.handleSubmit,
    errors: createTicket.errors,
    isSubmitting: createTicket.isSubmitting,
    isDisabled: createTicket.isDisabled,
    registerCustomer: editCustomer.registerCustomer,
    handleSubmitCustomer: editCustomer.handleSubmitCustomer,
    errorsCustomer: editCustomer.errorsCustomer,
    isSubmittingCustomer: editCustomer.isSubmitting,
    isDisabledCustomer: editCustomer.isDisabled,
    // Methods
    onCreateTicket: createTicket.onCreateTicket,
    onUpdateCustomer: editCustomer.onUpdateCustomer,
    handleShowCreateModal: createTicket.handleShowCreateModal,
    handleCloseCreateModal: createTicket.handleCloseCreateModal,
    handleCloseEditModal: editCustomer.handleCloseEditModal,
    // Table actions (from useTicketTable)
    callTicket,
    startTicket,
    completeTicket,
    // Table
    ticketColumns,
    ticketActions,
    // Options
    tenantOptions,
    moduleOptions,
    moduleFilterOptions,
  };
};
