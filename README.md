# Zonnewijzer Pro v6

Een volledig offline PWA voor astronomische data, zonnetijden en navigatie.

## Bestandsstructuur

```
zonnewijzer/
├── index.html        # HTML structuur (alle views/paginas)
├── styles.css        # Volledige CSS (design tokens, componenten, layout)
├── app.js            # Hoofdscript (router, settings, alle paginalogica)
├── suncalc.js        # SunCalc 1.9.0 astronomische bibliotheek (inline)
├── sw.js             # Service Worker v5 (cache-first, offline support)
├── manifest.json     # PWA manifest
├── eclipses.json     # Verduisteringsdata 2025-2034 (NASA/Espenak)
├── icon-192.png      # App-icoon 192x192
├── icon-512.png      # App-icoon 512x512
└── README.md         # Dit bestand
```

## Architectuur

### Lagen
- **Laag 0** — Settings Store (`localStorage`, `SETTINGS` object)
- **Laag 1** — Paginaregister (`PAGES` array — één object per pagina)
- **Laag 2** — Router (`showPage(id)` — centrale navigatiefunctie)
- **Laag 3** — Weergave (views, launcher, favorietenbalk)

### Nieuwe pagina toevoegen
1. Voeg één object toe aan de `PAGES` array in `app.js`
2. Schrijf een `<div id="view-naam">` in `index.html`
3. Voeg een `initNaam()` of `renderNaam()` functie toe in `app.js`
4. Roep die functie aan in `showPage()` in `app.js`

## Pagina's (14)

| Icoon | Pagina | Beschrijving |
|-------|--------|-------------|
| 🏠 | Home | Zonneboog, ware zonnetijd, thuishaven, UTC |
| ☀️ | Zon | Ephemeriden, gouden uur, UV-zone, azimut, hoogte |
| 🌙 | Maan | Fase, verlichting, positiehoek, op/ondergang |
| 📅 | Log | Maandoverzicht zonsopkomst/middag/ondergang |
| ⚙️ | Config | Taal, eenheden, spraak, thuishaven, favorieten |
| ℹ️ | Info | Documentatie alle pagina's (NL/EN/FR) |
| 🌤️ | Weer | OpenWeatherMap, Beaufort, min/max forecast |
| ❤️ | POI | Opgeslagen plaatsen met GPX-export |
| 🌅 | Kalender | Schemertijden via SunCalc (14 fasen) |
| 🗺️ | Kaart | Leaflet/OSM, thuishaven, afstand, richting |
| ⭐ | Sterren | Dierenriem, element, planeet |
| 🌕 | Volle Manen | Exacte data via Jean Meeus formule |
| 🔭 | Astronomie | Eclipsen, supermanen — 5 jaar vooruit |
| 📡 | Delen | Web Share API, Google Maps, adres zoom 19 |

## Technisch

- **GPS**: `navigator.geolocation.watchPosition` — live updates
- **Astronomie**: Spencer EOT-formule + Jean Meeus maanformule
- **SunCalc**: 14 schemertijden per dag (inline bibliotheek)
- **Weer**: OpenWeatherMap current + forecast API
- **Kaart**: Leaflet.js + OpenStreetMap tiles (dynamisch geladen)
- **Geocoding**: Nominatim reverse geocoding (zoom 19)
- **Offline**: Service Worker cache-first strategie
- **i18n**: Nederlands · English · Français (met NL fallback)
- **Spraak**: Web Speech API (nl-BE / en-GB / fr-FR)
- **GPX**: Valide GPX 1.1 export met coordinaten, hoogte en adres

## Installatie

Serveer via HTTPS of lokaal:
```bash
cd zonnewijzer
python -m http.server 8080
# Open http://localhost:8080
```

Bij lokaal gebruik: GPS-toestemming werkt op `localhost` zonder HTTPS.

## Ontwikkelaars

| Rol | Naam |
|-----|------|
| Ontwerp & Opdrachtgever | Andy De Poortere |
| AI-ontwikkeling | Claude Sonnet 4.6 (Anthropic) |

**Versie:** 10.0  
**Datum:** mei 2026  
**Status:** Productie — getest op Samsung Galaxy Z Flip 6

---

## Gebruikte bronnen & Licenties

| Bron | Gebruik | Licentie |
|------|---------|----------|
| [SunCalc](https://github.com/mourner/suncalc) © Vladimir Agafonkin | Schemertijden, zonpositie, maanpositie | BSD-2-Clause |
| [OpenStreetMap](https://www.openstreetmap.org/) © OSM contributors | Kaartdata en Nominatim geocoding | ODbL |
| [Leaflet.js](https://leafletjs.com/) © Vladimir Agafonkin | Interactieve kaartweergave | BSD-2-Clause |
| [OpenWeatherMap](https://openweathermap.org/) | Actueel weerbericht en forecast | Commercieel (gratis tier) |
| [Nominatim](https://nominatim.org/) © OSM contributors | Reverse geocoding (adres op basis van GPS) | ODbL / Open Use |
| Jean Meeus — *Astronomical Algorithms* | Volle maan berekeningen (JDE-formule) | Wetenschappelijke referentie |
| Spencer (1971) — *EOT-formule* | Tijdsvergelijking (Equation of Time) | Wetenschappelijke referentie |
| NASA / Fred Espenak | Zons- en maansverduisteringen 2025–2030 | Publiek domein |
| Web Speech API | Gesproken output | W3C standaard |
| Service Worker API | Offline caching | W3C standaard |
| Web Share API | Locatie delen | W3C standaard |

---

## Licentie

Dit project is vrij te gebruiken voor **persoonlijk, niet-commercieel gebruik**.

- Hergebruik of verspreiding: vermeld de oorspronkelijke ontwikkelaars
- Commercieel gebruik: niet toegestaan zonder toestemming
- Broncode mag worden aangepast voor eigen gebruik

© 2026 Andy De Poortere & Claude Sonnet 4.6 (Anthropic)
