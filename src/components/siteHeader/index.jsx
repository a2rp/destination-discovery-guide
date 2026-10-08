import { FaCompass, FaGithub } from "react-icons/fa";
import styles from "./styles.module.css";

const SiteHeader = () => (
    <header className={styles.siteHeader}>
        <a className={styles.brand} href="#top" aria-label="Wayfarer home">
            <span className={styles.brandMark}><FaCompass aria-hidden="true" /></span>
            <span>wayfarer</span>
        </a>
        <nav className={styles.navigation} aria-label="Main navigation">
            <a href="#discover">Discover</a>
            <a href="#saved">Saved places</a>
        </nav>
        <a className={styles.repositoryLink} href="https://github.com/a2rp/destination-discovery-guide" target="_blank" rel="noreferrer">
            <FaGithub aria-hidden="true" />
            <span>Repository</span>
        </a>
    </header>
);

export default SiteHeader;
