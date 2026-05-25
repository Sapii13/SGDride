import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "./styles.css";

const ciclistesPerDisciplina = {
  Road: ["Tadej Pogačar", "Jonas Vingegaard", "Remco Evenepoel", "Primož Roglič", "Wout van Aert", "Mikel Landa"],
  DH: ["Loïc Bruni", "Amaury Pierron", "Loris Vergier", "Danny Hart", "Troy Brosnan"],
  Enduro: ["Jesse Melamed", "Richie Rude", "Sam Hill", "Jack Moir", "Martin Maes"],
  XC: ["Nino Schurter", "Tom Pidcock", "Mathias Flückiger", "Victor Koretzky"],
  Gravel: ["Keegan Swenson", "Lachlan Morton", "Ian Boswell", "Peter Stetina"]
};

const avatar = (name) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

const Menu = ({ onSelect }) => (
  <nav className="menu">
    <button onClick={() => onSelect("mercat")}>Mercat</button>
    <button onClick={() => onSelect("equip")}>El meu Equip</button>
    <button onClick={() => onSelect("rutes")}>Rutes</button>
    <button onClick={() => onSelect("estadistiques")}>Estadístiques</button>
    <button onClick={() => onSelect("ranking")}>Ranking</button>
    <button onClick={() => onSelect("perfil")}>Perfil</button>
  </nav>
);

