// Código principal de la aplicación React (cargar con type="text/babel")
// Este archivo contiene todo el JSX/JS que antes estaba dentro del <script type="text/babel"> del index original.

const { useState, useEffect, useMemo } = React;
// Las utilidades de Firebase se exponen en window por firebase-init.js
const { initializeApp, getAuth, signInAnonymously, signInWithCustomToken, getFirestore, doc, onSnapshot, updateDoc, setDoc, getDoc } = window;

// Define la URL de la API estática
const API_URL = 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/all.json';

// Iconos (SVG inline)
const HomeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const HeartIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 1.03-4.5 2-1.5-1.03-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const InfoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const BookOpenIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ScaleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 16.2-4.13-2.58a1 1 0 0 0-1.6.96v.94A9.99 9.99 0 0 1 2 12C2 6.48 6.48 2 12 2a9.99 9 0 0 1 10 10v4.2Z"/><circle cx="12" cy="12" r="10"/><path d="M12 2v10l-4 4-4-4"/></svg>;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Componentes (copiar exactamente la lógica del script original) ---

// HeroDetail
const HeroDetail = ({ hero, toggleFavorite, isFavorite, goToHome }) => {
    if (!hero) return null;
    const stats = Object.entries(hero.powerstats).map(([key, value]) => ({
        name: capitalize(key.replace('-', ' ')),
        value,
        color: value > 75 ? 'bg-red-500' : value > 50 ? 'bg-yellow-500' : 'bg-green-500'
    }));
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <button onClick={goToHome} className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver a la Lista
            </button>

            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="relative">
                    <img src={hero.images.lg} alt={hero.name} className="w-full h-80 object-cover opacity-90"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x320/222233/ffffff?text=${hero.name}`; }} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4 md:p-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{hero.name}</h1>
                        <p className="text-gray-300 text-lg">Alias: {hero.biography.fullName || 'N/A'}</p>
                    </div>
                </div>

                <div className="p-4 md:p-6 lg:flex lg:space-x-8">
                    <div className="lg:w-1/2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Biografía y Apariencia</h2>
                        <dl className="space-y-2 text-sm text-gray-700">
                            <dt className="font-semibold text-gray-900">Alineación:</dt>
                            <dd className={`ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                hero.biography.alignment === 'good' ? 'bg-green-100 text-green-800' :
                                hero.biography.alignment === 'bad' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>{capitalize(hero.biography.alignment)}</dd>

                            <dt className="font-semibold text-gray-900 pt-2">Lugar de Nacimiento:</dt>
                            <dd className="ml-2">{hero.biography.placeOfBirth || 'Desconocido'}</dd>

                            <dt className="font-semibold text-gray-900 pt-2">Primera Aparición:</dt>
                            <dd className="ml-2">{hero.biography.firstAppearance || 'N/A'}</dd>

                            <dt className="font-semibold text-gray-900 pt-2">Género / Raza:</dt>
                            <dd className="ml-2">{capitalize(hero.appearance.gender)} / {capitalize(hero.appearance.race || 'Desconocida')}</dd>

                            <dt className="font-semibold text-gray-900 pt-2">Ojos / Cabello:</dt>
                            <dd className="ml-2">{hero.appearance.eyeColor} / {hero.appearance.hairColor}</dd>

                            <dt className="font-semibold text-gray-900 pt-2">Trabajo:</dt>
                            <dd className="ml-2">{hero.work.occupation || 'N/A'}</dd>
                        </dl>

                        <button onClick={() => toggleFavorite(hero.id)} className={`mt-6 w-full py-3 px-4 flex items-center justify-center font-bold text-lg rounded-lg transition duration-300 transform hover:scale-[1.02] ${
                            isFavorite(hero.id) ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 hover:bg-red-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-md'
                        }`}>
                            <HeartIcon className={`w-6 h-6 mr-2 ${isFavorite(hero.id) ? 'fill-white' : 'fill-gray-600'}`} />
                            {isFavorite(hero.id) ? 'Eliminar de Favoritos' : 'Añadir a Favoritos'}
                        </button>
                    </div>

                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Estadísticas de Poder</h2>
                        <div className="space-y-4">
                            {stats.map((stat) => (
                                <div key={stat.name}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-700">{stat.name}</span>
                                        <span className="font-mono text-sm text-gray-800">{stat.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className={`${stat.color} h-2.5 rounded-full transition-all duration-700 ease-out`} style={{ width: `${stat.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// HeroCard
const HeroCard = ({ hero, toggleFavorite, isFavorite, selectHero }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 group">
        <div onClick={() => selectHero(hero.id)}>
            <img src={hero.images.sm} alt={hero.name} className="w-full h-48 object-cover group-hover:opacity-90 transition duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/374151/ffffff?text=${hero.name}`; }} />
        </div>
        <div className="p-4 relative">
            <h3 className="text-xl font-bold text-gray-900 truncate" onClick={() => selectHero(hero.id)}>{hero.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{capitalize(hero.biography.alignment)}</p>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">ID: {hero.id}</span>
                <button onClick={() => toggleFavorite(hero.id)} className="p-2 rounded-full text-red-500 hover:bg-red-50 transition duration-150" aria-label={isFavorite(hero.id) ? 'Eliminar de Favoritos' : 'Añadir a Favoritos'}>
                    <HeartIcon className={`w-5 h-5 transition-colors ${isFavorite(hero.id) ? 'fill-red-500' : 'fill-none'}`} />
                </button>
            </div>
        </div>
    </div>
);

// HomeView
const HomeView = ({ filteredHeroes, searchTerm, setSearchTerm, filterByAlignment, setFilterByAlignment, toggleFavorite, isFavorite, selectHero, isLoading }) => {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Explorador de Héroes</h1>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <select value={filterByAlignment} onChange={(e) => setFilterByAlignment(e.target.value)} className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option value="">Filtro: Toda la Alineación</option>
                    <option value="good">Héroes (Good)</option>
                    <option value="bad">Villanos (Bad)</option>
                    <option value="neutral">Neutral</option>
                </select>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="ml-3 text-lg text-gray-600">Cargando datos de la API...</p>
                </div>
            )}

            {!isLoading && filteredHeroes.length === 0 && (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600">No se encontraron héroes que coincidan con los criterios.</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredHeroes.map(hero => (
                    <HeroCard key={hero.id} hero={hero} toggleFavorite={toggleFavorite} isFavorite={isFavorite} selectHero={selectHero} />
                ))}
            </div>
        </div>
    );
};

// FavoritesView
const FavoritesView = ({ heroes, favorites, toggleFavorite, isFavorite, selectHero }) => {
    const favoriteHeroes = useMemo(() => heroes.filter(hero => favorites.includes(hero.id)), [heroes, favorites]);
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Mis Héroes Favoritos</h1>
            {favoriteHeroes.length === 0 ? (
                <div className="text-center p-12 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200">
                    <HeartIcon className="w-12 h-12 mx-auto text-indigo-500 mb-4 fill-indigo-200"/>
                    <p className="text-xl text-indigo-700">Aún no tienes héroes en tus favoritos.</p>
                    <p className="text-gray-500 mt-2">¡Ve al inicio y añade algunos!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favoriteHeroes.map(hero => <HeroCard key={hero.id} hero={hero} toggleFavorite={toggleFavorite} isFavorite={isFavorite} selectHero={selectHero} />)}
                </div>
            )}
        </div>
    );
};

