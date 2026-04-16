import { useState } from "react";
import api from "../services/api";
import type { IUser } from "../../../api/src/core/interfaces/IUser";

export const CustomerSearch = ({
  onSelect,
}: {
  onSelect: (customer: IUser) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      const { data } = await api.get(`/users/search?q=${val}`);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar cliente por nombre, email o DNI..."
        className="w-full p-2 border rounded"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1">
          {results.map((c: IUser) => (
            <li
              key={c.id}
              className="p-2 hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                onSelect(c);
                setResults([]);
                setQuery(c.fullName);
              }}
            >
              {c.fullName} -{" "}
              <span className="text-sm text-gray-500">{c.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