const Mercat = ({ disciplina, punts, comprar }) => {
  const llista = ciclistesPerDisciplina[disciplina] || [];
  return (
    <div>
      <h2>Mercat · {disciplina}</h2>
      <p><strong>Punts disponibles:</strong> {punts}</p>
      <div className="grid">
        {llista.map((nom, i) => {
          const preu = 500 - (i * 50);
          const bonus = (1 + (llista.length - i) * 0.1).toFixed(2);
          return (
            <div className="card" key={i}>
              <img src={avatar(nom)} width="70" alt="avatar" />
              <h3>{nom}</h3>
              <p>Bonus x{bonus}</p>
              <p>Preu: {preu} pts</p>
              <button disabled={punts < preu} onClick={() => comprar({ nom, bonus, preu })}>Fitxar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Equip = ({ ciclistes }) => (
  <div>
    <h2>El teu equip</h2>
    {ciclistes.length === 0 && <p>No tens cap ciclista. Ves al Mercat per fitxar-ne!</p>}
    <div className="grid">
      {ciclistes.map((c, i) => (
        <div key={i} className="card">
          <img src={avatar(c.nom)} width="70" alt="avatar" />
          <h3>{c.nom}</h3>
          <p>Bonus x{c.bonus}</p>
        </div>
      ))}
    </div>
  </div>
);

const Rutes = ({ afegirRuta }) => (
  <div>
    <h2>Sincronització de Rutes</h2>
    <p>Simula un entrenament o connecta el teu compte d'Strava per sumar punts mitjançant els teus quilòmetres reals.</p>
    <button onClick={() => afegirRuta(Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 1000))} style={{padding: '12px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
      Simular Ruta Aleatòria
    </button>
  </div>
);

const Estadistiques = ({ punts, rutes, nivell }) => (
  <div>
    <h2>Estadístiques de Manager</h2>
    <p><strong>Nivell d'Equip:</strong> {nivell}</p>
    <p><strong>Punts actuals:</strong> {punts}</p>
    <p><strong>Total de rutes completades:</strong> {rutes.length}</p>
  </div>
);

const Ranking = ({ punts }) => (
  <div>
    <h2>Ranking Global SGride</h2>
    <div className="card" style={{backgroundColor: '#e8f8f5', fontWeight: 'bold', marginBottom: '15px'}}>Tu: {punts} punts</div>
    <div style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>1. ProCyclist · 15000 pts</div>
    <div style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>2. StravaGod · 12000 pts</div>
  </div>
);

const Perfil = ({ user, equip, setEquip, stravaConnectat }) => (
  <div>
    <h2>Perfil de Manager</h2>
    <p>Usuari actiu: <strong>{user.displayName || "Corredor"}</strong></p>
    <div style={{margin: '15px 0'}}>
      <label style={{display: 'block', marginBottom: '5px'}}><strong>Canviar disciplina principal:</strong></label>
      <select value={equip} onChange={(e) => setEquip(e.target.value)}>
        {Object.keys(ciclistesPerDisciplina).map((d) => <option key={d}>{d}</option>)}
      </select>
    </div>
    <br />
    <button onClick={() => { window.location.href = `https://www.strava.com/oauth/authorize?client_id=199178&redirect_uri=${window.location.origin}&response_type=code&scope=activity:read_all`; }} style={{backgroundColor: '#fc4c02', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
      {stravaConnectat ? "Strava Connectat 🚴" : "Connectar amb Strava"}
    </button>
    <br /><br /><br />
    <button onClick={() => signOut(auth)} style={{backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}}>Tancar sessió</button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equip, setEquip] = useState("");
  const [pantalla, setPantalla] = useState("mercat");
  const [punts, setPunts] = useState(1000);
  const [ciclistes, setCiclistes] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [stravaConnectat, setStravaConnectat] = useState(false);

  const nivell = Math.floor(punts / 1500) + 1;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) { 
      setStravaConnectat(true); 
      window.history.replaceState({}, document.title, "/"); 
    }
  }, []);

  const comprar = (c) => { 
    if (punts >= c.preu) {
      setPunts(punts - c.preu); 
      setCiclistes([...ciclistes, c]); 
    }
  };
  
  const afegirRuta = (km, desnivell) => {
    const mult = ciclistes.reduce((acc, curr) => acc + Number(curr.bonus), 1);
    const pts = Math.floor((km * 10 + desnivell * 0.5) * mult);
    setPunts(punts + pts);
    setRutes([...rutes, { km, desnivell, punts: pts }]);
  };

  if (loading) return <div className="app" style={{textAlign: 'center', marginTop: '50px'}}><h2>Carregant dades de SGride...</h2></div>;

  if (!user) return (
    <div className="app" style={{textAlign: 'center', marginTop: '50px'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '5px'}}>SGride 🚴</h1>
      <p style={{fontSize: '1.2rem', color: '#555', fontStyle: 'italic', margin: '0 auto 25px auto', maxWidth: '500px', lineHeight: '1.4'}}>
        Cada quilòmetre compta, cada fitxatge suma. El joc real de les dues rodes.
      </p>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding: '14px 28px', fontSize: '16px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
        Entrar amb Google
      </button>
    </div>
  );

  if (!equip) return (
    <div className="app" style={{textAlign: 'center'}}>
      <h2>Escull Disciplina Principal</h2>
      <p style={{color: '#666'}}>Per començar a competir al mercat, selecciona quin tipus de ciclista vols gestionar:</p>
      <select onChange={(e) => setEquip(e.target.value)} defaultValue="">
        <option value="" disabled>Selecciona una disciplina...</option>
        {Object.keys(ciclistesPerDisciplina).map((d) => <option key={d}>{d}</option>)}
      </select>
    </div>
  );

  const vistes = {
    mercat: <Mercat disciplina={equip} punts={punts} comprar={comprar} />,
    equip: <Equip ciclistes={ciclistes} />,
    rutes: <Rutes afegirRuta={afegirRuta} />,
    estadistiques: <Estadistiques punts={punts} rutes={rutes} nivell={nivell} />,
    ranking: <Ranking punts={punts} />,
    perfil: <Perfil user={user} equip={equip} setEquip={setEquip} stravaConnectat={stravaConnectat} />
  };

  return (
    <div className="app">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{margin: '0'}}>SGride 🚴</h1>
        <div style={{fontSize: '1.1rem'}}><strong>Nivell {nivell}</strong> | <span style={{color: '#27ae60', fontWeight: 'bold'}}>{punts} pts</span></div>
      </div>
      <hr style={{border: '0', height: '1px', background: '#eee', margin: '15px 0'}} />
      <Menu onSelect={setPantalla} />
      <hr style={{border: '0', height: '1px', background: '#eee', margin: '20px 0'}} />
      {vistes[pantalla]}
    </div>
  );
}
