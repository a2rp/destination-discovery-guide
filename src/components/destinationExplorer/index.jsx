import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowRight, FaHeart, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import styles from "./styles.module.css";

const places = [
    { id: "sintra", name: "Sintra", country: "Portugal", region: "Europe", type: "Countryside", days: "2-3 days", season: "April to June", tone: "rose", description: "Misty gardens, tiled lanes, and a palace on the hill. Sintra is made for unhurried mornings and long walks beneath old trees." },
    { id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia", type: "Culture", days: "4-5 days", season: "March to May", tone: "gold", description: "Take the quieter paths between temple gardens, tea houses, and the river. Early starts make the old city feel like your own." },
    { id: "lofoten", name: "Lofoten Islands", country: "Norway", region: "Europe", type: "Nature", days: "5-7 days", season: "June to August", tone: "blue", description: "A chain of fishing villages, mountain trails, and bright water above the Arctic Circle. Leave room in the plan for changing skies." },
    { id: "marrakech", name: "Marrakech", country: "Morocco", region: "Africa", type: "City", days: "3-4 days", season: "October to April", tone: "terracotta", description: "Find a slower rhythm in courtyard gardens and the shaded lanes of the medina, then watch the rooftops turn warm at dusk." },
    { id: "algarve", name: "Algarve Coast", country: "Portugal", region: "Europe", type: "Coast", days: "4-6 days", season: "May to September", tone: "teal", description: "Follow cliff paths between small beaches and fishing towns. The coast rewards a flexible itinerary and a little extra time." },
    { id: "banff", name: "Banff", country: "Canada", region: "North America", type: "Nature", days: "3-5 days", season: "June to September", tone: "forest", description: "Turquoise lakes and pine-lined trails make a memorable base for days outside. Reserve park access before you travel." },
];

const categories = ["All places", "Nature", "Coast", "Culture", "City", "Countryside"];
const savedFromStorage = () => {
    try { return JSON.parse(localStorage.getItem("wayfarer-saved") || "[]"); }
    catch { return []; }
};

const DestinationExplorer = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All places");
    const [savedOnly, setSavedOnly] = useState(false);
    const [saved, setSaved] = useState(savedFromStorage);
    const [selected, setSelected] = useState(null);
    const closeButton = useRef(null);
    const filteredPlaces = useMemo(() => places.filter((place) => {
        const matchesQuery = `${place.name} ${place.country} ${place.region} ${place.type}`.toLowerCase().includes(query.trim().toLowerCase());
        return matchesQuery && (category === "All places" || place.type === category) && (!savedOnly || saved.includes(place.id));
    }), [category, query, saved, savedOnly]);

    useEffect(() => { localStorage.setItem("wayfarer-saved", JSON.stringify(saved)); }, [saved]);
    useEffect(() => {
        if (!selected) return undefined;
        closeButton.current?.focus();
        const onKeyDown = (event) => { if (event.key === "Escape") setSelected(null); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selected]);

    const toggleSaved = (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

    return (
        <section className={styles.destinationExplorer} id="discover">
            <div className={styles.hero}>
                <div className={styles.heroCopy}>
                    <p className={styles.label}>A little inspiration for the road</p>
                    <h1>Find a place<br /><span>that feels like yours.</span></h1>
                    <p className={styles.description}>Thoughtful destination ideas for the way you want to travel.</p>
                    <label className={styles.searchBox}>
                        <FaSearch aria-hidden="true" />
                        <span className={styles.visuallyHidden}>Search destinations</span>
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a country, place, or feeling" />
                        {query && <button type="button" onClick={() => setQuery("")}>Clear</button>}
                    </label>
                </div>
                <div className={styles.heroNote}>
                    <span className={styles.noteIcon}><FaMapMarkerAlt aria-hidden="true" /></span>
                    <div><strong>Small trips, big memories</strong><p>Start with a place. Make it your own.</p></div>
                </div>
            </div>

            <div className={styles.sectionHeading}>
                <div><p className={styles.label}>The destination guide</p><h2>Places to begin</h2></div>
                <button className={savedOnly ? styles.savedFilterActive : styles.savedFilter} id="saved" type="button" onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly}>
                    <FaHeart aria-hidden="true" /> Saved places <span>{saved.length}</span>
                </button>
            </div>

            <div className={styles.filters} role="group" aria-label="Filter by travel style">
                {categories.map((item) => <button key={item} className={category === item ? styles.filterActive : styles.filter} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
            </div>

            {filteredPlaces.length ? <div className={styles.destinationGrid}>
                {filteredPlaces.map((place, index) => (
                    <article className={styles.destinationCard} key={place.id}>
                        <div className={`${styles.destinationArt} ${styles[place.tone]}`} aria-hidden="true">
                            <span className={styles.artSun} /><span className={styles.artHillOne} /><span className={styles.artHillTwo} />
                            <span className={styles.artCaption}>{String(index + 1).padStart(2, "0")} / FIELD NOTES</span>
                            <button className={saved.includes(place.id) ? styles.bookmarkSaved : styles.bookmark} type="button" aria-label={`${saved.includes(place.id) ? "Remove" : "Save"} ${place.name}`} aria-pressed={saved.includes(place.id)} onClick={() => toggleSaved(place.id)}><FaHeart aria-hidden="true" /></button>
                        </div>
                        <div className={styles.cardBody}>
                            <p className={styles.placeLine}><FaMapMarkerAlt aria-hidden="true" /> {place.country} <span>·</span> {place.region}</p>
                            <div className={styles.cardTitleRow}><h3>{place.name}</h3><span>{place.type}</span></div>
                            <p className={styles.cardDescription}>{place.description}</p>
                            <button className={styles.detailsButton} type="button" onClick={() => setSelected(place)}>Explore place <FaArrowRight aria-hidden="true" /></button>
                        </div>
                    </article>
                ))}
            </div> : <div className={styles.emptyState}><span>Nothing on this map yet.</span><p>Try another search or clear the saved places filter.</p><button type="button" onClick={() => { setQuery(""); setCategory("All places"); setSavedOnly(false); }}>Show every place</button></div>}

            {selected && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
                <section className={styles.detailModal} role="dialog" aria-modal="true" aria-labelledby="destination-title" aria-describedby="destination-description">
                    <button className={styles.modalClose} ref={closeButton} type="button" onClick={() => setSelected(null)}>Close guide</button>
                    <p className={styles.label}>{selected.country} · {selected.region}</p>
                    <h2 id="destination-title">{selected.name}</h2>
                    <p id="destination-description">{selected.description}</p>
                    <div className={styles.detailFacts}><div><span>Good for</span><strong>{selected.type}</strong></div><div><span>Time to plan</span><strong>{selected.days}</strong></div><div><span>Best season</span><strong>{selected.season}</strong></div></div>
                    <button className={styles.saveButton} type="button" onClick={() => toggleSaved(selected.id)}><FaHeart aria-hidden="true" /> {saved.includes(selected.id) ? "Remove from saved places" : "Save this place"}</button>
                </section>
            </div>}
        </section>
    );
};

export default DestinationExplorer;
