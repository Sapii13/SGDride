import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "./styles.css";

/* ---------------- MENU ---------------- */
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

/* ---------------- CICLISTES ---------------- */
const ciclistesPerDisciplina = {
  Road: [
    "Tadej Pogačar", "Jonas Vingegaard", "Remco Evenepoel", "Primož Roglič",
    "Wout van Aert", "Mathieu van der Poel", "João Almeida", "Mikel Landa",
    "Carlos Rodríguez", "Sepp Kuss", "Egan Bernal", "Geraint Thomas"
  ],
  DH: [
    "Loïc Bruni", "Amaury Pierron", "Loris Vergier", "Danny Hart",
    "Troy Brosnan", "Finn Iles", "Aaron Gwin", "Greg Minnaar"
  ],
  Enduro: [
    "Jesse Melamed", "Richie Rude", "Sam Hill", "Jack Moir",
    "Martin Maes", "Alex Rudeau", "Adrien Dailly"
  ],
  XC: [
    "Nino Schurter", "Tom Pidcock", "Mathias Flückiger", "Victor Koretzky",
    "Jordan Sarrou", "Vlad Dascalu", "David Valero"
  ],
  Gravel: [
    "Keegan Swenson", "Lachlan Morton", "Ian Boswell", "Peter Stetina",
    "Laurens ten Dam", "Ted King", "Alexey Vermeulen"
  ],
};

const avatar = (name) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

