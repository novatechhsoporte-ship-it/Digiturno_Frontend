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
  const { selectedTenant, tenantOptions, moduleFilterOptions } = filters;

  const ticketList = useTicketList(selectedTenant);
  const { pendingTickets, loading: listLoading, loadPendingTickets } = ticketList;

  // Edit customer hook
  const editCustomer = useEditCustomer(loadPendingTickets);
  const { handleEditCustomer } = editCustomer;

  // Ticket table hook
  const ticketTable = useTicketTable(handleEditCustomer);
  const { ticketColumns, ticketActions } = ticketTable;

  // Permissions
  const canCreate = canAny(["tickets.manage", "tickets.create"]);

  // Create ticket hook
  const createTicket = useCreateTicket(selectedTenant, canCreate);

  return {
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
    onSubmitCreate: createTicket.onSubmit,
    errors: createTicket.errors,
    isSubmitting: createTicket.isSubmitting,
    isDisabled: createTicket.isDisabled,
    servicesMap: createTicket.servicesMap,
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
    // Table
    ticketColumns,
    ticketActions,
    // Options
    tenantOptions,
    moduleFilterOptions,
  };
};
