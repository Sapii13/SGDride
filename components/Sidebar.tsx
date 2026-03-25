// components/Sidebar.tsx
import React from "react";

interface SidebarProps {
  onSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const sections = [
    { id: "equip", label: "Equip" },
    { id: "mercat", label: "Mercat" },
    { id: "km", label: "Quilòmetres" },
    { id: "amics", label: "Amics" },
    { id: "perfil", label: "Perfil" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">Menú</h2>
      <ul className="space-y-2">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => onSelect(id)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
