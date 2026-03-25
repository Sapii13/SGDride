import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
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
    "Tadej Pogačar",
    "Jonas Vingegaard",
    "Remco Evenepoel",
    "Primož Roglič",
    "Wout van Aert",
    "Mathieu van der Poel",
    "João Almeida",
    "Mikel Landa",
    "Carlos Rodríguez",
    "Sepp Kuss",
    "Egan Bernal",
    "Geraint Thomas",
    "Adam Yates",
    "Simon Yates",
    "Richard Carapaz",
    "Tom Pidcock",
    "Filippo Ganna",
    "Jasper Philipsen",
    "Biniam Girmay",
    "Matej Mohorič",
    "Marc Hirschi",
    "David Gaudu",
    "Enric Mas",
    "Julian Alaphilippe",
  ],
  DH: [
    "Loïc Bruni",
    "Amaury Pierron",
    "Loris Vergier",
    "Danny Hart",
    "Troy Brosnan",
    "Finn Iles",
    "Aaron Gwin",
    "Greg Minnaar",
    "Dakotah Norton",
    "Thibaut Daprela",
    "Laurie Greenland",
    "Matt Walker",
    "Andreas Kolb",
    "Brage Vestavik",
  ],
  Enduro: [
    "Jesse Melamed",
    "Richie Rude",
    "Sam Hill",
    "Jack Moir",
    "Martin Maes",
    "Alex Rudeau",
    "Adrien Dailly",
    "Slawomir Lukasik",
    "Ed Masters",
    "Theo Galy",
  ],
  XC: [
    "Nino Schurter",
    "Tom Pidcock",
    "Mathias Flückiger",
    "Victor Koretzky",
    "Jordan Sarrou",
    "Vlad Dascalu",
    "David Valero",
    "Ondrej Cink",
  ],
  Gravel: [
    "Keegan Swenson",
    "Lachlan Morton",
    "Ian Boswell",
    "Peter Stetina",
    "Laurens ten Dam",
    "Ted King",
    "Alexey Vermeulen",
    "Dylan Johnson",
  ],
};

const avatar = (name) =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;

/* ---------------- MERCAT ---------------- */
const Mercat = ({ disciplina, punts, comprar }) => {
  const ciclistes = ciclistesPerDisciplina[disciplina].map((nom, i) => {
    const nivell = ciclistesPerDisciplina[disciplina].length - i;

    return {
      nom,
      bonus: (1 + nivell * 0.05).toFixed(2),
      preu: 200 + nivell * 300,
    };
  });

  return (
    <div>
      <h2>Mercat · {disciplina}</h2>
      <p>Punts: {punts}</p>

      <div className="grid">
        {ciclistes.map((c, i) => (
          <div className="card" key={i}>
            <img src={avatar(c.nom)} width="70" />
            <h3>{c.nom}</h3>
            <p>Bonus x{c.bonus}</p>
            <p>Preu {c.preu}</p>

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

    {ciclistes.length === 0 && <p>No tens ciclistes encara</p>}

    <div className="grid">
      {ciclistes.map((c, i) => (
        <div key={i} className="card">
          <img src={avatar(c.nom)} width="70" />
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
      <h2>Rutes</h2>
      <p>Quan connectis Strava es carregaran automàticament.</p>
      <button onClick={simularRuta}>Simular Ruta</button>
    </div>
  );
};

/* ---------------- ESTADISTIQUES ---------------- */
const Estadistiques = ({ punts, rutes, nivell }) => {
  const km = rutes.reduce((a, b) => a + b.km, 0);
  const desnivell = rutes.reduce((a, b) => a + b.desnivell, 0);

  return (
    <div>
      <h2>Estadístiques</h2>
      <p>Nivell: {nivell}</p>
      <p>Punts: {punts}</p>
      <p>Total km: {km}</p>
      <p>Total desnivell: {desnivell}</p>

      <h3>Historial</h3>
      {rutes.map((r, i) => (
        <div key={i} className="card">
          {r.km} km · {r.desnivell} m · {r.punts} punts
        </div>
      ))}
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
      <h2>Ranking Mundial</h2>

      <div className="card">Tu: {punts} punts</div>

      {players.map((p, i) => (
        <div key={i} className="card">
          {p.nom} · {p.punts}
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
      <h2>Perfil</h2>
      <img src={user.photoURL} width="80" />
      <p>{user.displayName}</p>

      <label>Disciplina</label>
      <select value={equip} onChange={(e) => setEquip(e.target.value)}>
        {Object.keys(ciclistesPerDisciplina).map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <br />
      <br />

      {!stravaConnectat ? (
        <button onClick={connectaStrava}>Connectar Strava</button>
      ) : (
        <p>Strava connectat 🚴</p>
      )}

      <br />
      <br />
      <button onClick={() => signOut(auth)}>Tancar sessió</button>
    </div>
  );
};

/* ---------------- APP ---------------- */
export default function App() {
  const [user, setUser] = useState(null);
  const [equip, setEquip] = useState("");
  const [pantalla, setPantalla] = useState("mercat");
  const [punts, setPunts] = useState(1000);
  const [ciclistes, setCiclistes] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [stravaConnectat, setStravaConnectat] = useState(false);

  const nivell = Math.floor(punts / 1500) + 1;

  const iniciarSessio = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setStravaConnectat(true);
      localStorage.setItem("strava", "true");
      window.history.replaceState({}, document.title, "/");
    }

    if (localStorage.getItem("strava")) {
      setStravaConnectat(true);
    }
  }, []);

  const comprar = (c) => {
    setPunts(punts - c.preu);
    setCiclistes([...ciclistes, c]);
  };

  const afegirRuta = (km, desnivell) => {
    const bonusEquip = ciclistes.reduce((a, b) => a + Number(b.bonus), 1) / 2;

    const puntsGuanyats = Math.floor((km * 10 + desnivell * 0.4) * bonusEquip);

    setPunts(punts + puntsGuanyats);

    setRutes([...rutes, { km, desnivell, punts: puntsGuanyats }]);
  };

  if (!user)
    return (
      <div className="app">
        <h1>SGride 🚴</h1>
        <button onClick={iniciarSessio}>Entrar amb Google</button>
      </div>
    );

  if (!equip)
    return (
      <div className="app">
        <h2>Escull disciplina</h2>
        <select onChange={(e) => setEquip(e.target.value)} defaultValue="">
          <option value="" disabled>
            Selecciona
          </option>
          {Object.keys(ciclistesPerDisciplina).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
    );

  const pantalles = {
    mercat: <Mercat disciplina={equip} punts={punts} comprar={comprar} />,
    equip: <Equip ciclistes={ciclistes} />,
    rutes: <Rutes afegirRuta={afegirRuta} />,
    estadistiques: (
      <Estadistiques punts={punts} rutes={rutes} nivell={nivell} />
    ),
    ranking: <Ranking punts={punts} />,
    perfil: (
      <Perfil
        user={user}
        equip={equip}
        setEquip={setEquip}
        stravaConnectat={stravaConnectat}
      />
    ),
  };

  return (
    <div className="app">
      <h1>SGride 🚴</h1>
      <Menu onSelect={setPantalla} />
      {pantalles[pantalla]}
    </div>
  );
}