/* ---------------- MERCAT ---------------- */
const Mercat = ({ disciplina, punts, comprar }) => {
  const llistaNoms = ciclistesPerDisciplina[disciplina] || [];
  
  const ciclistes = llistaNoms.map((nom, i) => {
    const nivell = llistaNoms.length - i;
    return {
      nom,
      bonus: (1 + nivell * 0.05).toFixed(2),
      preu: 200 + nivell * 50,
    };
  });

  return (
    <div>
      <h2>Mercat · {disciplina}</h2>
      <p><strong>Els teus Punts:</strong> {punts}</p>

      <div className="grid">
        {ciclistes.map((c, i) => (
          <div className="card" key={i}>
            <img src={avatar(c.nom)} alt={c.nom} width="70" />
            <h3>{c.nom}</h3>
            <p>Bonus x{c.bonus}</p>
            <p>Preu: {c.preu} pts</p>
            <button disabled={punts < c.preu} onClick={() => comprar(c)}>
              Fitxar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- EQUIP ---------------- */
const Equip = ({ ciclistes }) => (
  <div>
    <h2>El teu equip</h2>
    {ciclistes.length === 0 && <p>No tens ciclistes encara. Ves al Mercat a fitxar!</p>}
    <div className="grid">
      {ciclistes.map((c, i) => (
        <div key={i} className="card">
          <img src={avatar(c.nom)} alt={c.nom} width="70" />
          <h3>{c.nom}</h3>
          <p>Bonus x{c.bonus}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------- RUTES ---------------- */
const Rutes = ({ afegirRuta }) => {
  const simularRuta = () => {
    const km = Math.floor(Math.random() * 80) + 10;
    const desnivell = Math.floor(Math.random() * 1500);
    afegirRuta(km, desnivell);
  };

  return (
    <div>
      <h2>Rutes i Entrenaments</h2>
      <p>Quan connectis la API d'Strava es carregaran de forma automàtica.</p>
      <button style={{padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}} onClick={simularRuta}>
        Simular Ruta Aleatòria
      </button>
    </div>
  );
};

/* ---------------- ESTADISTIQUES ---------------- */
const Estadistiques = ({ punts, rutes, nivell }) => {
  const km = rutes.reduce((a, b) => a + b.km, 0);
  const desnivell = rutes.reduce((a, b) => a + b.desnivell, 0);

  return (
    <div>
      <h2>Estadístiques Generals</h2>
      <p><strong>Nivell de Manager:</strong> {nivell}</p>
      <p><strong>Punts totals:</strong> {punts}</p>
      <p><strong>Total quilòmetres:</strong> {km} km</p>
      <p><strong>Total desnivell acumulat:</strong> {desnivell} m</p>

      <h3>Historial de Rutes</h3>
      {rutes.length === 0 && <p>Encara no has fet cap ruta.</p>}
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {rutes.map((r, i) => (
          <div key={i} style={{background: '#f1f1f1', padding: '10px', borderRadius: '6px'}}>
            Ruta {i+1}: <strong>{r.km} km</strong> · {r.desnivell} m de desnivell ➔ <strong>+{r.punts} punts</strong> guanyats.
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- RANKING ---------------- */
const Ranking = ({ punts }) => {
  const players = [
    { nom: "ProCyclist", punts: 12000 },
    { nom: "MTBKing", punts: 9000 },
    { nom: "StravaGod", punts: 8000 },
    { nom: "XCMonster", punts: 6000 },
  ];

  return (
    <div>
      <h2>Ranking Mundial SG Raid</h2>
      <div className="card" style={{backgroundColor: '#e8f8f5', marginBottom: '15px', fontWeight: 'bold'}}>
        Tu: {punts} punts
      </div>
      {players.map((p, i) => (
        <div key={i} style={{padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
          <span>{i+1}. {p.nom}</span>
          <strong>{p.punts} pts</strong>
        </div>
      ))}
    </div>
  );
};

/* ---------------- PERFIL ---------------- */
const Perfil = ({ user, equip, setEquip, stravaConnectat }) => {
  const connectaStrava = () => {
    const clientId = "199178"; 
    const redirectUri = window.location.origin;
    const scope = "activity:read_all";
    const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <div>
      <h2>Perfil d'Usuari</h2>
      {user.photoURL && <img src={user.photoURL} alt="Avatar" width="80" style={{borderRadius: '50%'}} />}
      <p>Benvingut, <strong>{user.displayName || "Corredor"}</strong></p>

      <div style={{margin: '20px 0'}}>
        <label style={{display: 'block', marginBottom: '5px'}}><strong>Disciplina activa:</strong></label>
        <select value={equip} onChange={(e) => setEquip(e.target.value)}>
          {Object.keys(ciclistesPerDisciplina).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {!stravaConnectat ? (
        <button onClick={connectaStrava} style={{backgroundColor: '#fc4c02', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
          Connectar amb Strava
        </button>
      ) : (
        <p style={{color: '#fc4c02', fontWeight: 'bold'}}>Sincronitzat amb Strava 🚴 S'estan important les rutes...</p>
      )}

      <br /><br />
      <button onClick={() => signOut(auth)} style={{backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>
        Tancar sessió
      </button>
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */
export default function App() {
  const [user, setUser] = useState(null);
  const [equip, setEquip] = useState("");
  const [pantalla, setPantalla] = useState("mercat");
  const [punts, setPunts] = useState(1000);
  const [ciclistes, setCiclistes] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [stravaConnectat, setStravaConnectat] = useState(false);

  const nivell = Math.floor(punts / 1500) + 1;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setStravaConnectat(true);
      localStorage.setItem("strava", "true");
      window.history.replaceState({}, document.title, "/");
    }

    if (localStorage.getItem("strava") === "true") {
      setStravaConnectat(true);
    }
  }, []);

  const iniciarSessio = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error a l'iniciar sessió: ", error);
    }
  };

  const comprar = (c) => {
    if (punts >= c.preu) {
      setPunts(punts - c.preu);
      setCiclistes([...ciclistes, c]);
    }
  };

  const afegirRuta = (km, desnivell) => {
    const bonusEquip = ciclistes.reduce((total, ciclista) => total + Number(ciclista.bonus), 1);
    const puntsGuanyats = Math.floor((km * 10 + desnivell * 0.4) * bonusEquip);

    setPunts(punts + puntsGuanyats);
    setRutes([...rutes, { km, desnivell, punts: puntsGuanyats }]);
  };

  if (!user) {
    return (
      <div className="app" style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>SG Raid 🚴</h1>
        <p>El "Fifa Mobile" outdoor connectat a les teves cames.</p>
        <button onClick={iniciarSessio} style={{padding: '12px 24px', fontSize: '16px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
          Entrar amb Google
        </button>
      </div>
    );
  }

  if (!equip) {
    return (
      <div className="app" style={{textAlign: 'center'}}>
        <h2>Benvingut! Escull la teva disciplina principal</h2>
        <select onChange={(e) => setEquip(e.target.value)} defaultValue="">
          <option value="" disabled>Selecciona una opció...</option>
          {Object.keys(ciclistesPerDisciplina).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
    );
  }

  const pantalles = {
    mercat: <Mercat disciplina={equip} punts={punts} comprar={comprar} />,
    equip: <Equip ciclistes={ciclistes} />,
    rutes: <Rutes afegirRuta={afegirRuta} />,
    estadistiques: <Estadistiques punts={punts} rutes={rutes} nivell={nivell} />,
    ranking: <Ranking punts={punts} />,
    perfil: <Perfil user={user} equip={equip} setEquip={setEquip} stravaConnectat={stravaConnectat} />,
  };

  return (
    <div className="app">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>SG Ride 🚴</h1>
        <div><strong>Nivell {nivell}</strong> | <span style={{color: '#27ae60'}}>{punts} Punts</span></div>
      </div>
      <Menu onSelect={setPantalla} />
      <hr style={{border: '0', height: '1px', background: '#eee', margin: '20px 0'}} />
      {pantalles[pantalla]}
    </div>
  );
}
