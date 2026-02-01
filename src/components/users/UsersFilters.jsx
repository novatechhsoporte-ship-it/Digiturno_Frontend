import { FILTER_FIELDS } from "@schemas/Users";
import { CustomInput, CustomSelect } from "@components/common";

export const UsersFilters = ({ filters, optionsMap, handleFilterChange }) => {
  const renderFilter = (field) => {
    if (field.type === "select") {
      return (
        <CustomSelect
          key={field.name}
          label={field.label}
          value={filters[field.name]}
          onChange={(e) => handleFilterChange(field.name, e.target.value)}
          options={optionsMap[field.optionsKey] || []}
        />
      );
    }

    return (
      <CustomInput
        key={field.name}
        label={field.label}
        placeholder={field.placeholder}
        icon={field.icon}
        value={filters[field.name]}
        onChange={(e) => handleFilterChange(field.name, e.target.value)}
        className={field.className}
      />
    );
  };

  return <div className="users__filters">{FILTER_FIELDS.map(renderFilter)}</div>;
};
