// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
const router = useRouter();

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("equip");
  const [mode, setMode] = useState<string>("");

  useEffect(() => {
    const savedMode = localStorage.getItem("cyclingMode");
    if (!savedMode) {
      router.push("/choose-team");
    } else {
      setMode(savedMode);
    }
  }, [router]);

  const renderContent = () => {
    switch (selectedSection) {
      case "equip":
        return <div>🚴 El teu equip ({mode})</div>;
      case "mercat":
        return <div>🛒 Mercat de corredors (compra/venda)</div>;
      case "km":
        return <div>📊 Resum de km, desnivell i punts</div>;
      case "amics":
        return <div>👥 Llista d’amics i classificació</div>;
      case "perfil":
        return <div>⚙️ Configura el teu perfil i idioma</div>;
      default:
        return <div>Selecciona una secció</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelectedSection} />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">SGDride Dashboard</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
