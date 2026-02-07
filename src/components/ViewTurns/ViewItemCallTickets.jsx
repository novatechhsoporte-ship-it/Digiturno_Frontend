const capitalizeWords = (text = "") => text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const ViewItemCallTickets = ({ title, tickets = [], description }) => {
  return (
    <div className="views-turn__panel">
      <div className="views-turn__panel-title">{capitalizeWords(title)}</div>

      <div className="views-turn__called">
        {tickets.length > 0 ? (
          tickets.map((ticket) => {
            const ticketNumber = ticket?.ticketNumber ?? "N/A";
            const moduleName = ticket?.moduleId?.name;

            return (
              <div key={ticket._id} className="views-turn__called-item">
                <div className="views-turn__called-number">{capitalizeWords(ticketNumber)}</div>
                <div className="views-turn__called-module">{capitalizeWords(moduleName)}</div>
              </div>
            );
          })
        ) : (
          <div className="views-turn__called-empty">{capitalizeWords(description)}</div>
        )}
      </div>
    </div>
  );
};
