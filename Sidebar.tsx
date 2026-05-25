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
    <aside style={{ width: '250px', backgroundColor: 'white', padding: '15px', borderRight: '1px solid #e0e0e0' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Menú</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map(({ id, label }) => (
          <li key={id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => onSelect(id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
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