// InfoPageView
const InfoPageView = () => (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Sobre la API</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>Esta aplicación consume datos de la <strong>Superhero API</strong> proporcionada por Akabab. Es una API gratuita y de código abierto que agrega y normaliza datos de personajes de cómics.</p>
            <p className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"><span className="font-semibold text-yellow-800">Nota Importante:</span> La fuente de datos es un archivo JSON estático alojado en GitHub, sin keys de API.</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-8">Detalles Técnicos</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li><a href="https://akabab.github.io/superhero-api/" target="_blank" className="text-indigo-600 hover:underline">akabab/superhero-api</a></li>
                <li>React y Tailwind CSS.</li>
                <li>Firestore para Notas Compartidas.</li>
                <li>Lista, Búsqueda, Filtro, Detalle, Favoritos y Comparador de Estadísticas.</li>
            </ul>
        </div>
    </div>
);

// StatsComparisonView
const StatsComparisonView = ({ heroes }) => {
    const [hero1Id, setHero1Id] = useState('');
    const [hero2Id, setHero2Id] = useState('');
    const hero1 = heroes.find(h => h.id === parseInt(hero1Id));
    const hero2 = heroes.find(h => h.id === parseInt(hero2Id));
    const allStats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    const heroOptions = useMemo(() => heroes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(h=>({id:h.id,name:h.name})), [heroes]);

    const ComparisonChart = ({ stat, val1, val2 }) => {
        const maxVal = 100;
        const name = capitalize(stat);
        const getBarColor = (val) => val > 75 ? 'bg-indigo-600' : val > 50 ? 'bg-teal-500' : 'bg-gray-500';
        return (
            <div className="space-y-2">
                <p className="text-lg font-bold text-gray-800">{name}</p>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 w-8 text-right">{val1}</span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${getBarColor(val1)} h-3 rounded-full transition-all duration-700 ease-out`} style={{ width: `${(val1 / maxVal) * 100}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 w-8 text-right">{val2}</span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${getBarColor(val2)} h-3 rounded-full transition-all duration-700 ease-out`} style={{ width: `${(val2 / maxVal) * 100}%` }}></div>
                    </div>
                </div>
                <hr className="my-3 border-gray-100" />
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Pestaña Original: Comparador de Estadísticas</h1>
            <p className="mb-6 text-gray-600">Selecciona dos personajes para comparar sus habilidades de poder punto por punto.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personaje 1</label>
                    <select value={hero1Id} onChange={(e)=>setHero1Id(e.target.value)} className="w-full p-3 border border-indigo-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                        <option value="">Selecciona Personaje 1</option>
                        {heroOptions.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personaje 2</label>
                    <select value={hero2Id} onChange={(e)=>setHero2Id(e.target.value)} className="w-full p-3 border border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 bg-white">
                        <option value="">Selecciona Personaje 2</option>
                        {heroOptions.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>
            </div>

            {(hero1 || hero2) ? (
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center border-b pb-4">
                        <div className="text-indigo-600 font-bold text-xl">{hero1?.name || '---'}</div>
                        <div className="text-red-600 font-bold text-xl">{hero2?.name || '---'}</div>
                    </div>

                    <div className="space-y-6">
                        {allStats.map(stat => (
                            <ComparisonChart key={stat} stat={stat} val1={hero1 ? hero1.powerstats[stat] : 0} val2={hero2 ? hero2.powerstats[stat] : 0} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                    <ScaleIcon className="w-12 h-12 mx-auto text-gray-500 mb-4"/>
                    <p className="text-xl text-gray-600">Selecciona dos personajes para ver la comparación.</p>
                </div>
            )}
        </div>
    );
};

// SharedNotesView
const SharedNotesView = ({ db, userId }) => {
    const [note, setNote] = useState('');
    const [sharedData, setSharedData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const collectionPath = `/artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/global_notes`;
    const docPath = 'latest_note';

    useEffect(() => {
        if (!db) return;
        const docRef = window.doc(db, collectionPath, docPath);
        const unsubscribe = window.onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setSharedData(docSnapshot.data());
            } else {
                setSharedData({ content: 'Sé el primero en dejar una nota global.', userId: 'system', timestamp: Date.now() });
            }
        }, (error) => {
            console.error("Error al escuchar la nota compartida:", error);
        });
        return () => unsubscribe();
    }, [db, collectionPath]);

    const saveNote = async () => {
        if (!db || !userId || !note.trim()) return;
        setIsSaving(true);
        const noteToSave = { content: note, userId, timestamp: Date.now(), userName: `User-${userId.substring(0,4)}` };
        const docRef = window.doc(db, collectionPath, docPath);
        try {
            await window.setDoc(docRef, noteToSave, { merge: false });
            setNote('');
        } catch (e) {
            console.error("Error al guardar la nota:", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Notas Globales Compartidas <span className="text-lg text-indigo-600">(Objeto Compartido)</span></h1>
            <p className="mb-6 text-gray-600">Esta es una nota única y global, compartida y visible para todos los usuarios. <span className="font-semibold">Tu ID de Usuario: {userId}</span></p>

            <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Última Nota Global</h2>
                {sharedData ? (
                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                        <p className="text-gray-900 text-lg italic mb-2">"{sharedData.content}"</p>
                        <p className="text-sm text-gray-500">Por: <span className="font-mono text-indigo-700">{sharedData.userName || `User-${sharedData.userId.substring(0,4)}`}</span>{sharedData.timestamp && ` el ${new Date(sharedData.timestamp).toLocaleTimeString()} - ${new Date(sharedData.timestamp).toLocaleDateString()}`}</p>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">Cargando nota...</div>
                )}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Dejar una Nota Nueva</h2>
                <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Escribe tu mensaje para el mundo..." rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                <button onClick={saveNote} disabled={isSaving || !note.trim()} className={`mt-4 w-full py-2 rounded-lg font-bold transition duration-300 ${isSaving || !note.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/50'}`}>
                    {isSaving ? 'Guardando...' : 'Guardar Nota Global'}
                </button>
            </div>
        </div>
    );
};

// App principal
const App = () => {
    const [heroes, setHeroes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [currentView, setCurrentView] = useState('home');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByAlignment, setFilterByAlignment] = useState('');
    const [selectedHeroId, setSelectedHeroId] = useState(null);

    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    useEffect(() => {
        if (!firebaseConfig) {
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
            return;
        }
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const appAuth = getAuth(app);
            setDb(firestore);
            setAuth(appAuth);
            const authenticate = async () => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(appAuth, initialAuthToken);
                    } else {
                        await signInAnonymously(appAuth);
                    }
                    const user = appAuth.currentUser;
                    setUserId(user.uid);
                } catch (error) {
                    console.error("Error durante la autenticación:", error);
                    setUserId(crypto.randomUUID());
                } finally {
                    setIsAuthReady(true);
                }
            };
            authenticate();
        } catch (e) {
            console.error("Error al inicializar Firebase:", e);
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
        }
    }, []);

    useEffect(() => {
        const loadHeroes = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Error al cargar la API de Superhéroes');
                const data = await response.json();
                setHeroes(data);
            } catch (error) {
                console.error("Fallo al obtener datos de la API:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadHeroes();
        const storedFavorites = JSON.parse(localStorage.getItem('heroFavorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    const filteredHeroes = useMemo(() => {
        return heroes.filter(hero => {
            const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAlignment = filterByAlignment === '' || hero.biography.alignment === filterByAlignment;
            return matchesSearch && matchesAlignment;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [heroes, searchTerm, filterByAlignment]);

    const isFavorite = (id) => favorites.includes(id);
    const toggleFavorite = (id) => {
        setFavorites(prev => {
            let newFavorites;
            if (prev.includes(id)) newFavorites = prev.filter(favId => favId !== id);
            else newFavorites = [...prev, id];
            localStorage.setItem('heroFavorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const selectHero = (id) => { setSelectedHeroId(id); setCurrentView('detail'); };
    const goToHome = () => { setSelectedHeroId(null); setCurrentView('home'); };

    if (selectedHeroId && currentView === 'detail') {
        const selectedHero = heroes.find(h => h.id === selectedHeroId);
        return (<div className="min-h-screen bg-gray-100 font-inter"><HeroDetail hero={selectedHero} toggleFavorite={toggleFavorite} isFavorite={isFavorite} goToHome={goToHome} /></div>);
    }

    const Navigation = () => {
        const tabs = [
            { id: 'home', name: 'Lista de Héroes', icon: HomeIcon, color: 'text-indigo-600' },
            { id: 'favorites', name: 'Favoritos', icon: HeartIcon, color: 'text-red-600' },
            { id: 'compare', name: 'Comparador de Stats', icon: ScaleIcon, color: 'text-green-600' },
            { id: 'shared', name: 'Notas Globales', icon: BookOpenIcon, color: 'text-yellow-600' },
            { id: 'info', name: 'Sobre la API', icon: InfoIcon, color: 'text-blue-600' },
        ];
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 md:static md:shadow-none md:border-b">
                <div className="flex justify-around md:justify-center p-2 md:space-x-8">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setCurrentView(tab.id)} className={`flex flex-col items-center justify-center p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 text-sm font-medium w-full md:w-auto ${currentView === tab.id ? `bg-gray-100 ${tab.color} transform md:scale-[1.02]` : 'text-gray-500 hover:bg-gray-50'}`}>
                            <tab.icon className={`w-6 h-6 mb-1 ${currentView === tab.id ? 'fill-current' : 'fill-none'}`} />
                            <span className="hidden md:block">{tab.name}</span>
                            <span className="block md:hidden text-xs">{tab.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </nav>
        );
    };

    const renderView = () => {
        if (!isAuthReady && currentView === 'shared') {
            return (<div className="flex justify-center items-center h-48 p-8"><div className="animate-pulse text-xl text-gray-500">Conectando con la base de datos...</div></div>);
        }
        switch (currentView) {
            case 'favorites': return <FavoritesView heroes={heroes} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} selectHero={selectHero} />;
            case 'info': return <InfoPageView />;
            case 'shared': return <SharedNotesView db={db} userId={userId || 'Usuario Temporal'} />;
            case 'compare': return <StatsComparisonView heroes={heroes} />;
            case 'home':
            default: return <HomeView filteredHeroes={filteredHeroes} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterByAlignment={filterByAlignment} setFilterByAlignment={setFilterByAlignment} toggleFavorite={toggleFavorite} isFavorite={isFavorite} selectHero={selectHero} isLoading={isLoading} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-inter pb-20 md:pb-0">
            <header className="bg-indigo-700 text-white shadow-lg p-4 md:p-6 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black tracking-wider">SUPERHERO <span className="text-yellow-400">DB</span></h1>
                    <span className="text-sm font-mono text-indigo-200 hidden md:block">Usuario ID: {userId ? userId.substring(0, 8) + '...' : 'Cargando...'}</span>
                </div>
            </header>

            <Navigation />

            <main className="max-w-7xl mx-auto pt-4 md:pt-8 pb-4">
                {renderView()}
            </main>
        </div>
    );
};

// Montar la app: si no hay root en el DOM, crear uno (esto permite que index.html sea solo texto)
(function mountApp() {
    const existingRoot = document.getElementById('root');
    const rootElement = existingRoot || (() => {
        // Reemplaza el contenido del body (menú) por la app cuando se desee iniciar
        document.body.innerHTML = '';
        const div = document.createElement('div');
        div.id = 'root';
        document.body.appendChild(div);
        return div;
    })();
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
})();