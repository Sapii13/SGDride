// pages/mercat.tsx
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const riders = {
  DH: [
    { name: "Loïc Bruni", price: 1200 },
    { name: "Jackson Goldstone", price: 1100 },
    { name: "Amaury Pierron", price: 1050 },
  ],
  XC: [
    { name: "Nino Schurter", price: 1300 },
    { name: "Tom Pidcock", price: 1250 },
    { name: "Mathieu van der Poel", price: 1280 },
  ],
  Gravel: [
    { name: "Lachlan Morton", price: 1000 },
    { name: "Keegan Swenson", price: 950 },
  ],
  Road: [
    { name: "Tadej Pogačar", price: 1500 },
    { name: "Jonas Vingegaard", price: 1450 },
  ],
  Enduro: [
    { name: "Sam Hill", price: 980 },
    { name: "Richie Rude", price: 1020 },
  ],
};

export default function Mercat() {
  const { user } = useContext(UserContext);
  const team = user?.team || "DH";

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mercat de ciclistes ({team})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riders[team]?.map((rider, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{rider.name}</h2>
            <p>Preu: {rider.price} monedes</p>
            <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
