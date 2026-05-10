// Zonnewijzer Pro v10 — Hoofdscript
// Architectuur: Settings Store · Paginaregister · Router · Weergave

// LAAG 0 - SETTINGS STORE
const DEFAULT_SETTINGS={lang:'nl',timeFormat:'24h',coordFormat:'DD',tempUnit:'C',voice:false,voiceRate:1.0,favorites:['home','solar','lunar','log'],homePortName:'Thuishaven',homePortOffset:null,homeLat:null,homeLng:null,distUnit:'km'};
let SETTINGS={...DEFAULT_SETTINGS};
function loadSettings(){try{const s=JSON.parse(localStorage.getItem('zp_settings')||'{}');SETTINGS={...DEFAULT_SETTINGS,...s};}catch(e){}}
function saveSettings(){localStorage.setItem('zp_settings',JSON.stringify(SETTINGS));}
function setLang(lang,btn){SETTINGS.lang=lang;saveSettings();btn.closest('.seg-ctrl').querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');applyI18n();rebuildFavBar();rebuildLauncher();}
function setUnit(key,val,btn){
  SETTINGS[key]=val;saveSettings();
  if(btn){btn.closest('.seg-ctrl').querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
  // Herteken weerpagina live als temp eenheid wijzigt
  if(key==='tempUnit'&&weerData&&weerData.current)renderWeer(weerData.current,weerData.forecast);
}
function setVoice(on,btn){SETTINGS.voice=on;saveSettings();btn.closest('.seg-ctrl').querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
function resetAll(){if(!confirm(t('confirm_reset')))return;localStorage.clear();location.reload();}

// i18n
const I18N={
nl:{home:'Thuis',solar:'Zon',lunar:'Maan',log:'Log',config:'Instellingen',info:'Info',launcher:'Menu',
  weer:'Weer',poi:'Plaatsen',kalender:'Kalender',
  solar_time:'Ware Zonnetijd',sunrise:'Opkomst',sunset:'Ondergang',solar_noon:'Zonsopperste',
  golden_hour:'Gouden Uur',eot:'Tijdsverg. (EOT)',uv_danger:'UV Gevaarzone',
  moon_phase:'Maanfase',illumination:'Verlichting',moon_age:'Ouderdom',moon_segment:'Segment',
  moon_rise:'Maan Op',moon_set:'Maan Onder',pos_angle:'Positie Hoek',
  month_overview:'Maandoverzicht',local:'Lokaal',location:'Locatie',
  astronomical_year:'ASTRONOMISCH JAAR',
  gps_sync:'GPS SYNC...',gps_denied:'Toestemming geweigerd',gps_unavailable:'GPS niet beschikbaar',gps_timeout:'GPS timeout...',
  all_pages:"Alle pagina's",fav_hint:'Tik lang op een tegel om toe te voegen',
  confirm_reset:'Alle instellingen wissen?',
  settings_title:'Instellingen',lang_setting:'Taal',time_fmt:'Tijdformaat',coord_fmt:'Coordinaten',
  temp_unit:'Temperatuur',voice_on:'Gesproken output',voice_desc:'Web Speech API',voice_speed:'Spreeksnelheid',
  home_port:'Thuishaven',data:'Data',reset:'Reset alle instellingen',
  favs_manage:'Favorieten beheren',fav_info:'Max 4 favorieten - Home is altijd aanwezig',
  units:'Eenheden',wait_gps:'Wacht op GPS fix...',
  day:'DAG',rise:'OP',noon:'MIDDAG',set:'AF',
  golden_m:'Gouden Uur (O)',golden_e:'Gouden Uur (A)',
  azimut:'Azimut &amp; Hoogte',azimut_now:'Azimut',sun_alt:'Hoogte boven horizon',
  set_home:'Stel thuishaven in',slow:'Traag',normal:'Normaal',fast:'Snel',
  weer_title:'Weerbericht',weer_refresh:'Vernieuwen',weer_loading:'Weerdata ophalen...',
  weer_no_gps:'Geen GPS fix.',weer_error:'Weer ophalen mislukt.',weer_updated:'Bijgewerkt om',
  feels:'Gevoelstemperatuur',humidity:'Vochtigheid',temp_min:'Min',temp_max:'Max',wind:'Wind',
  pressure:'Luchtdruk',clouds:'Bewolking',rain:'Neerslag',no_rain:'Geen neerslag',
  w_sunrise:'Zonsopgang',w_sunset:'Zonsondergang',
  poi_title:'Opgeslagen Plaatsen',poi_add:'Voeg huidige locatie toe',
  poi_empty:'Nog geen plaatsen opgeslagen.',poi_hint:'Tik op + om toe te voegen.',
  poi_name_prompt:'Naam voor deze plaats:',poi_no_gps:'Geen GPS fix.',
  poi_delete_confirm:'Deze plaats verwijderen?',poi_fetching:'Adres ophalen...',
  kalender_title:'Zonnekalender',kal_daylen:'Daglengte',kal_nightlen:'Nachtlengte',kal_no_gps:'Geen GPS fix.',
  kal_events:{nadir:'Nadir (Laagste punt)',nightEnd:'Einde nacht',nauticalDawn:'Nautische dageraad',
    dawn:'Burgerlijke dageraad',sunrise:'Zonsopkomst',sunriseEnd:'Einde zonsopkomst',
    goldenHourEnd:'Einde gouden uur (ochtend)',solarNoon:'Zonsopperste',
    goldenHour:'Begin gouden uur (avond)',sunsetStart:'Begin zonsondergang',
    sunset:'Zonsondergang',dusk:'Burgerlijke schemering',nauticalDusk:'Nautische schemering',night:'Nacht'},
  phase_names:['NIEUWE MAAN','JONGE MAANSKRIEL','EERSTE KWARTIER','WASSENDE MAAN','VOLLE MAAN','AFNEMENDE MAAN','LAATSTE KWARTIER','ASGRAUWE MAAN'],
  kaart:'Kaart',kaart_title:'Mijn Positie',
  kaart_no_gps:'Geen GPS fix beschikbaar.',
  kaart_home:'Thuishaven',kaart_dist:'Afstand thuishaven',
  kaart_bearing:'Richting',kaart_you:'U bent hier',
  kaart_set_home:'Stel thuishaven in via Config',
  kaart_no_home:'Geen thuishaven ingesteld.',
  sterren:'Sterren',sterren_title:'Sterrenbeelden',
  sterren_today:'Huidig sterrenbeeld',sterren_birth:'Geboortedatum',
  sterren_no_match:'Geen overeenkomst gevonden.',
  elem_fire:'Vuur',elem_earth:'Aarde',elem_air:'Lucht',elem_water:'Water',
  fullmoon:'Volle Maan',fullmoon_title:'Volle Manen',
  fullmoon_year:'Astronomisch jaar',
  offline:'Geen internetverbinding',
  offline_try:'Probeer opnieuw wanneer u online bent.',
  gpx_download:'GPX downloaden',gpx_no_poi:'Geen plaatsen om te exporteren.',
  delen:'Delen',delen_title:'Deel Locatie',
  delen_no_gps:'Geen GPS fix beschikbaar.',
  delen_address:'Adres ophalen...',
  delen_share_btn:'Deel mijn locatie',
  delen_copy_btn:'Kopieer link',
  delen_copied:'Gekopieerd!',
  delen_share_text:'Mijn locatie:',
  delen_open_maps:'Open in Google Maps',
  delen_coords:'Coordinaten',
  delen_address_lbl:'Adres',
  delen_accuracy:'Nauwkeurigheid',
  astro:'Astronoom',astro_title:'Astronomische Gebeurtenissen',
  astro_supermoon:'Supermaan',astro_micromoon:'Micromaan',
  astro_total_lunar:'Totale Maansverduistering',
  astro_partial_lunar:'Gedeeltelijke Maansverduistering',
  astro_penumbral_lunar:'Penumbrische Maansverduistering',
  astro_total_solar:'Totale Zonsverduistering',
  astro_annular_solar:'Ringvormige Zonsverduistering',
  astro_partial_solar:'Gedeeltelijke Zonsverduistering',
  astro_hybrid_solar:'Hybride Zonsverduistering',
  astro_blood_moon:'Rode Maan (Blood Moon)',
  astro_blue_moon:'Blauwe Maan',
  astro_perigee:'Perigeum',astro_apogee:'Apogeum',
  astro_utc:'UTC',astro_past:'Voorbij',
  months:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
},
en:{home:'Home',solar:'Sun',lunar:'Moon',log:'Log',config:'Settings',info:'Info',launcher:'Menu',
  weer:'Weather',poi:'Places',kalender:'Calendar',
  solar_time:'True Solar Time',sunrise:'Sunrise',sunset:'Sunset',solar_noon:'Solar Noon',
  golden_hour:'Golden Hour',eot:'Equation of Time',uv_danger:'UV Danger Zone',
  moon_phase:'Moon Phase',illumination:'Illumination',moon_age:'Age',moon_segment:'Segment',
  moon_rise:'Moonrise',moon_set:'Moonset',pos_angle:'Position Angle',
  month_overview:'Monthly Overview',local:'Local',location:'Location',
  astronomical_year:'ASTRONOMICAL YEAR',
  gps_sync:'GPS SYNC...',gps_denied:'Permission denied',gps_unavailable:'GPS not supported',gps_timeout:'GPS timeout...',
  all_pages:'All pages',fav_hint:'Long press a tile to add to favourites',
  confirm_reset:'Clear all settings?',
  settings_title:'Settings',lang_setting:'Language',time_fmt:'Time format',coord_fmt:'Coordinates',
  temp_unit:'Temperature',voice_on:'Voice output',voice_desc:'Web Speech API',voice_speed:'Speech rate',
  home_port:'Home Port',data:'Data',reset:'Reset all settings',
  favs_manage:'Manage favourites',fav_info:'Max 4 favourites - Home always present',
  units:'Units',wait_gps:'Waiting for GPS fix...',
  day:'DAY',rise:'RISE',noon:'NOON',set:'SET',
  golden_m:'Golden Hour (rise)',golden_e:'Golden Hour (set)',
  azimut:'Azimuth &amp; Elevation',azimut_now:'Azimuth',sun_alt:'Elevation above horizon',
  set_home:'Set home port',slow:'Slow',normal:'Normal',fast:'Fast',
  weer_title:'Weather report',weer_refresh:'Refresh',weer_loading:'Fetching weather...',
  weer_no_gps:'No GPS fix.',weer_error:'Failed to fetch weather.',weer_updated:'Updated at',
  feels:'Feels like',humidity:'Humidity',temp_min:'Min',temp_max:'Max',wind:'Wind',
  pressure:'Pressure',clouds:'Cloud cover',rain:'Precipitation',no_rain:'No precipitation',
  w_sunrise:'Sunrise',w_sunset:'Sunset',
  poi_title:'Saved Places',poi_add:'Add current location',
  poi_empty:'No saved places yet.',poi_hint:'Tap + to add your location.',
  poi_name_prompt:'Name for this place:',poi_no_gps:'No GPS fix.',
  poi_delete_confirm:'Delete this place?',poi_fetching:'Fetching address...',
  kalender_title:'Sun calendar',kal_daylen:'Day length',kal_nightlen:'Night length',kal_no_gps:'No GPS fix.',
  kal_events:{nadir:'Nadir (lowest point)',nightEnd:'Night end',nauticalDawn:'Nautical dawn',
    dawn:'Civil dawn',sunrise:'Sunrise',sunriseEnd:'Sunrise end',
    goldenHourEnd:'Golden hour end (morning)',solarNoon:'Solar noon',
    goldenHour:'Golden hour start (evening)',sunsetStart:'Sunset start',
    sunset:'Sunset',dusk:'Civil dusk',nauticalDusk:'Nautical dusk',night:'Night'},
  phase_names:['NEW MOON','WAXING CRESCENT','FIRST QUARTER','WAXING GIBBOUS','FULL MOON','WANING GIBBOUS','LAST QUARTER','WANING CRESCENT'],
  kaart:'Map',kaart_title:'My Position',
  kaart_no_gps:'No GPS fix available.',
  kaart_home:'Home port',kaart_dist:'Distance to home',
  kaart_bearing:'Bearing',kaart_you:'You are here',
  kaart_set_home:'Set home port via Config',
  kaart_no_home:'No home port set.',
  sterren:'Stars',sterren_title:'Star signs',
  sterren_today:'Current star sign',sterren_birth:'Date of birth',
  sterren_no_match:'No match found.',
  elem_fire:'Fire',elem_earth:'Earth',elem_air:'Air',elem_water:'Water',
  fullmoon:'Full Moon',fullmoon_title:'Full Moons',
  fullmoon_year:'Astronomical year',
  offline:'No internet connection',
  offline_try:'Try again when you are online.',
  gpx_download:'Download GPX',gpx_no_poi:'No places to export.',
  delen:'Share',delen_title:'Share Location',
  delen_no_gps:'No GPS fix available.',
  delen_address:'Fetching address...',
  delen_share_btn:'Share my location',
  delen_copy_btn:'Copy link',
  delen_copied:'Copied!',
  delen_share_text:'My location:',
  delen_open_maps:'Open in Google Maps',
  delen_coords:'Coordinates',
  delen_address_lbl:'Address',
  delen_accuracy:'Accuracy',
  astro:'Astronomer',astro_title:'Astronomical Events',
  astro_supermoon:'Supermoon',astro_micromoon:'Micromoon',
  astro_total_lunar:'Total Lunar Eclipse',
  astro_partial_lunar:'Partial Lunar Eclipse',
  astro_penumbral_lunar:'Penumbral Lunar Eclipse',
  astro_total_solar:'Total Solar Eclipse',
  astro_annular_solar:'Annular Solar Eclipse',
  astro_partial_solar:'Partial Solar Eclipse',
  astro_hybrid_solar:'Hybrid Solar Eclipse',
  astro_blood_moon:'Blood Moon',
  astro_blue_moon:'Blue Moon',
  astro_perigee:'Perigee',astro_apogee:'Apogee',
  astro_utc:'UTC',astro_past:'Past',
  months:['January','February','March','April','May','June','July','August','September','October','November','December'],
},
fr:{home:'Accueil',solar:'Soleil',lunar:'Lune',log:'Journal',config:'Reglages',info:'Info',launcher:'Menu',
  weer:'Meteo',poi:'Lieux',kalender:'Calendrier',
  solar_time:'Heure solaire vraie',sunrise:'Lever du soleil',sunset:'Coucher du soleil',solar_noon:'Midi solaire',
  golden_hour:'Heure doree',eot:'Equation du temps',uv_danger:'Zone UV danger',
  moon_phase:'Phase lunaire',illumination:'Illumination',moon_age:'Age',moon_segment:'Segment',
  moon_rise:'Lever lune',moon_set:'Coucher lune',pos_angle:'Angle position',
  month_overview:'Apercu mensuel',local:'Local',location:'Localisation',
  astronomical_year:'ANNEE ASTRONOMIQUE',
  gps_sync:'SYNC GPS...',gps_denied:'Permission refusee',gps_unavailable:'GPS non disponible',gps_timeout:'GPS timeout...',
  all_pages:'Toutes les pages',fav_hint:'Appui long pour ajouter aux favoris',
  confirm_reset:'Effacer tous les reglages?',
  settings_title:'Reglages',lang_setting:'Langue',time_fmt:'Format heure',coord_fmt:'Coordonnees',
  temp_unit:'Temperature',voice_on:'Sortie vocale',voice_desc:'Web Speech API',voice_speed:'Vitesse voix',
  home_port:"Port d'attache",data:'Donnees',reset:'Reinitialiser tous les reglages',
  favs_manage:'Gerer les favoris',fav_info:'Max 4 favoris - Accueil toujours present',
  units:'Unites',wait_gps:'En attente du GPS...',
  day:'JOUR',rise:'LEVER',noon:'MIDI',set:'COUCHER',
  golden_m:'Heure doree (lever)',golden_e:'Heure doree (coucher)',
  azimut:'Azimut &amp; Hauteur',azimut_now:'Azimut',sun_alt:'Hauteur sur l horizon',
  set_home:"Definir port d'attache",slow:'Lent',normal:'Normal',fast:'Rapide',
  weer_title:'Bulletin meteo',weer_refresh:'Actualiser',weer_loading:'Recuperation meteo...',
  weer_no_gps:'Pas de fix GPS.',weer_error:'Echec recuperation meteo.',weer_updated:'Mis a jour a',
  feels:'Ressenti',humidity:'Humidite',temp_min:'Min',temp_max:'Max',wind:'Vent',
  pressure:'Pression',clouds:'Nebulosite',rain:'Precipitations',no_rain:'Pas de precipitations',
  w_sunrise:'Lever du soleil',w_sunset:'Coucher du soleil',
  poi_title:'Lieux enregistres',poi_add:'Ajouter position actuelle',
  poi_empty:'Aucun lieu enregistre.',poi_hint:'Appuyez sur + pour ajouter.',
  poi_name_prompt:'Nom de ce lieu:',poi_no_gps:'Pas de fix GPS.',
  poi_delete_confirm:'Supprimer ce lieu?',poi_fetching:'Recuperation adresse...',
  kalender_title:'Calendrier solaire',kal_daylen:'Duree du jour',kal_nightlen:'Duree de la nuit',kal_no_gps:'Pas de fix GPS.',
  kal_events:{nadir:'Nadir (point bas)',nightEnd:'Fin de nuit',nauticalDawn:'Aube nautique',
    dawn:'Aube civile',sunrise:'Lever du soleil',sunriseEnd:'Fin du lever',
    goldenHourEnd:'Fin heure doree (matin)',solarNoon:'Midi solaire',
    goldenHour:'Debut heure doree (soir)',sunsetStart:'Debut coucher',
    sunset:'Coucher du soleil',dusk:'Crepuscule civil',nauticalDusk:'Crepuscule nautique',night:'Nuit'},
  phase_names:['NOUVELLE LUNE','PREMIER CROISSANT','PREMIER QUARTIER','LUNE GIBBEUSE CROISSANTE','PLEINE LUNE','LUNE GIBBEUSE DECROISSANTE','DERNIER QUARTIER','DERNIER CROISSANT'],
  kaart:'Carte',kaart_title:'Ma Position',
  kaart_no_gps:'Pas de fix GPS.',
  kaart_home:"Port d'attache",kaart_dist:"Distance du port",
  kaart_bearing:'Cap',kaart_you:'Vous etes ici',
  kaart_set_home:"Definir le port via Reglages",
  kaart_no_home:"Aucun port d'attache defini.",
  sterren:'Etoiles',sterren_title:'Signes du zodiaque',
  sterren_today:'Signe actuel',sterren_birth:'Date de naissance',
  sterren_no_match:'Aucune correspondance.',
  elem_fire:'Feu',elem_earth:'Terre',elem_air:'Air',elem_water:'Eau',
  fullmoon:'Pleine Lune',fullmoon_title:'Pleines Lunes',
  fullmoon_year:'Annee astronomique',
  offline:'Pas de connexion internet',
  offline_try:'Reessayez quand vous serez en ligne.',
  gpx_download:'Telecharger GPX',gpx_no_poi:'Aucun lieu a exporter.',
  delen:'Partager',delen_title:'Partager Position',
  delen_no_gps:'Pas de fix GPS.',
  delen_address:'Recuperation adresse...',
  delen_share_btn:'Partager ma position',
  delen_copy_btn:'Copier le lien',
  delen_copied:'Copie!',
  delen_share_text:'Ma position:',
  delen_open_maps:'Ouvrir dans Google Maps',
  delen_coords:'Coordonnees',
  delen_address_lbl:'Adresse',
  delen_accuracy:'Precision',
  astro:'Astronome',astro_title:'Evenements Astronomiques',
  astro_supermoon:'Superlune',astro_micromoon:'Microlune',
  astro_total_lunar:'Eclipse Lunaire Totale',
  astro_partial_lunar:'Eclipse Lunaire Partielle',
  astro_penumbral_lunar:'Eclipse Lunaire Penombrale',
  astro_total_solar:'Eclipse Solaire Totale',
  astro_annular_solar:'Eclipse Solaire Annulaire',
  astro_partial_solar:'Eclipse Solaire Partielle',
  astro_hybrid_solar:'Eclipse Solaire Hybride',
  astro_blood_moon:'Lune de Sang',
  astro_blue_moon:'Lune Bleue',
  astro_perigee:'Perigee',astro_apogee:'Apogee',
  astro_utc:'UTC',astro_past:'Passe',
  months:['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'],
}
};
const t=key=>I18N[SETTINGS.lang]?.[key]??I18N.nl[key]??key;

function applyI18n(){
  const pairs=[
    ['lbl-all-pages','all_pages'],['lbl-fav-hint','fav_hint'],
    ['lbl-solar-time','solar_time'],['lbl-golden','golden_hour'],['lbl-uv','uv_danger'],
    ['lbl-local','local'],
    ['lbl-solar-eph','solar_time'],['lbl-solar-noon','solar_noon'],
    ['lbl-rise','sunrise'],['lbl-set','sunset'],['lbl-gold-m','golden_m'],['lbl-gold-e','golden_e'],['lbl-uv-danger','uv_danger'],
    ['lbl-moon-title','moon_phase'],['lbl-moon-rise','moon_rise'],['lbl-moon-set','moon_set'],
    ['lbl-illum','illumination'],['lbl-pos-angle','pos_angle'],['lbl-age','moon_age'],['lbl-segment','moon_segment'],
    ['lbl-month-overview','month_overview'],
    ['th-day','day'],['th-rise','rise'],['th-noon','noon'],['th-set','set'],
    ['lbl-config-title','settings_title'],['lbl-lang-setting','lang_setting'],
    ['lbl-time-fmt','time_fmt'],['lbl-coord-fmt','coord_fmt'],['lbl-temp-unit','temp_unit'],
    ['lbl-voice-on','voice_on'],['lbl-voice-desc','voice_desc'],['lbl-voice-speed','voice_speed'],
    ['lbl-cfg-home','home_port'],['lbl-cfg-favs','favs_manage'],['lbl-fav-info','fav_info'],['lbl-cfg-data','data'],
    ['lbl-cfg-units','units'],
    ['lbl-weer-title','weer_title'],['lbl-weer-refresh','weer_refresh'],
    ['lbl-feels','feels'],['lbl-humidity','humidity'],['lbl-temp-min','temp_min'],['lbl-temp-max','temp_max'],
    ['lbl-wind','wind'],['lbl-pressure','pressure'],['lbl-clouds','clouds'],['lbl-rain','rain'],
    ['lbl-w-sunrise','w_sunrise'],['lbl-w-sunset','w_sunset'],
    ['lbl-poi-title','poi_title'],['lbl-poi-add-btn','poi_add'],['lbl-poi-empty','poi_empty'],['lbl-poi-hint','poi_hint'],
    ['lbl-kal-title','kalender_title'],['lbl-kal-daylen','kal_daylen'],['lbl-kal-nightlen','kal_nightlen'],
    ['lbl-kaart-title','kaart_title'],['lbl-kaart-dist','kaart_dist'],['lbl-kaart-bearing','kaart_bearing'],
    ['lbl-sterren-title','sterren_title'],['lbl-sterren-today','sterren_today'],
    ['lbl-fullmoon-title','fullmoon_title'],['lbl-fullmoon-year','fullmoon_year'],
    ['lbl-astro-title','astro_title'],
    ['lbl-delen-title','delen_title'],['lbl-delen-coords','delen_coords'],['lbl-delen-addr-lbl','delen_address_lbl'],['lbl-delen-acc','delen_accuracy'],
  ];
  pairs.forEach(([id,key])=>{const el=document.getElementById(id);if(el&&key)el.innerText=t(key);});
  const dLight=document.getElementById('lbl-daylight');
  if(dLight)dLight.innerText=SETTINGS.lang==='fr'?'Lumiere du jour':SETTINGS.lang==='en'?'Daylight':'Normaal Daglicht';
  const nEl=document.getElementById('lbl-night');
  if(nEl)nEl.innerText=SETTINGS.lang==='fr'?'Nuit':SETTINGS.lang==='en'?'Night':'Nacht';
  const hpEl=document.getElementById('lbl-hp-name');if(hpEl)hpEl.innerText=SETTINGS.lang==='fr'?'Nom':SETTINGS.lang==='en'?'Name':'Naam';
  const hpO=document.getElementById('lbl-hp-offset');if(hpO)hpO.innerText='UTC Offset';
  const btnHome=document.getElementById('btn-set-home');if(btnHome)btnHome.innerText='📍 '+t('set_home');
  const btnReset=document.getElementById('btn-reset');if(btnReset)btnReset.innerText='🗑 '+t('reset');
  document.getElementById('vr-slow')?.innerText==t('slow');
  document.getElementById('vr-normal')?.innerText==t('normal');
  document.getElementById('vr-fast')?.innerText==t('fast');
  if(document.getElementById('vr-slow'))document.getElementById('vr-slow').innerText=t('slow');
  if(document.getElementById('vr-normal'))document.getElementById('vr-normal').innerText=t('normal');
  if(document.getElementById('vr-fast'))document.getElementById('vr-fast').innerText=t('fast');
  rebuildFavManage();
  if(currentPage==='poi')initPOIPage();
  if(currentPage==='kalender')renderKalender();
}

// LAAG 1 - PAGINAREGISTER
const PAGES=[
  {id:'home',    icon:'🏠',labelKey:'home',   viewId:'view-home',  alwaysFav:true},
  {id:'solar',   icon:'☀️', labelKey:'solar',  viewId:'view-solar'},
  {id:'lunar',   icon:'🌙', labelKey:'lunar',  viewId:'view-lunar'},
  {id:'log',     icon:'📅', labelKey:'log',    viewId:'view-log'},
  {id:'config',  icon:'⚙️', labelKey:'config', viewId:'view-config'},
  {id:'info',    icon:'ℹ️', labelKey:'info',   viewId:'view-info'},
  {id:'weer',    icon:'🌤️', labelKey:'weer',   viewId:'view-weer'},
  {id:'poi',     icon:'❤️', labelKey:'poi',    viewId:'view-poi'},
  {id:'kalender',icon:'🌅', labelKey:'kalender',viewId:'view-kalender'},
  {id:'kaart',   icon:'🗺️', labelKey:'kaart',   viewId:'view-kaart'},
  {id:'sterren', icon:'⭐', labelKey:'sterren', viewId:'view-sterren'},
  {id:'fullmoon',icon:'🌕', labelKey:'fullmoon', viewId:'view-fullmoon'},
  {id:'delen',   icon:'📡', labelKey:'delen',    viewId:'view-delen'},
  {id:'astro',   icon:'🔭', labelKey:'astro',   viewId:'view-astro'},
];

// LAAG 2 - ROUTER
let currentPage='home';
function showPage(id){
  document.querySelectorAll('.view,#view-log,#view-poi').forEach(v=>{v.classList.remove('active');if(v.id==='view-poi')v.style.display='none';});
  const target=document.getElementById(id==='launcher'?'view-launcher':(PAGES.find(p=>p.id===id)||{viewId:'view-home'}).viewId);
  if(target){
    if(target.id==='view-poi') target.style.display='flex';
    else target.classList.add('active');
  }
  currentPage=id;
  rebuildFavBar();
  if(id==='log')generateLog();
  if(id==='config')refreshConfigDisplay();
  if(id==='home'){resizeArc();drawArc();}
  if(id==='weer'){initWeerPage();fetchWeer();}
  if(id==='poi')initPOIPage();
  if(id==='kalender')renderKalender();
  if(id==='kaart')initKaart();
  if(id==='sterren')renderSterren();
  if(id==='fullmoon')renderFullMoon();
  if(id==='delen')initDelen();
  if(id==='astro')renderAstro();
}

// LAAG 3 - FAVORIETENBALK
function getFavs(){const stored=SETTINGS.favorites||[];const others=stored.filter(id=>id!=='home').slice(0,3);return['home',...others];}
function rebuildFavBar(){
  const bar=document.getElementById('fav-bar');
  const favs=getFavs();
  bar.style.gridTemplateColumns=`repeat(${favs.length+1},1fr)`;
  bar.innerHTML='';
  favs.forEach(id=>{
    const pg=PAGES.find(p=>p.id===id);if(!pg)return;
    const div=document.createElement('div');
    div.className='fav-item'+(currentPage===id?' active':'');
    div.innerHTML=`<div class="fav-icon">${pg.icon}</div><div>${t(pg.labelKey)}</div>`;
    div.onclick=()=>showPage(id);
    bar.appendChild(div);
  });
  const launcher=document.createElement('div');
  launcher.className='fav-item fav-launcher'+(currentPage==='launcher'?' active':'');
  launcher.innerHTML=`<div class="fav-icon">&#x229E;</div><div>${t('launcher')}</div>`;
  launcher.onclick=()=>showPage('launcher');
  bar.appendChild(launcher);
}

// LAUNCHER GRID
function rebuildLauncher(){
  const grid=document.getElementById('launcher-grid');
  grid.innerHTML='';
  const favs=getFavs();
  PAGES.forEach(pg=>{
    const isFav=favs.includes(pg.id);
    const tile=document.createElement('div');
    tile.className='launcher-tile'+(isFav?' fav-marked':'');
    tile.innerHTML=`<div class="launcher-icon">${pg.icon}</div><div class="launcher-label">${t(pg.labelKey)}</div><div class="launcher-fav-dot"></div>`;
    tile.onclick=()=>showPage(pg.id);
    let pressTimer;
    tile.addEventListener('touchstart',()=>{pressTimer=setTimeout(()=>toggleFav(pg.id,tile),600);});
    tile.addEventListener('touchend',()=>clearTimeout(pressTimer));
    tile.addEventListener('touchmove',()=>clearTimeout(pressTimer));
    grid.appendChild(tile);
  });
  const hint=document.getElementById('lbl-fav-hint');if(hint)hint.innerText=t('fav_hint');
  const title=document.getElementById('lbl-all-pages');if(title)title.innerText=t('all_pages');
}

function toggleFav(id,tile){
  if(id==='home')return;
  const favs=SETTINGS.favorites||[];
  if(favs.includes(id)){SETTINGS.favorites=favs.filter(f=>f!==id);}
  else{const cur=favs.filter(f=>f!=='home');if(cur.length>=3){speak(SETTINGS.lang==='fr'?'Maximum atteint':SETTINGS.lang==='en'?'Maximum reached':'Maximum bereikt');return;}SETTINGS.favorites=[...favs,id];}
  saveSettings();rebuildFavBar();rebuildLauncher();rebuildFavManage();
}

function rebuildFavManage(){
  const list=document.getElementById('fav-manage-list');if(!list)return;
  list.innerHTML='';
  const favs=getFavs();
  PAGES.forEach(pg=>{
    const isFav=favs.includes(pg.id);
    const isHome=pg.id==='home';
    const row=document.createElement('div');
    row.className='setting-row';row.style.padding='8px 12px';
    row.innerHTML=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:1.1rem;">${pg.icon}</span><div class="setting-label">${t(pg.labelKey)}</div>${isHome?'<span style="font-size:0.5rem;color:var(--muted);">&#9679;</span>':''}</div><div class="seg-ctrl"><button class="seg-btn${isFav?' active':''}" onclick="toggleFavBtn('${pg.id}',this)" ${isHome?'disabled':''}>${isFav?(SETTINGS.lang==='fr'?'OUI':SETTINGS.lang==='en'?'ON':'AAN'):(SETTINGS.lang==='fr'?'NON':SETTINGS.lang==='en'?'OFF':'UIT')}</button></div>`;
    list.appendChild(row);
  });
}

function toggleFavBtn(id,btn){
  if(id==='home')return;
  const favs=SETTINGS.favorites||[];
  if(favs.includes(id)){SETTINGS.favorites=favs.filter(f=>f!==id);btn.classList.remove('active');btn.innerText=SETTINGS.lang==='fr'?'NON':SETTINGS.lang==='en'?'OFF':'UIT';}
  else{const cur=(SETTINGS.favorites||[]).filter(f=>f!=='home');if(cur.length>=3)return;SETTINGS.favorites=[...favs,id];btn.classList.add('active');btn.innerText=SETTINGS.lang==='fr'?'OUI':SETTINGS.lang==='en'?'ON':'AAN';}
  saveSettings();rebuildFavBar();rebuildLauncher();
}

// SPRAAK
const VOICE_LANG={nl:'nl-BE',en:'en-GB',fr:'fr-FR'};
function speak(text){if(!SETTINGS.voice||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=VOICE_LANG[SETTINGS.lang]||'nl-BE';u.rate=SETTINGS.voiceRate||1.0;speechSynthesis.speak(u);}

// FORMATTERS
function formatTime(mins,withSeconds){
  const tz=-(new Date().getTimezoneOffset());
  let t2=(mins+tz+1440)%1440;
  const h=Math.floor(t2/60)%24,m=Math.floor(t2%60),s=Math.floor((t2*60)%60);
  if(SETTINGS.timeFormat==='12h'){const ampm=h>=12?'PM':'AM';const h12=h%12||12;return h12+':'+(String(m).padStart(2,'0'))+(withSeconds?':'+String(s).padStart(2,'0'):'')+' '+ampm;}
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+(withSeconds?':'+String(s).padStart(2,'0'):'');
}

function formatCoord(lat,lng){
  if(SETTINGS.coordFormat==='DD')return lat.toFixed(5)+'N '+lng.toFixed(5)+'E';
  if(SETTINGS.coordFormat==='DMS'){const toDMS=(v,pos,neg)=>{const d=Math.floor(Math.abs(v)),m2=Math.floor((Math.abs(v)-d)*60),s2=(((Math.abs(v)-d)*60)-m2)*60;return d+'d'+String(m2).padStart(2,'0')+"'"+s2.toFixed(1)+'"'+(v>=0?pos:neg);};return toDMS(lat,'N','S')+' '+toDMS(lng,'E','W');}
  if(SETTINGS.coordFormat==='DDM'){const toDDM=(v,pos,neg)=>{const d=Math.floor(Math.abs(v)),m2=((Math.abs(v)-d)*60);return d+'d'+m2.toFixed(4)+"' "+(v>=0?pos:neg);};return toDDM(lat,'N','S')+' '+toDDM(lng,'E','W');}
  return lat.toFixed(5)+'N '+lng.toFixed(5)+'E';
}

// ASTRONOMISCHE BEREKENINGEN
function calcSun(date,iLat,iLng){
  const doy=Math.floor((date-new Date(date.getFullYear(),0,0))/86400000);
  const b=(2*Math.PI/365)*(doy-81);
  const eot=9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
  const decl=23.45*Math.sin((Math.PI/180)*(360/365)*(doy-81));
  const latR=iLat*(Math.PI/180),declR=decl*(Math.PI/180);
  const cosH=(Math.sin(-0.83*Math.PI/180)-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  let rise=0,set=0;
  if(cosH<=1&&cosH>=-1){const h0=Math.acos(cosH)*(180/Math.PI);rise=720-4*(iLng+h0)-eot;set=720-4*(iLng-h0)-eot;}
  return{rise,set,noon:720-(iLng*4)-eot,eot,decl};
}

function calcGoldenDurMins(iLat,decl){
  const latR=iLat*(Math.PI/180),declR=decl*(Math.PI/180);
  const cosH0=(Math.sin(-0.83*Math.PI/180)-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  const cosHG=(Math.sin(6*Math.PI/180)-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  if(isNaN(cosHG)||cosHG>1||cosHG<-1||isNaN(cosH0)||cosH0>1||cosH0<-1)return 0;
  return Math.abs(4*(Math.acos(cosH0)-Math.acos(cosHG))*(180/Math.PI));
}

function calcUVDangerMins(lat,decl,noon){
  const D2R=Math.PI/180,latR=lat*D2R,declR=decl*D2R;
  const cosH=(Math.sin(45*D2R)-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  if(isNaN(cosH)||cosH>1||cosH<-1)return{start:noon,end:noon};
  const H=Math.acos(cosH)*(180/Math.PI);
  return{start:noon-4*H,end:noon+4*H};
}

function homePortOffset(now){
  if(SETTINGS.homePortOffset!==null)return SETTINGS.homePortOffset;
  const lastSun=(mo,yr)=>{const last=new Date(yr,mo,0);last.setDate(last.getDate()-last.getDay());return last;};
  const dstStart=lastSun(4,now.getFullYear()),dstEnd=lastSun(11,now.getFullYear());
  return now>=dstStart&&now<dstEnd?2:1;
}

// ARC CANVAS
let arcCanvas,arcCtx;
const SEGS=220;
let arcRiseMins=375,arcSetMins=1263,arcNowMins=720,arcNoonMins=720;
let arcGoldDur=40,arcUVStart=680,arcUVEnd=760;

function resizeArc(){
  if(!arcCanvas)return;
  const wrap=document.getElementById('arc-wrap');if(!wrap)return;
  const W=wrap.clientWidth,H=Math.round(W*0.68),dpr=window.devicePixelRatio||1;
  arcCanvas.width=W*dpr;arcCanvas.height=H*dpr;arcCanvas.style.height=H+'px';
  arcCtx.setTransform(1,0,0,1,0,0);arcCtx.scale(dpr,dpr);
}

function arcPoint(t,W,CX,CY,RX,RY){const a=Math.PI+t*Math.PI;return{x:CX+RX*Math.cos(a),y:CY+RY*Math.sin(a)};}

function segmentColor(m,rise,set,gd,uvS,uvE,isDimmed){
  if(m<rise||m>set)return '#2a2a22';
  if(m>=rise&&m<=rise+gd)return isDimmed?'#2255cc':'#4488ff';
  if(m>=set-gd&&m<=set)return isDimmed?'#2255cc':'#4488ff';
  if(m>=uvS&&m<=uvE)return isDimmed?'#991111':'#ff3333';
  return isDimmed?'#997700':'#ffdd00';
}

function fmtMins(totalMins){
  let m=Math.round(totalMins);
  const h=Math.floor(m/60)%24,mn=Math.floor(m%60);
  return String(h).padStart(2,'0')+':'+String(mn<0?0:mn).padStart(2,'0');
}

function drawArc(){
  if(!arcCanvas||!arcCtx)return;
  const dpr=window.devicePixelRatio||1,W=arcCanvas.width/dpr,H=arcCanvas.height/dpr;
  arcCtx.clearRect(0,0,W,H);
  const CX=W/2,CY=H*0.88,RX=W*0.43,RY=H*0.72;
  const rise=arcRiseMins,set=arcSetMins,nowM=arcNowMins,noon=arcNoonMins,dayLen=set-rise;
  const prog=Math.max(0,Math.min(1,(nowM-rise)/dayLen));
  const isDaytime=nowM>=rise&&nowM<=set;
  const marg=W*0.05,fs=Math.max(9,W*0.025);

  for(let i=0;i<SEGS;i++){
    const t0=i/SEGS,t1=(i+1)/SEGS,midT=(t0+t1)/2;
    const p0=arcPoint(t0,W,CX,CY,RX,RY),p1=arcPoint(t1,W,CX,CY,RX,RY);
    arcCtx.beginPath();arcCtx.moveTo(p0.x,p0.y);arcCtx.lineTo(p1.x,p1.y);
    arcCtx.lineWidth=isDaytime&&midT<=prog?4.5:3;arcCtx.lineCap='round';
    arcCtx.strokeStyle=segmentColor(rise+midT*dayLen,rise,set,arcGoldDur,arcUVStart,arcUVEnd,isDaytime&&midT<=prog);
    arcCtx.stroke();
  }

  if(isDaytime&&prog>0.005){
    arcCtx.save();arcCtx.beginPath();arcCtx.rect(0,0,W,CY);arcCtx.clip();arcCtx.beginPath();
    const pS=arcPoint(0,W,CX,CY,RX,RY);arcCtx.moveTo(pS.x,pS.y);
    const steps=Math.round(prog*SEGS);
    for(let i=1;i<=steps;i++){const p=arcPoint(i/SEGS,W,CX,CY,RX,RY);arcCtx.lineTo(p.x,p.y);}
    const pN=arcPoint(prog,W,CX,CY,RX,RY);arcCtx.lineTo(pN.x,CY);arcCtx.lineTo(pS.x,CY);arcCtx.closePath();
    const gr=arcCtx.createLinearGradient(0,CY-RY,0,CY);gr.addColorStop(0,'rgba(255,157,47,0.3)');gr.addColorStop(1,'rgba(255,157,47,0.0)');
    arcCtx.fillStyle=gr;arcCtx.fill();arcCtx.restore();
  }

  arcCtx.save();arcCtx.globalAlpha=0.5;arcCtx.setLineDash([6,5]);
  arcCtx.beginPath();arcCtx.moveTo(marg,CY);arcCtx.lineTo(W-marg,CY);
  arcCtx.strokeStyle='#999977';arcCtx.lineWidth=1.5;arcCtx.stroke();arcCtx.restore();

  const rPt=arcPoint(0,W,CX,CY,RX,RY),sPt=arcPoint(1,W,CX,CY,RX,RY);
  arcCtx.save();arcCtx.setLineDash([]);arcCtx.textAlign='center';
  arcCtx.font='bold '+fs+"px 'Courier New',monospace";arcCtx.fillStyle='#ff9d2f';
  arcCtx.fillText(fmtMins(rise),rPt.x,CY+fs*1.6);
  arcCtx.font=(fs*0.82)+"px 'Courier New',monospace";arcCtx.fillStyle='#999';
  arcCtx.fillText('OPKOMST',rPt.x,CY+fs*2.8);
  arcCtx.font='bold '+fs+"px 'Courier New',monospace";arcCtx.fillStyle='#ff9d2f';
  arcCtx.fillText(fmtMins(set),sPt.x,CY+fs*1.6);
  arcCtx.font=(fs*0.82)+"px 'Courier New',monospace";arcCtx.fillStyle='#999';
  arcCtx.fillText('ONDERGANG',sPt.x,CY+fs*2.8);arcCtx.restore();

  arcCtx.save();arcCtx.setLineDash([]);
  arcCtx.strokeStyle='rgba(255,255,255,0.75)';arcCtx.lineWidth=1.5;
  arcCtx.beginPath();arcCtx.moveTo(CX,CY-8);arcCtx.lineTo(CX,CY+8);arcCtx.stroke();
  arcCtx.font=Math.max(8,W*0.02)+"px 'Courier New',monospace";
  arcCtx.fillStyle='#aaa';arcCtx.textAlign='center';arcCtx.fillText(fmtMins(noon),CX,CY+fs*1.3);arcCtx.restore();

  const dlFs=Math.max(8,W*0.022);
  arcCtx.save();arcCtx.setLineDash([]);arcCtx.font=dlFs+"px 'Courier New',monospace";
  arcCtx.fillStyle='rgba(255,157,47,0.75)';arcCtx.textAlign='center';
  arcCtx.fillText('DAGLENGTE  '+Math.floor(dayLen/60)+'u '+Math.floor(dayLen%60).toString().padStart(2,'0')+'m',CX,CY+fs*1.3+dlFs*1.8);arcCtx.restore();

  const sunT=isDaytime?prog:(nowM<rise?0:1);
  const sunPt=arcPoint(sunT,W,CX,CY,RX,RY),sx=sunPt.x,sy=sunPt.y;
  const bodyR=Math.max(7,W*0.016),rayR=bodyR+Math.max(4,W*0.009);
  arcCtx.save();arcCtx.setLineDash([]);arcCtx.globalAlpha=isDaytime?1.0:0.22;
  arcCtx.beginPath();arcCtx.arc(sx,sy,rayR+5,0,Math.PI*2);arcCtx.fillStyle='rgba(255,157,47,0.18)';arcCtx.fill();
  arcCtx.strokeStyle='#ff9d2f';arcCtx.lineWidth=1.6;arcCtx.lineCap='round';
  for(let r=0;r<8;r++){const a=r*Math.PI/4;arcCtx.beginPath();arcCtx.moveTo(sx+Math.cos(a)*(bodyR+2),sy+Math.sin(a)*(bodyR+2));arcCtx.lineTo(sx+Math.cos(a)*rayR,sy+Math.sin(a)*rayR);arcCtx.stroke();}
  arcCtx.beginPath();arcCtx.arc(sx,sy,bodyR,0,Math.PI*2);arcCtx.fillStyle='#ff9d2f';arcCtx.fill();arcCtx.restore();

  if(isDaytime){
    arcCtx.save();arcCtx.setLineDash([]);
    arcCtx.font='bold '+Math.max(10,W*0.028)+"px 'Courier New',monospace";
    arcCtx.fillStyle='#00ff00';arcCtx.textAlign='center';arcCtx.textBaseline='bottom';
    arcCtx.fillText(fmtMins(nowM),sx,sy-rayR-10);arcCtx.restore();
    arcCtx.save();arcCtx.setLineDash([]);
    arcCtx.font=Math.max(8,W*0.02)+"px 'Courier New',monospace";
    arcCtx.fillStyle='#ff9d2f';arcCtx.textAlign='right';
    arcCtx.fillText(Math.round(prog*100)+'%',W-marg,Math.max(12,H*0.18));arcCtx.restore();
  }

  arcCtx.save();arcCtx.setLineDash([]);
  arcCtx.font=Math.max(8,W*0.02)+"px 'Courier New',monospace";
  arcCtx.fillStyle=isDaytime?'#ff9d2f':'#777';arcCtx.textAlign='left';
  arcCtx.fillText(isDaytime?'DAG':'NACHT',marg,Math.max(12,H*0.18));arcCtx.restore();
}

// UPDATE LOOP
let lat=null,lng=null,lastAccuracy=999,lastAltitude=null;

function update(){
  const now=new Date();
  document.getElementById('utc-time').innerText=now.toUTCString().slice(17,25);
  document.getElementById('local-time').innerText=now.toLocaleTimeString(SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE');
  document.getElementById('date-display').innerText=now.toLocaleDateString(SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();
  document.getElementById('year-display').innerText=t('astronomical_year')+' '+now.getFullYear();
  document.getElementById('zone-display').innerText='UTC'+(now.getTimezoneOffset()<0?'+':'-')+Math.abs(now.getTimezoneOffset()/60);
  if(lat===null)return;
  const tz=-now.getTimezoneOffset();
  const s=calcSun(now,lat,lng);
  const utcMins=now.getUTCHours()*60+now.getUTCMinutes()+now.getUTCSeconds()/60;
  let sMins=(utcMins+lng*4+s.eot+1440)%1440;
  document.getElementById('solar-time').innerText=[Math.floor(sMins/60),Math.floor(sMins%60),Math.floor((sMins*60)%60)].map(v=>String(v).padStart(2,'0')).join(':');
  document.getElementById('solar-diff').innerText='EOT: '+s.eot.toFixed(2)+' MIN';
  const fmtT=(mi)=>{let tt=(mi+tz+1440)%1440;return Math.floor(tt/60).toString().padStart(2,'0')+':'+Math.floor(tt%60).toString().padStart(2,'0');};
  document.getElementById('val-noon').innerText=fmtT(s.noon);
  document.getElementById('out-rise').innerText=fmtT(s.rise);
  document.getElementById('out-set').innerText=fmtT(s.set);
  const gDur=Math.round(calcGoldenDurMins(lat,s.decl));
  document.getElementById('out-gold-morning').innerText=fmtT(s.rise);
  document.getElementById('dur-gold-morning').innerText=gDur+' min';
  document.getElementById('out-gold-evening').innerText=fmtT(s.set-gDur);
  document.getElementById('dur-gold-evening').innerText=gDur+' min';
  const uv=calcUVDangerMins(lat,s.decl,s.noon);
  document.getElementById('uv-start').innerText=fmtT(uv.start);
  document.getElementById('uv-end').innerText=fmtT(uv.end);

  // Azimut + Zonnehoogte via SunCalc
  if(typeof SunCalc!=='undefined'){
    const pos=SunCalc.getPosition(now,lat,lng);
    const azDeg=((pos.azimuth*180/Math.PI)+180+360)%360;
    const altDeg=pos.altitude*180/Math.PI;
    document.getElementById('out-azimut').innerText=azDeg.toFixed(1)+'\u00b0';
    document.getElementById('out-azimut-compass').innerText=degToCompass(Math.round(azDeg));
    // Zonnehoogte boven horizon
    const altEl=document.getElementById('out-sun-alt');
    const altSub=document.getElementById('out-sun-alt-sub');
    if(altEl) altEl.innerText=altDeg.toFixed(2)+'\u00b0';
    if(altSub){
      if(altDeg<0)       altSub.innerText=SETTINGS.lang==='fr'?'sous l\u2019horizon':SETTINGS.lang==='en'?'below horizon':'onder horizon';
      else if(altDeg<6)  altSub.innerText=SETTINGS.lang==='fr'?'heure dor\u00e9e':SETTINGS.lang==='en'?'golden hour':'gouden uur';
      else if(altDeg<30) altSub.innerText=SETTINGS.lang==='fr'?'bas':SETTINGS.lang==='en'?'low':'laag';
      else if(altDeg<60) altSub.innerText=SETTINGS.lang==='fr'?'moyen':SETTINGS.lang==='en'?'medium':'gemiddeld';
      else               altSub.innerText=SETTINGS.lang==='fr'?'haut':SETTINGS.lang==='en'?'high':'hoog';
    }
  }
  const lp=2551443.3,nm=new Date(1970,0,7,20,35,0);
  const pSecs=((now.getTime()-nm.getTime())/1000)%lp;
  const mDeg=(pSecs/lp)*360;
  const illum=(1-Math.cos(mDeg*Math.PI/180))/2*100;
  const pIdx=Math.floor(((mDeg+22.5)%360)/45);
  const ics=['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  document.getElementById('moon-icon').innerHTML=ics[pIdx];
  document.getElementById('moon-phase-name').innerText=t('phase_names')[pIdx]||'--';
  document.getElementById('moon-illum').innerText=illum.toFixed(1)+'%';
  document.getElementById('moon-deg').innerText=mDeg.toFixed(1)+'°';
  document.getElementById('moon-age').innerText=(pSecs/86400).toFixed(1);
  document.getElementById('moon-phase-num').innerText=(pIdx+1)+'/8';
  const mOff=(pSecs/lp)*24*60;
  document.getElementById('moon-rise').innerText=fmtT(s.rise+mOff);
  document.getElementById('moon-set').innerText=fmtT(s.set+mOff);
  const hpOff=homePortOffset(now);
  const hpDate=new Date(now.getTime()+now.getTimezoneOffset()*60000+hpOff*3600000);
  document.getElementById('home-port-time').innerText=hpDate.toLocaleTimeString(SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE',{hour12:false});
  document.getElementById('home-port-status').innerText=hpOff===2?'CEST (UTC+2)':'CET (UTC+1)';
  arcGoldDur=gDur;arcUVStart=uv.start+tz;arcUVEnd=uv.end+tz;
  arcRiseMins=s.rise+tz;arcSetMins=s.set+tz;arcNoonMins=s.noon+tz;
  arcNowMins=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;
  if(currentPage==='home')drawArc();
}

// LOG
function generateLog(){
  if(lat===null)return;
  const b=document.getElementById('log-body');b.innerHTML='';
  const now=new Date(),y=now.getFullYear(),mo=now.getMonth();
  const ld=new Date(y,mo+1,0).getDate();
  document.getElementById('log-month-year').innerText=t('months')[mo]+' '+y;
  const locale=SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE';
  for(let d=1;d<=ld;d++){
    const dt=new Date(y,mo,d,12,0,0),sl=calcSun(dt,lat,lng);
    const r=document.createElement('tr');if(d===now.getDate())r.className='today-row';
    const dtz=-dt.getTimezoneOffset();
    const f=m=>{let t2=(m+dtz+1440)%1440;const h=Math.floor(t2/60)%24,mn=Math.floor(t2%60);return String(h).padStart(2,'0')+':'+String(mn).padStart(2,'0');};
    r.innerHTML='<td>'+d+' '+dt.toLocaleDateString(locale,{weekday:'short'})+'</td><td>'+f(sl.rise)+'</td><td>'+f(sl.noon)+'</td><td>'+f(sl.set)+'</td>';
    b.appendChild(r);
  }
  const tr=b.querySelector('.today-row');if(tr)setTimeout(()=>tr.scrollIntoView({block:'center',behavior:'smooth'}),100);
}

// GPS
const GPS_OPTS={enableHighAccuracy:true,timeout:10000,maximumAge:0};
function onGpsSuccess(p){
  const newLat=p.coords.latitude,newLng=p.coords.longitude,acc=p.coords.accuracy;
  lastAccuracy=acc;
  lastAltitude=p.coords.altitude||null;

  lat=newLat;lng=newLng;
  document.getElementById('coords-display').innerText=formatCoord(lat,lng);
  const accEl=document.getElementById('accuracy-display');
  accEl.innerText='(+/-'+Math.round(acc)+'m)';
  accEl.style.color=acc<25?'#4488ff':acc<100?'orange':'#ff8080';
  const pulse=document.getElementById('gps-pulse');
  if(pulse){pulse.style.background='var(--green)';pulse.classList.add('blink');}
  update();
  if(currentPage==='kaart')updateKaartMarkers();
  // Auto locatie ophalen bij eerste fix of grote verplaatsing
  autoFetchHomeLocation();
}
function onGpsError(e){
  const msgs={1:t('gps_denied'),2:'GPS ERROR',3:t('gps_timeout')};
  document.getElementById('coords-display').innerText=msgs[e.code]||'GPS ERROR';
  document.getElementById('accuracy-display').innerText='';
  document.getElementById('gps-pulse').style.background='#ff6b6b';
  if(e.code===3)setTimeout(()=>navigator.geolocation.watchPosition(onGpsSuccess,onGpsError,GPS_OPTS),2000);
}

// ADRES LOOKUP



// GPX EXPORT
function exportGPX(){
  const pois = loadPOIs();
  if(!pois.length){ alert(t('gpx_no_poi')); return; }

  const now = new Date().toISOString();
  let wpts = '';
  pois.forEach(poi=>{
    const ele   = poi.ele!=null ? '\n    <ele>'+poi.ele.toFixed(1)+'</ele>' : '\n    <ele>0</ele>';
    const time  = '\n    <time>'+poi.created+'</time>';
    // Adresdata in <desc>
    const desc = poi.address ? '\n    <desc>'+poi.address.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</desc>' : '';
    const name = poi.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    wpts += '\n  <wpt lat="'+poi.lat.toFixed(7)+'" lon="'+poi.lng.toFixed(7)+'">'+
            ele+time+
            '\n    <name>'+name+'</name>'+
            desc+
            '\n  </wpt>';
  });

  const gpx = '<?xml version="1.0" encoding="UTF-8"?>\n'+
    '<gpx version="1.1" creator="Zonnewijzer Pro"\n'+
    '  xmlns="http://www.topografix.com/GPX/1/1"\n'+
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
    '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n'+
    '  <metadata>\n'+
    '    <name>Zonnewijzer POI</name>\n'+
    '    <time>'+now+'</time>\n'+
    '  </metadata>'+
    wpts+'\n</gpx>';

  // Download als bestand
  const blob = new Blob([gpx], {type:'application/gpx+xml'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'zonnewijzer-poi-'+new Date().toISOString().slice(0,10)+'.gpx';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
}

// AUTO LOCATIE — gemeente/postcode/land bij GPS fix
let _lastAutoLat=null,_lastAutoLng=null;
function autoFetchHomeLocation(){
  if(lat===null) return;
  // Alleen ophalen bij eerste fix of verplaatsing > 200m
  if(_lastAutoLat!==null){
    const dlat=lat-_lastAutoLat, dlng=lng-_lastAutoLng;
    const dist=Math.sqrt(dlat*dlat+dlng*dlng)*111000;
    if(dist<200) return;
  }
  _lastAutoLat=lat; _lastAutoLng=lng;
  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng+'&zoom=19&addressdetails=1',
    {headers:{'Accept-Language':SETTINGS.lang==='fr'?'fr':SETTINGS.lang==='en'?'en':'nl'}})
  .then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); })
  .then(d=>{
    const a=d.address||{};
    const city = a.city||a.town||a.village||a.municipality||'';
    const postcode = a.postcode||'';
    const country = a.country||'';
    // Home port city label
    const cityEl = document.getElementById('home-port-city');
    if(cityEl) cityEl.innerText = city;
    // Home location: postcode + land
    const locEl = document.getElementById('home-location');
    if(locEl) locEl.innerText = [postcode, country].filter(Boolean).join(' · ');
    // Kaart pagina ook bijwerken
    const kaartHome = document.getElementById('kaart-home-name');
    if(kaartHome && !SETTINGS.homePortName) kaartHome.innerText = city;
  })
  .catch(()=>{});
}

// CONFIG HELPERS
function refreshConfigDisplay(){
  document.getElementById('cfg-home-name').innerText=SETTINGS.homePortName||'--';
  document.getElementById('cfg-home-offset').innerText=SETTINGS.homePortOffset!==null?'UTC+'+SETTINGS.homePortOffset:'AUTO (DST)';
  document.getElementById('cfg-home-dst').innerText=SETTINGS.homePortOffset===null?(SETTINGS.lang==='fr'?'Automatique':SETTINGS.lang==='en'?'Automatic':'Automatisch'):'Manuel';
  rebuildFavManage();
  syncSegBtn('timeFormat',SETTINGS.timeFormat);syncSegBtn('coordFormat',SETTINGS.coordFormat);
  syncSegBtn('tempUnit',SETTINGS.tempUnit);syncSegBtn('voiceRate',String(SETTINGS.voiceRate));
  syncVoiceBtn(SETTINGS.voice);syncLangBtn(SETTINGS.lang);
}
function syncSegBtn(key,val){document.querySelectorAll("[onclick*=\"setUnit('"+key+"'\"]").forEach(b=>{b.classList.toggle('active',b.getAttribute('onclick').includes("'"+val+"'"));});}
function syncVoiceBtn(on){document.getElementById('voice-on-btn')?.classList.toggle('active',on);document.getElementById('voice-off-btn')?.classList.toggle('active',!on);}
function syncLangBtn(lang){document.querySelectorAll('[onclick*="setLang"]').forEach(b=>{b.classList.toggle('active',b.getAttribute('onclick').includes("'"+lang+"'"));});}
function configureHomePort(){
  const name=prompt(SETTINGS.lang==='fr'?"Nom du port d'attache:":SETTINGS.lang==='en'?'Home port name:':'Naam van thuishaven:',SETTINGS.homePortName||'');
  if(name===null)return;
  const off=prompt(SETTINGS.lang==='fr'?'Decalage UTC (ex: 1 ou 2), vide = auto':SETTINGS.lang==='en'?'UTC offset (e.g. 1 or 2), empty = auto':'UTC offset (bv. 1 of 2), leeg = auto:','');
  SETTINGS.homePortName=name||SETTINGS.homePortName;
  SETTINGS.homePortOffset=off===''||off===null?null:parseFloat(off);
  // Sla huidige GPS-positie op als thuishaven coördinaten
  if(lat!==null){
    SETTINGS.homeLat=lat;
    SETTINGS.homeLng=lng;
  }
  saveSettings();refreshConfigDisplay();
  document.getElementById('home-port-label').innerText=name||t('home_port');
  // Reset cache en herlaad locatiegegevens
  _lastAutoLat=null;_lastAutoLng=null;
  autoFetchHomeLocation();
  // Reset kaartmarkers zodat thuishaven opnieuw getekend wordt
  if(leafletMarkerHome){leafletMarkerHome.remove();leafletMarkerHome=null;}
  if(leafletLine){leafletLine.remove();leafletLine=null;}
}

// INFO TAAL TOGGLE
function switchInfoLang(lang,btn){
  document.querySelectorAll('.info-lang-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.info-block').forEach(b=>b.classList.remove('active'));
  document.getElementById('info-'+lang)?.classList.add('active');
}

// WEER
const OWM_KEY='d0b9bca6c862134e4db9a09d7ec640fa';
let weerData=null;
function getBeaufort(kmh){
  if(kmh<1)return{scale:0,desc:{nl:'Stil',en:'Calm',fr:'Calme'}};
  if(kmh<=5)return{scale:1,desc:{nl:'Zwak',en:'Light air',fr:'Tres legere brise'}};
  if(kmh<=11)return{scale:2,desc:{nl:'Zwak',en:'Light breeze',fr:'Legere brise'}};
  if(kmh<=19)return{scale:3,desc:{nl:'Matig',en:'Gentle',fr:'Petite brise'}};
  if(kmh<=28)return{scale:4,desc:{nl:'Matig',en:'Moderate',fr:'Jolie brise'}};
  if(kmh<=38)return{scale:5,desc:{nl:'Vrij krachtig',en:'Fresh',fr:'Bonne brise'}};
  if(kmh<=49)return{scale:6,desc:{nl:'Krachtig',en:'Strong',fr:'Vent frais'}};
  if(kmh<=61)return{scale:7,desc:{nl:'Hard',en:'Near gale',fr:'Grand frais'}};
  if(kmh<=74)return{scale:8,desc:{nl:'Stormachtig',en:'Gale',fr:'Coup de vent'}};
  if(kmh<=88)return{scale:9,desc:{nl:'Storm',en:'Strong gale',fr:'Fort coup de vent'}};
  if(kmh<=102)return{scale:10,desc:{nl:'Zware storm',en:'Storm',fr:'Tempete'}};
  if(kmh<=117)return{scale:11,desc:{nl:'Zeer zware storm',en:'Violent storm',fr:'Violente tempete'}};
  return{scale:12,desc:{nl:'Orkaan',en:'Hurricane',fr:'Ouragan'}};
}
function initWeerPage(){
  const pairs=[['lbl-weer-title','weer_title'],['lbl-weer-refresh','weer_refresh'],['lbl-feels','feels'],['lbl-humidity','humidity'],['lbl-temp-min','temp_min'],['lbl-temp-max','temp_max'],['lbl-wind','wind'],['lbl-pressure','pressure'],['lbl-clouds','clouds'],['lbl-rain','rain'],['lbl-w-sunrise','w_sunrise'],['lbl-w-sunset','w_sunset']];
  pairs.forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.innerText=t(key);});
  if(weerData&&weerData.current)renderWeer(weerData.current,weerData.forecast);
}
function fetchWeer(){
  if(lat===null){
    const el=document.getElementById('weer-status');
    if(el){el.style.display='block';el.className='cfg-status error';el.innerText=t('weer_no_gps');}
    document.getElementById('weer-main').style.display='none';return;
  }
  const st=document.getElementById('weer-status');
  if(st){st.style.display='block';st.className='cfg-status pending';st.innerText=t('weer_loading');}
  document.getElementById('weer-main').style.display='none';
  const lang=SETTINGS.lang==='fr'?'fr':SETTINGS.lang==='en'?'en':'nl';
  // Haal huidig weer EN forecast op — forecast geeft echte dag min/max
  const urlCurrent='https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&units=metric&lang='+lang+'&appid='+OWM_KEY;
  const urlForecast='https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lng+'&units=metric&lang='+lang+'&cnt=8&appid='+OWM_KEY;
  Promise.all([fetch(urlCurrent),fetch(urlForecast)])
  .then(([r1,r2])=>Promise.all([r1.json(),r2.json()]))
  .then(([current,forecast])=>{
    weerData={current,forecast};
    document.getElementById('weer-status').style.display='none';
    renderWeer(current,forecast);
  })
  .catch(()=>{
    const st=document.getElementById('weer-status');
    if(st){
      st.style.display='block';st.className='cfg-status error';
      st.innerText = navigator.onLine ? t('weer_error') : t('offline')+' — '+t('offline_try');
    }
  });
}

function renderWeer(data,forecast){
  const lang=SETTINGS.lang,useF=SETTINGS.tempUnit==='F';
  const toUnit=c=>useF?((c*9/5)+32).toFixed(1)+'°F':c.toFixed(1)+'°C';

  // Bereken echte dag min/max uit de 24u-forecast (8 x 3u)
  let dayMin=999,dayMax=-999;
  const todayDate=new Date().toDateString();
  if(forecast&&forecast.list){
    forecast.list.forEach(item=>{
      const itemDate=new Date(item.dt*1000).toDateString();
      if(itemDate===todayDate){
        if(item.main.temp_min<dayMin)dayMin=item.main.temp_min;
        if(item.main.temp_max>dayMax)dayMax=item.main.temp_max;
      }
    });
    // Ook huidige min/max meenemen
    if(data.main.temp_min<dayMin)dayMin=data.main.temp_min;
    if(data.main.temp_max>dayMax)dayMax=data.main.temp_max;
  } else {
    dayMin=data.main.temp_min;dayMax=data.main.temp_max;
  }

  document.getElementById('weer-temp').innerText=toUnit(data.main.temp);
  document.getElementById('weer-feels').innerText=toUnit(data.main.feels_like);
  document.getElementById('weer-min').innerText=toUnit(dayMin);
  document.getElementById('weer-max').innerText=toUnit(dayMax);
  document.getElementById('weer-humid').innerText=data.main.humidity+'%';
  document.getElementById('weer-desc').innerText=data.weather[0].description;
  document.getElementById('weer-city').innerText=(data.name||'').toUpperCase();
  const iconEl=document.getElementById('weer-icon');
  iconEl.src='https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png';
  iconEl.style.display='block';
  const windKmh=data.wind.speed*3.6,bft=getBeaufort(windKmh);
  document.getElementById('weer-wind-speed').innerText=useF?(data.wind.speed*2.237).toFixed(1)+' mph':windKmh.toFixed(1)+' km/u';
  document.getElementById('weer-beaufort').innerText=bft.scale+' Bft';
  document.getElementById('weer-beaufort-desc').innerText=bft.desc[lang]||bft.desc.nl;
  document.getElementById('weer-pressure').innerText=data.main.pressure+' hPa';
  document.getElementById('weer-clouds').innerText=(data.clouds?.all||0)+'%';
  document.getElementById('weer-rain').innerText=data.rain?.['1h']?data.rain['1h'].toFixed(1)+' mm/u':t('no_rain');
  const locale=lang==='fr'?'fr-BE':lang==='en'?'en-GB':'nl-BE';
  document.getElementById('weer-sunrise').innerText=new Date(data.sys.sunrise*1000).toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
  document.getElementById('weer-sunset').innerText=new Date(data.sys.sunset*1000).toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
  document.getElementById('weer-updated').innerText=t('weer_updated')+' '+new Date().toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
  document.getElementById('weer-main').style.display='block';
}

// POI
function loadPOIs(){try{return JSON.parse(localStorage.getItem('zp_pois')||'[]');}catch(e){return[];}}
function savePOIs(pois){localStorage.setItem('zp_pois',JSON.stringify(pois));}
function poiAddCurrent(){
  if(lat===null){alert(t('poi_no_gps'));return;}
  const name=prompt(t('poi_name_prompt'),'');if(name===null)return;
  const poi={id:Date.now(),name:name.trim()||formatCoord(lat,lng),lat:lat,lng:lng,ele:lastAltitude,address:'',created:new Date().toISOString()};
  const pois=loadPOIs();pois.unshift(poi);savePOIs(pois);renderPOIs();poiFetchAddress(poi.id,lat,lng);
}
function poiFetchAddress(id,pLat,pLng){
  const card=document.querySelector('[data-poi-id="'+id+'"] .poi-address');if(card)card.innerText=t('poi_fetching');
  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+pLat+'&lon='+pLng+'&zoom=19&addressdetails=1',{headers:{'Accept-Language':SETTINGS.lang}})
  .then(r=>r.json()).then(d=>{
    const a=d.address||{};
    const street=a.road?(a.road+(a.house_number?' '+a.house_number:'')):null;
    const parts=[street,a.postcode,a.city||a.town||a.village,a.country].filter(Boolean);
    const addr=parts.join(', ')||d.display_name||'';
    const pois=loadPOIs(),poi=pois.find(p=>p.id===id);
    if(poi){poi.address=addr;savePOIs(pois);}if(card)card.innerText=addr;
  }).catch(()=>{if(card){card.innerText=navigator.onLine?t('gps_denied'):t('offline');card.style.color='var(--muted)';}});
}
function poiDelete(id){if(!confirm(t('poi_delete_confirm')))return;savePOIs(loadPOIs().filter(p=>p.id!==id));renderPOIs();}
function poiRename(id){
  const pois=loadPOIs(),poi=pois.find(p=>p.id===id);if(!poi)return;
  const name=prompt(t('poi_name_prompt'),poi.name);if(name===null)return;
  poi.name=name.trim()||poi.name;savePOIs(pois);renderPOIs();
}
function renderPOIs(){
  const pois=loadPOIs(),list=document.getElementById('poi-list'),
        empty=document.getElementById('poi-empty');
  if(!list) return;
  list.innerHTML='';

  // GPX knop tonen/verbergen op basis van aantal POIs
  const gpxBtn=document.getElementById('btn-gpx-export');
  if(gpxBtn) gpxBtn.style.display=pois.length>0?'':'none';

  if(pois.length===0){
    empty.style.display='block';
    // Toolbar verbergen en leegmaken
    const toolbar=document.getElementById('poi-toolbar-fixed');
    if(toolbar){toolbar.style.display='none';toolbar.innerHTML='';}
    return;
  }
  empty.style.display='none';

  // Actie toolbar — gebruik de vaste toolbar buiten de scrollzone
  let selectedId=null;
  const toolbar=document.getElementById('poi-toolbar-fixed');
  toolbar.innerHTML='';

  const btnRen=document.createElement('button');
  btnRen.style.cssText='flex:1;background:var(--dim-green);border:1px solid var(--green);color:var(--green);'+
    'font-family:\'Courier New\',monospace;font-size:0.62rem;padding:9px 4px;cursor:pointer;border-radius:2px;text-transform:uppercase;';
  btnRen.innerText='✏️ '+( SETTINGS.lang==='fr'?'Renommer':SETTINGS.lang==='en'?'Rename':'Hernoem');



  const btnDel=document.createElement('button');
  btnDel.style.cssText='flex:1;background:rgba(255,107,107,0.1);border:1px solid #ff6b6b;color:#ff8080;'+
    'font-family:\'Courier New\',monospace;font-size:0.62rem;padding:9px 4px;cursor:pointer;border-radius:2px;text-transform:uppercase;';
  btnDel.innerText='🗑 '+(SETTINGS.lang==='fr'?'Supprimer':SETTINGS.lang==='en'?'Delete':'Verwijder');

  const btnCancel=document.createElement('button');
  btnCancel.style.cssText='background:transparent;border:1px solid #333;color:var(--muted);'+
    'font-family:\'Courier New\',monospace;font-size:0.62rem;padding:9px 8px;cursor:pointer;border-radius:2px;';
  btnCancel.innerText='✕';

  toolbar.appendChild(btnRen);toolbar.appendChild(btnDel);toolbar.appendChild(btnCancel);
  function selectRow(id,rowEl){
    // Deselecteer vorige
    list.querySelectorAll('.poi-row').forEach(r=>{
      r.style.background='var(--panel)';
      r.style.borderColor='var(--border)';
    });
    if(selectedId===id){
      // Tweede tik = deselecteer
      selectedId=null;
      toolbar.style.display='none';
      return;
    }
    selectedId=id;
    rowEl.style.background='rgba(255,0,80,0.08)';
    rowEl.style.borderColor='#ff6b8a';
    toolbar.style.display='flex';
    toolbar.scrollIntoView({block:'nearest',behavior:'smooth'});
    // Koppel acties
    btnRen.onclick=()=>{ poiRename(selectedId); };

    btnDel.onclick=()=>{ poiDelete(selectedId); };
    btnCancel.onclick=()=>{
      selectedId=null;toolbar.style.display='none';
      list.querySelectorAll('.poi-row').forEach(r=>{
        r.style.background='var(--panel)';r.style.borderColor='var(--border)';
      });
    };
  }

  const locale=SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE';
  pois.forEach(poi=>{
    const date=new Date(poi.created).toLocaleDateString(locale,{day:'numeric',month:'short',year:'numeric'});
    const coordStr=formatCoord(poi.lat,poi.lng);
    const card=document.createElement('div');
    card.setAttribute('data-poi-id',poi.id);
    card.className='poi-row';
    card.style.cssText='background:var(--panel);border:1px solid var(--border);'+
      'border-left:3px solid #ff6b8a;border-radius:2px;padding:10px 12px;cursor:pointer;'+
      'transition:background 0.15s,border-color 0.15s;';
    card.innerHTML=
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">'+
        '<span style="font-size:1rem;">&#10084;&#65039;</span>'+
        '<span style="font-size:0.72rem;color:#fff;font-weight:bold;font-family:\'Courier New\',monospace;'+
          'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+poi.name+'</span>'+
      '</div>'+
      '<div style="font-size:0.6rem;color:var(--green);font-family:\'Courier New\',monospace;margin-bottom:2px;">'+coordStr+(poi.ele!=null?' · '+Math.round(poi.ele)+'m':'')+'</div>'+
      '<div class="poi-address" style="font-size:0.58rem;color:#bbb;font-style:italic;line-height:1.4;">'+(poi.address||'')+'</div>'+
      '<div style="font-size:0.52rem;color:#333;margin-top:3px;">'+date+'</div>';
    card.onclick=()=>selectRow(poi.id, card);
    card.addEventListener('touchstart',()=>{card.style.opacity='0.8';});
    card.addEventListener('touchend',()=>{card.style.opacity='1';});
    list.appendChild(card);
  });
}

function initPOIPage(){
  const pairs=[['lbl-poi-title','poi_title'],['lbl-poi-add-btn','poi_add'],['lbl-poi-empty','poi_empty'],['lbl-poi-hint','poi_hint']];
  pairs.forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.innerText=t(key);});
  renderPOIs();
}

// ZONNEKALENDER
const KAL_ORDER=[
  {key:'nadir',icon:'⚫',color:'#222233'},{key:'nightEnd',icon:'🌙',color:'#1a1a3a'},
  {key:'nauticalDawn',icon:'🌌',color:'#1a2a4a'},{key:'dawn',icon:'🌫️',color:'#2a3a5a'},
  {key:'sunrise',icon:'🌅',color:'#ff6a00'},{key:'sunriseEnd',icon:'🌄',color:'#ff9d2f'},
  {key:'goldenHourEnd',icon:'✨',color:'#cc8800'},{key:'solarNoon',icon:'☀️',color:'#ffdd00'},
  {key:'goldenHour',icon:'✨',color:'#cc8800'},{key:'sunsetStart',icon:'🌇',color:'#ff9d2f'},
  {key:'sunset',icon:'🌆',color:'#ff6a00'},{key:'dusk',icon:'🌫️',color:'#2a3a5a'},
  {key:'nauticalDusk',icon:'🌌',color:'#1a2a4a'},{key:'night',icon:'🌙',color:'#1a1a3a'},
];
function kalFmtDuration(totalMins){const u=Math.floor(totalMins/60),m=Math.round(totalMins%60);return u+' u '+String(m).padStart(2,'0')+' min';}
function kalFmtTime(date){const locale=SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE';return date.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit',hour12:SETTINGS.timeFormat==='12h'});}
function renderKalender(){
  const lbl=(id,key)=>{const el=document.getElementById(id);if(el)el.innerText=t(key);};
  lbl('lbl-kal-title','kalender_title');lbl('lbl-kal-daylen','kal_daylen');lbl('lbl-kal-nightlen','kal_nightlen');
  const noGps=document.getElementById('kal-no-gps'),list=document.getElementById('kal-list'),dateEl=document.getElementById('kal-date');
  if(lat===null){noGps.style.display='block';noGps.innerText=t('kal_no_gps');list.innerHTML='';return;}
  noGps.style.display='none';
  const now=new Date(),locale=SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE';
  dateEl.innerText=now.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  if(typeof SunCalc==='undefined'){list.innerHTML='<div style="color:#ff8080;font-size:0.65rem;padding:10px;">suncalc.js niet gevonden. Zorg dat suncalc.js in dezelfde map staat.</div>';return;}
  const times=SunCalc.getTimes(now,lat,lng);
  const events=t('kal_events')||{};
  const dayLen=(times.sunset-times.sunrise)/60000,nightLen=1440-dayLen;
  document.getElementById('kal-daylen').innerText=kalFmtDuration(dayLen);
  document.getElementById('kal-nightlen').innerText=kalFmtDuration(nightLen);
  const nowMs=now.getTime();list.innerHTML='';
  KAL_ORDER.forEach(evt=>{
    const time=times[evt.key];if(!time||isNaN(time.getTime()))return;
    const isPast=time.getTime()<nowMs,isCurrent=Math.abs(time.getTime()-nowMs)<30*60000;
    const label=events[evt.key]||evt.key,timeStr=kalFmtTime(time);
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:2px;border-left:3px solid '+evt.color+';background:'+(isCurrent?'rgba(255,157,47,0.10)':isPast?'rgba(255,255,255,0.02)':'var(--panel)')+';opacity:'+(isPast?'0.45':'1')+';';
    row.innerHTML='<div style="font-size:1.1rem;width:24px;text-align:center;flex-shrink:0;">'+evt.icon+'</div><div style="flex:1;min-width:0;"><div style="font-size:0.62rem;color:'+(isCurrent?'var(--gold)':'#aaa')+';font-family:\'Courier New\',monospace;font-weight:'+(isCurrent?'bold':'normal')+';">'+label+'</div></div><div style="font-size:'+(isCurrent?'0.85':'0.75')+'rem;color:'+(isCurrent?'var(--gold)':'#fff')+';font-weight:'+(isCurrent?'bold':'normal')+';font-family:\'Courier New\',monospace;font-variant-numeric:tabular-nums;flex-shrink:0;">'+timeStr+'</div>'+(isCurrent?'<div style="width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;"></div>':'');
    list.appendChild(row);
  });
}


// LEAFLET inline (cdn fallback — werkt ook online)
// Laad Leaflet dynamisch zodat het de app niet blokkeert
let leafletLoaded = false;
let leafletMap = null;
let leafletUserInteracted = false;
let leafletMarkerSelf = null;
let leafletMarkerHome = null;
let leafletLine = null;

function loadLeaflet(cb){
  if(leafletLoaded){ cb(); return; }
  // Leaflet CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  // Leaflet JS
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = ()=>{ leafletLoaded=true; cb(); };
  script.onerror = ()=>{ 
    document.getElementById('leaflet-map').innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.6rem;font-family:Courier New,monospace;">Kaart niet beschikbaar (geen verbinding)</div>';
  };
  document.head.appendChild(script);
}

// Haversine afstand in km
function haversineKm(lat1,lng1,lat2,lng2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// Richting in graden (0=N, 90=O, 180=Z, 270=W)
function bearingDeg(lat1,lng1,lat2,lng2){
  const dLng=(lng2-lng1)*Math.PI/180;
  const y=Math.sin(dLng)*Math.cos(lat2*Math.PI/180);
  const x=Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180)-Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos(dLng);
  const brng=(Math.atan2(y,x)*180/Math.PI+360)%360;
  return Math.round(brng);
}

// Graden naar kompasrichting
function degToCompass(deg){
  const dirs=['N','NNO','NO','ONO','O','OZO','ZO','ZZO','Z','ZZW','ZW','WZW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg/22.5)%16];
}

function initKaart(){
  // i18n labels
  const el=(id,key)=>{const e=document.getElementById(id);if(e)e.innerText=t(key);};
  el('lbl-kaart-title','kaart_title');el('lbl-kaart-dist','kaart_dist');
  el('lbl-kaart-bearing','kaart_bearing');el('lbl-kaart-home','kaart_home');
  el('lbl-kaart-you','kaart_you');

  if(lat===null){
    document.getElementById('kaart-no-gps').style.display='flex';
    return;
  }
  document.getElementById('kaart-no-gps').style.display='none';

  // Afstand + richting berekenen
  updateKaartInfo();

  // Reset interactie bij opnieuw openen — kaart mag hercentreren
  leafletUserInteracted = false;

  // Kaart laden
  loadLeaflet(()=>{
    const mapDiv = document.getElementById('leaflet-map');
    if(!mapDiv) return;

    if(leafletMap){
      // Kaart bestaat al — markers updaten, NIET hercentreren (gebruiker kiest zoom)
      updateKaartMarkers();
      leafletMap.invalidateSize();
      return;
    }

    // Nieuwe kaart aanmaken
    leafletMap = L.map('leaflet-map',{zoomControl:true,attributionControl:true}).setView([lat,lng],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'&copy; OpenStreetMap',
      maxZoom:19,
    }).addTo(leafletMap);

    // Track gebruikersinteractie — niet hercentreren als gebruiker zoomt/pant
    leafletMap.on('zoomstart movestart', function(e){
      if(e.originalEvent) leafletUserInteracted=true;
    });

    updateKaartMarkers();
    setTimeout(()=>leafletMap.invalidateSize(),200);
  });
}

function updateKaartMarkers(){
  if(!leafletMap||!window.L||lat===null) return;

  // Eigen positie marker (pulserende groene stip)
  const selfIcon = L.divIcon({
    className:'',
    html:'<div class="kaart-pulse"></div>',
    iconSize:[16,16],iconAnchor:[8,8],
  });

  if(leafletMarkerSelf){
    leafletMarkerSelf.setLatLng([lat,lng]);
    // Popup tekst bijwerken
    leafletMarkerSelf.setPopupContent('<b>'+t('kaart_you')+'</b><br>'+formatCoord(lat,lng));
  } else {
    leafletMarkerSelf = L.marker([lat,lng],{icon:selfIcon})
      .addTo(leafletMap)
      .bindPopup('<b>'+t('kaart_you')+'</b><br>'+formatCoord(lat,lng));
    // Eerste fix: centreer op positie
    leafletUserInteracted = false;
  }

  // Thuishaven marker
  const homeLat = SETTINGS.homeLat;
  const homeLng = SETTINGS.homeLng;

  if(homeLat && homeLng){
    const homeIcon = L.divIcon({
      className:'',
      html:'<div class="kaart-home-icon">⚓</div>',
      iconSize:[24,24],iconAnchor:[12,12],
    });
    if(leafletMarkerHome){
      leafletMarkerHome.setLatLng([homeLat,homeLng]);
    } else {
      leafletMarkerHome = L.marker([homeLat,homeLng],{icon:homeIcon})
        .addTo(leafletMap)
        .bindPopup('<b>'+t('kaart_home')+'</b><br>'+(SETTINGS.homePortName||''));
    }
    // Lijn bijwerken
    if(leafletLine) leafletLine.remove();
    leafletLine = L.polyline([[lat,lng],[homeLat,homeLng]],{
      color:'#4488ff',weight:2,opacity:0.6,dashArray:'6,4'
    }).addTo(leafletMap);
    // Alleen hercentreren als gebruiker nog niet heeft ingegrepen
    if(!leafletUserInteracted){
      leafletMap.fitBounds([[lat,lng],[homeLat,homeLng]],{padding:[30,30]});
    }
  } else {
    if(!leafletUserInteracted){
      leafletMap.setView([lat,lng],13);
    }
  }

  // Info paneel altijd updaten
  updateKaartInfo();
}

function updateKaartInfo(){
  const homeLat = SETTINGS.homeLat;
  const homeLng = SETTINGS.homeLng;
  const homeName = SETTINGS.homePortName || '--';

  document.getElementById('kaart-home-name').innerText = homeName;
  document.getElementById('kaart-coords').innerText = formatCoord(lat,lng);

  const noHomeMsg = document.getElementById('kaart-no-home-msg');

  if(!homeLat || !homeLng){
    document.getElementById('kaart-dist-val').innerText = '--';
    document.getElementById('kaart-bearing-val').innerText = '--';
    if(noHomeMsg){ noHomeMsg.style.display='block'; noHomeMsg.innerText=t('kaart_no_home')+' '+t('kaart_set_home'); }
    return;
  }
  if(noHomeMsg) noHomeMsg.style.display='none';

  const km = haversineKm(lat,lng,homeLat,homeLng);
  const brng = bearingDeg(lat,lng,homeLat,homeLng);
  const compass = degToCompass(brng);

  // Toon in km of mijlen
  if(SETTINGS.distUnit==='nm'){
    document.getElementById('kaart-dist-val').innerText = (km*0.539957).toFixed(1);
    document.getElementById('kaart-dist-unit').innerText = 'NM';
  } else {
    document.getElementById('kaart-dist-val').innerText = km<1?(km*1000).toFixed(0):km.toFixed(1);
    document.getElementById('kaart-dist-unit').innerText = km<1?'m':'km';
  }
  document.getElementById('kaart-bearing-val').innerText = brng+'° '+compass;
}





// ASTRONOMISCHE GEBEURTENISSEN
// Zonsverduisteringen 2025-2030 (NASA / Espenak tabel)
// ═══ VERDUISTERINGSTABELLEN — HYBRIDE SYSTEEM ══════════════════
// Ingebouwde tabel (2025-2034) — altijd offline beschikbaar (NASA/Espenak)
// Online: automatisch bijgewerkt via GitHub raw data (éénmaal per jaar)
// Data-URL: https://raw.githubusercontent.com/zorro7777777/zonnewijzer-PRO-V7/main/data/eclipses.json

const ECLIPSE_DATA_URL = 'https://raw.githubusercontent.com/zorro7777777/zonnewijzer-PRO-V10/main/eclipses.json';
const ECLIPSE_CACHE_KEY = 'zp_eclipses_v1';
const ECLIPSE_MAX_AGE   = 365 * 24 * 60 * 60 * 1000; // 1 jaar in ms

// Ingebouwde fallback tabel 2025-2034 (NASA/Espenak)
const SOLAR_ECLIPSES_BUILTIN = [
  {y:2025,m:3, d:29, h:10,mi:48, type:'partial_solar',  icon:'🌑', mag:0.938},
  {y:2025,m:9, d:21, h:19,mi:43, type:'partial_solar',  icon:'🌑', mag:0.855},
  {y:2026,m:2, d:17, h:12,mi:13, type:'annular_solar',  icon:'💍', mag:0.963},
  {y:2026,m:8, d:12, h:17,mi:47, type:'total_solar',    icon:'🌑', mag:1.039},
  {y:2027,m:2, d:6,  h:16,mi:0,  type:'annular_solar',  icon:'💍', mag:0.928},
  {y:2027,m:8, d:2,  h:10,mi:7,  type:'total_solar',    icon:'🌑', mag:1.079},
  {y:2028,m:1, d:26, h:15,mi:55, type:'annular_solar',  icon:'💍', mag:0.921},
  {y:2028,m:7, d:22, h:2, mi:56, type:'total_solar',    icon:'🌑', mag:1.057},
  {y:2029,m:1, d:14, h:17,mi:13, type:'partial_solar',  icon:'🌑', mag:0.871},
  {y:2029,m:6, d:12, h:4, mi:6,  type:'partial_solar',  icon:'🌑', mag:0.458},
  {y:2029,m:7, d:11, h:15,mi:37, type:'partial_solar',  icon:'🌑', mag:0.230},
  {y:2029,m:12,d:5,  h:15,mi:3,  type:'partial_solar',  icon:'🌑', mag:0.891},
  {y:2030,m:6, d:1,  h:6, mi:29, type:'annular_solar',  icon:'💍', mag:0.944},
  {y:2030,m:11,d:25, h:6, mi:51, type:'total_solar',    icon:'🌑', mag:1.047},
  {y:2031,m:5, d:21, h:7, mi:16, type:'annular_solar',  icon:'💍', mag:0.974},
  {y:2031,m:11,d:14, h:20,mi:7,  type:'partial_solar',  icon:'🌑', mag:0.900},
  {y:2032,m:4, d:28, h:15,mi:12, type:'annular_solar',  icon:'💍', mag:0.985},
  {y:2032,m:10,d:22, h:6, mi:47, type:'partial_solar',  icon:'🌑', mag:0.768},
  {y:2033,m:3, d:30, h:18,mi:2,  type:'total_solar',    icon:'🌑', mag:1.025},
  {y:2033,m:9, d:23, h:12,mi:55, type:'partial_solar',  icon:'🌑', mag:0.905},
  {y:2034,m:3, d:20, h:10,mi:18, type:'total_solar',    icon:'🌑', mag:1.005},
  {y:2034,m:9, d:12, h:15,mi:30, type:'annular_solar',  icon:'💍', mag:0.953},
];

const LUNAR_ECLIPSES_BUILTIN = [
  {y:2025,m:3, d:14, h:6, mi:59, type:'total_lunar',    icon:'🔴', mag:1.178},
  {y:2025,m:9, d:7,  h:18,mi:12, type:'total_lunar',    icon:'🔴', mag:1.361},
  {y:2026,m:3, d:3,  h:11,mi:34, type:'total_lunar',    icon:'🔴', mag:1.149},
  {y:2026,m:8, d:28, h:4, mi:14, type:'partial_lunar',  icon:'🌘', mag:0.934},
  {y:2027,m:2, d:20, h:23,mi:14, type:'penumbral_lunar',icon:'🌕', mag:0.048},
  {y:2027,m:7, d:18, h:16,mi:4,  type:'partial_lunar',  icon:'🌘', mag:0.434},
  {y:2027,m:8, d:17, h:7, mi:15, type:'partial_lunar',  icon:'🌘', mag:0.109},
  {y:2028,m:1, d:12, h:4, mi:14, type:'total_lunar',    icon:'🔴', mag:1.254},
  {y:2028,m:7, d:6,  h:18,mi:20, type:'partial_lunar',  icon:'🌘', mag:0.573},
  {y:2028,m:12,d:31, h:16,mi:53, type:'total_lunar',    icon:'🔴', mag:1.245},
  {y:2029,m:6, d:26, h:3, mi:23, type:'total_lunar',    icon:'🔴', mag:1.844},
  {y:2029,m:12,d:20, h:22,mi:43, type:'total_lunar',    icon:'🔴', mag:1.122},
  {y:2030,m:6, d:15, h:18,mi:34, type:'penumbral_lunar',icon:'🌕', mag:0.322},
  {y:2030,m:12,d:9,  h:22,mi:27, type:'total_lunar',    icon:'🔴', mag:1.203},
  {y:2031,m:5, d:7,  h:3, mi:51, type:'total_lunar',    icon:'🔴', mag:1.193},
  {y:2031,m:10,d:30, h:7, mi:44, type:'partial_lunar',  icon:'🌘', mag:0.309},
  {y:2032,m:4, d:25, h:15,mi:13, type:'total_lunar',    icon:'🔴', mag:1.185},
  {y:2032,m:10,d:18, h:19,mi:2,  type:'total_lunar',    icon:'🔴', mag:1.233},
  {y:2033,m:4, d:14, h:19,mi:12, type:'total_lunar',    icon:'🔴', mag:1.085},
  {y:2033,m:10,d:8,  h:10,mi:55, type:'partial_lunar',  icon:'🌘', mag:0.879},
  {y:2034,m:4, d:3,  h:18,mi:25, type:'penumbral_lunar',icon:'🌕', mag:0.225},
  {y:2034,m:9, d:28, h:2, mi:45, type:'total_lunar',    icon:'🔴', mag:1.338},
];

// Actieve tabellen (ingebouwd of bijgewerkt via GitHub)
let SOLAR_ECLIPSES = [...SOLAR_ECLIPSES_BUILTIN];
let LUNAR_ECLIPSES = [...LUNAR_ECLIPSES_BUILTIN];

// Haal bijgewerkte data op van GitHub (éénmaal per jaar)
async function fetchEclipseData(){
  try{
    const cached = localStorage.getItem(ECLIPSE_CACHE_KEY);
    if(cached){
      const obj = JSON.parse(cached);
      const age = Date.now() - obj.fetched;
      if(age < ECLIPSE_MAX_AGE){
        // Cache geldig — gebruik gecachede data
        SOLAR_ECLIPSES = obj.solar;
        LUNAR_ECLIPSES = obj.lunar;
        console.log('[Astro] Verduisteringsdata uit cache geladen ('+new Date(obj.fetched).getFullYear()+')');
        return;
      }
    }
    if(!navigator.onLine) return;
    const resp = await fetch(ECLIPSE_DATA_URL, {cache:'no-cache'});
    if(!resp.ok) throw new Error(resp.status);
    const data = await resp.json();
    if(data.solar && data.lunar){
      SOLAR_ECLIPSES = data.solar;
      LUNAR_ECLIPSES = data.lunar;
      localStorage.setItem(ECLIPSE_CACHE_KEY, JSON.stringify({
        solar:   data.solar,
        lunar:   data.lunar,
        fetched: Date.now(),
        version: data.version||'1.0'
      }));
      console.log('[Astro] Verduisteringsdata bijgewerkt van GitHub (versie '+( data.version||'?')+')');
    }
  } catch(e){
    console.log('[Astro] Gebruik ingebouwde tabel ('+SOLAR_ECLIPSES_BUILTIN.length+' zon / '+LUNAR_ECLIPSES_BUILTIN.length+' maan)');
  }
}

// Supermaan drempelwaarde: perigeum afstand maan < 362000 km
// Berekening perigeum via Meeus vereenvoudigd
function calcMoonDistance(jd){
  const T = (jd - 2451545.0)/36525;
  const D = (297.85036+445267.111480*T)*Math.PI/180;
  const M = (357.52772+35999.050340*T)*Math.PI/180;
  const Mp= (134.96298+477198.867398*T)*Math.PI/180;
  const F = (93.27191+483202.017538*T)*Math.PI/180;
  // Vereenvoudigde afstand in km
  const dist = 385000.56
    - 20905.355*Math.cos(Mp)
    -  3699.111*Math.cos(2*D-Mp)
    -  2955.968*Math.cos(2*D)
    -   569.925*Math.cos(2*Mp)
    +    246.158*Math.cos(2*D+Mp)
    +    204.586*Math.cos(M)
    -    170.733*Math.cos(2*D+M)
    -    152.138*Math.cos(2*D-M-Mp)
    -    129.620*Math.cos(Mp-M)
    +    108.743*Math.cos(2*D+2*Mp);
  return dist;
}

function calcAstroEvents(yearStart, yearEnd){
  const events = [];
  const now = new Date();

  // Maangebeurtenissen: supermaan, micromaan, blauwe maan per jaar
  for(let yr = yearStart; yr <= yearEnd; yr++){
    const fms = calcFullMoons(yr);
    // Blauwe maan
    const byMo = {};
    fms.forEach(d=>{ const mo=d.getMonth(); if(!byMo[mo]) byMo[mo]=[]; byMo[mo].push(d); });
    Object.values(byMo).forEach(arr=>{
      if(arr.length>=2){
        events.push({date:arr[1], type:'blue_moon', icon:'🔵', km:null, mag:null});
      }
    });
    // Supermaan / Micromaan
    fms.forEach(d=>{
      const jd = julianDay(d);
      const km = calcMoonDistance(jd);
      if(km < 362000){
        events.push({date:d, type:'supermoon', icon:'🌕', km:Math.round(km), mag:null});
      } else if(km > 404000){
        events.push({date:d, type:'micromoon', icon:'🌑', km:Math.round(km), mag:null});
      }
    });
  }

  // Voeg zonsverduisteringen toe
  SOLAR_ECLIPSES.forEach(e=>{
    if(e.y >= yearStart && e.y <= yearEnd){
      const d = new Date(Date.UTC(e.y,e.m-1,e.d,e.h,e.mi));
      events.push({date:d, type:e.type, icon:e.icon, km:null, mag:e.mag});
    }
  });

  // Voeg maansverduisteringen toe
  LUNAR_ECLIPSES.forEach(e=>{
    if(e.y >= yearStart && e.y <= yearEnd){
      const d = new Date(Date.UTC(e.y,e.m-1,e.d,e.h,e.mi));
      // Totale maansverduistering = ook Rode Maan / Blood Moon
      const type = e.type==='total_lunar'?'blood_moon':e.type;
      const icon = e.type==='total_lunar'?'🔴':e.icon;
      events.push({date:d, type:type, icon:icon, km:null, mag:e.mag});
    }
  });

  // Sorteer chronologisch
  events.sort((a,b)=>a.date-b.date);
  return events;
}

function astroTypeColor(type){
  const map = {
    supermoon:'#ff9d2f', micromoon:'#555566',
    blood_moon:'#ff2222', total_lunar:'#ff4444',
    partial_lunar:'#ff8844', penumbral_lunar:'#886644',
    total_solar:'#ffdd00', annular_solar:'#ff9922',
    partial_solar:'#cc8833', hybrid_solar:'#ffcc00',
    blue_moon:'#4488ff',
  };
  return map[type]||'#666';
}

function renderAstro(){
  const titleEl = document.getElementById('lbl-astro-title');
  if(titleEl) titleEl.innerText = t('astro_title');

  // Haal bijgewerkte data op (async, op achtergrond)
  fetchEclipseData().then(()=>{
    if(document.getElementById('view-astro')?.classList.contains('active')){
      _renderAstroList();
    }
  });
  _renderAstroList();
}

function _renderAstroList(){
  const now    = new Date();
  const yr     = now.getFullYear();
  const yrEnd  = yr + 4;
  const locale = SETTINGS.lang==='fr'?'fr-BE':SETTINGS.lang==='en'?'en-GB':'nl-BE';

  const yearEl = document.getElementById('astro-year-range');
  if(yearEl) yearEl.innerText = yr+' – '+yrEnd;

  const list = document.getElementById('astro-list');
  if(!list) return;
  list.innerHTML = '';

  const events = calcAstroEvents(yr, yrEnd);
  let lastYear = null;

  events.forEach(ev=>{
    const isPast = ev.date < now;
    const isToday = ev.date.toDateString()===now.toDateString();
    const color   = astroTypeColor(ev.type);
    const label   = t('astro_'+ev.type)||ev.type;
    const evYear  = ev.date.getFullYear();

    // Jaar-separator
    if(evYear !== lastYear){
      lastYear = evYear;
      const sep = document.createElement('div');
      sep.style.cssText = 'font-size:0.55rem;color:var(--green);font-weight:bold;'+
        'text-transform:uppercase;letter-spacing:2px;padding:6px 0 2px;'+
        'border-bottom:1px solid var(--border);margin-top:4px;';
      sep.innerText = evYear;
      list.appendChild(sep);
    }

    const row = document.createElement('div');
    row.style.cssText =
      'display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:2px;'+
      'background:'+(isToday?'rgba(255,157,47,0.10)':isPast?'rgba(0,0,0,0)':'var(--panel)')+';'+
      'border:1px solid '+(isToday?'var(--gold)':isPast?'#1a1a1a':'var(--border)')+';'+
      'border-left:3px solid '+(isPast?'#333':color)+';'+
      'opacity:'+(isPast?'0.38':'1')+';';

    // Icoon
    const ic = document.createElement('div');
    ic.style.cssText = 'font-size:1.4rem;width:30px;text-align:center;flex-shrink:0;';
    ic.innerText = ev.icon;

    // Midden: type + detail
    const mid = document.createElement('div');
    mid.style.cssText = 'flex:1;min-width:0;';
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:0.68rem;font-weight:bold;font-family:\'Courier New\',monospace;'+
      'color:'+(isPast?'#555':color)+';text-transform:uppercase;letter-spacing:0.5px;';
    lbl.innerText = label;
    const det = document.createElement('div');
    det.style.cssText = 'font-size:0.54rem;color:'+(isPast?'#333':'var(--muted)')+';margin-top:2px;';
    const details = [];
    if(ev.km) details.push(Math.round(ev.km/1000)*1000+' km');
    if(ev.mag) details.push('mag '+ev.mag.toFixed(3));
    det.innerText = details.join(' · ');
    mid.appendChild(lbl);
    if(details.length) mid.appendChild(det);

    // Rechts: datum + tijd
    const right = document.createElement('div');
    right.style.cssText = 'text-align:right;flex-shrink:0;';
    const dateStr = document.createElement('div');
    dateStr.style.cssText = 'font-size:0.68rem;font-weight:bold;'+
      'color:'+(isPast?'#444':'#aaa')+';font-family:\'Courier New\',monospace;';
    const d = ev.date;
    const dayN = String(d.getUTCDate()).padStart(2,'0');
    const mo   = d.toLocaleDateString(locale,{month:'short',timeZone:'UTC'});
    dateStr.innerText = dayN+' '+mo;
    const timeStr = document.createElement('div');
    timeStr.style.cssText = 'font-size:0.52rem;color:'+(isPast?'#333':'#555')+';margin-top:1px;';
    const hh = String(d.getUTCHours()).padStart(2,'0');
    const mm = String(d.getUTCMinutes()).padStart(2,'0');
    timeStr.innerText = hh+':'+mm+' UTC';
    right.appendChild(dateStr);
    right.appendChild(timeStr);

    row.appendChild(ic);row.appendChild(mid);row.appendChild(right);
    list.appendChild(row);
  });

  // Scroll naar eerste toekomstige gebeurtenis
  setTimeout(()=>{
    const rows = list.querySelectorAll('div[style*="var(--panel)"]');
    if(rows.length>0) rows[0].scrollIntoView({block:'center',behavior:'smooth'});
  }, 120);
} // einde _renderAstroList

// DEEL LOCATIE
let delenAddress = '';
let delenFetching = false;

function buildMapsUrl(pLat, pLng){
  return 'https://www.google.com/maps?q='+pLat.toFixed(7)+','+pLng.toFixed(7)+'&z=18';
}

function buildShareText(pLat, pLng, addr){
  const lang = SETTINGS.lang;
  const label = lang==='fr'?'Ma position':lang==='en'?'My location':'Mijn locatie';
  const coordStr = formatCoord(pLat, pLng);
  const url = buildMapsUrl(pLat, pLng);
  let txt = label+':\n';
  if(addr) txt += addr+'\n';
  txt += coordStr+'\n';
  txt += url;
  return txt;
}

function initDelen(){
  // i18n labels
  const pairs = [
    ['lbl-delen-title','delen_title'],['lbl-delen-addr-lbl','delen_address_lbl'],
    ['lbl-delen-coords','delen_coords'],['lbl-delen-acc','delen_accuracy'],
    ['lbl-delen-open-maps','delen_open_maps'],
    ['lbl-delen-share-btn','delen_share_btn'],['lbl-delen-copy-btn','delen_copy_btn'],
  ];
  pairs.forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.innerText=t(key);});

  const noGps  = document.getElementById('delen-no-gps');
  const info   = document.getElementById('delen-info');

  if(lat===null){
    noGps.style.display='block';
    noGps.innerText=t('delen_no_gps');
    info.style.display='none';
    return;
  }
  noGps.style.display='none';
  info.style.display='flex';

  // Coordinaten tonen
  const coordEl = document.getElementById('delen-coords-val');
  if(coordEl){
    // Altijd beide formaten tonen voor duidelijkheid
    const dd = lat.toFixed(7)+'N\n'+lng.toFixed(7)+'E';
    coordEl.innerText = dd;
  }

  // Nauwkeurigheid
  const accEl = document.getElementById('delen-acc-val');
  if(accEl){
    accEl.innerText = Math.round(lastAccuracy)+' m';
    accEl.style.color = lastAccuracy<25?'var(--green)':lastAccuracy<100?'orange':'#ff8080';
  }

  // Google Maps URL
  const url = buildMapsUrl(lat, lng);
  const urlEl = document.getElementById('delen-maps-url');
  if(urlEl) urlEl.innerText = url;

  // Adres ophalen via Nominatim zoom 19
  const addrEl = document.getElementById('delen-address');
  if(addrEl){
    addrEl.innerText = t('delen_address');
    addrEl.style.fontStyle='italic';
    addrEl.style.color='#888';
  }
  if(!delenFetching){
    delenFetching = true;
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng+'&zoom=19&addressdetails=1',
      {headers:{'Accept-Language':SETTINGS.lang==='fr'?'fr':SETTINGS.lang==='en'?'en':'nl'}})
    .then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(d=>{
      const a = d.address||{};
      const parts = [
        a.house_number&&a.road ? a.road+' '+a.house_number : a.road,
        a.postcode,
        a.city||a.town||a.village||a.municipality,
        a.country
      ].filter(Boolean);
      delenAddress = parts.join(', ')||d.display_name||'';
      if(addrEl){
        addrEl.innerText = delenAddress||'--';
        addrEl.style.fontStyle = delenAddress?'normal':'italic';
        addrEl.style.color = '#ccc';
      }
    })
    .catch(()=>{
      if(addrEl){
        addrEl.innerText = navigator.onLine ? t('gps_denied') : t('offline');
        addrEl.style.fontStyle='italic';
        addrEl.style.color='var(--muted)';
      }
    })
    .finally(()=>{ delenFetching=false; });
  }
}

function delenOpenMaps(){
  const url = buildMapsUrl(lat, lng);
  window.open(url, '_blank');
}

function delenShare(){
  if(lat===null) return;
  const text = buildShareText(lat, lng, delenAddress);
  const url  = buildMapsUrl(lat, lng);
  if(navigator.share){
    navigator.share({
      title: t('delen_share_text'),
      text:  text,
    }).catch(()=>{});
  } else {
    // Fallback: kopieer naar klembord
    delenCopy();
  }
}

function delenCopy(){
  if(lat===null) return;
  const text = buildShareText(lat, lng, delenAddress);
  const btn  = document.getElementById('btn-delen-copy');
  const lbl  = document.getElementById('lbl-delen-copy-btn');
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(()=>{
      if(lbl){ lbl.innerText=t('delen_copied'); }
      if(btn){ btn.style.borderColor='var(--green)';btn.style.color='var(--green)'; }
      setTimeout(()=>{
        if(lbl) lbl.innerText=t('delen_copy_btn');
        if(btn){ btn.style.borderColor='var(--blue)';btn.style.color='var(--blue)'; }
      },2000);
    }).catch(()=>{});
  }
}

// VOLLE MANEN
// Berekening via astronomische formule (Jean Meeus)
function calcFullMoons(year){
  const results = [];
  // Itereer over alle maancycli in het jaar
  // Gemiddelde maanperiode: 29.53058868 dagen
  // Referentie: nieuwe maan op 6 januari 2000 18:14 UTC = JDE 2451550.1
  const JDE_REF = 2451550.09766; // nieuwe maan referentie (J2000)
  const SYNODIC = 29.53058868;

  // Vind eerste k zodanig dat JDE >= 1 jan jaar
  const jde_start = julianDay(new Date(year,0,1));
  const jde_end   = julianDay(new Date(year,11,31));
  let k0 = Math.floor((jde_start - JDE_REF) / SYNODIC);

  for(let k = k0 - 1; k <= k0 + 15; k++){
    // Volle maan = k + 0.5
    const kfull = k + 0.5;
    const T = kfull / 1236.85; // Julian centuries
    let JDE = JDE_REF + SYNODIC * kfull;

    // Correcties (Meeus Ch.47)
    const M  = (2.5534 + 29.1053567 * kfull) * Math.PI / 180;
    const Mp = (201.5643 + 385.81693528 * kfull) * Math.PI / 180;
    const F  = (160.7108 + 390.67050284 * kfull) * Math.PI / 180;
    const O  = (124.7746 -  1.56375588 * kfull) * Math.PI / 180;

    JDE += -0.40614*Math.sin(Mp)
           +0.17302*Math.sin(M)
           +0.01614*Math.sin(2*Mp)
           +0.01043*Math.sin(2*F)
           +0.00734*Math.sin(Mp-M)
           -0.00515*Math.sin(Mp+M)
           +0.00209*Math.sin(2*M)
           -0.00111*Math.sin(Mp-2*F)
           -0.00057*Math.sin(Mp+2*F)
           +0.00056*Math.sin(2*Mp+M)
           -0.00042*Math.sin(3*Mp)
           +0.00042*Math.sin(M+2*F)
           +0.00038*Math.sin(M-2*F)
           -0.00024*Math.sin(2*Mp-M)
           -0.00017*Math.sin(O)
           -0.00007*Math.sin(Mp+2*M);

    const d = julianToDate(JDE);
    if(d.getFullYear() === year){
      results.push(d);
    }
  }
  // Sorteer en ontdubbel (max 1 per maand tonen)
  results.sort((a,b)=>a-b);
  return results;
}

function julianDay(date){
  const y=date.getUTCFullYear(),m=date.getUTCMonth()+1,d=date.getUTCDate();
  const A=Math.floor(y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;
}

function julianToDate(jd){
  const z=Math.floor(jd+0.5),f=(jd+0.5)-z;
  let A=z;
  if(z>=2299161){const al=Math.floor((z-1867216.25)/36524.25);A=z+1+al-Math.floor(al/4);}
  const B=A+1524,C=Math.floor((B-122.1)/365.25),D=Math.floor(365.25*C),E=Math.floor((B-D)/30.6001);
  const day=B-D-Math.floor(30.6001*E)+(f);
  const month=E<14?E-1:E-13;
  const year=month>2?C-4716:C-4715;
  const dayFrac=day-Math.floor(day);
  const hours=dayFrac*24;
  return new Date(Date.UTC(year,month-1,Math.floor(day),Math.round(hours)));
}

function renderFullMoon(){
  const titleEl=document.getElementById('lbl-fullmoon-title');
  if(titleEl)titleEl.innerText=t('fullmoon_title');

  const now   = new Date();
  const year  = now.getFullYear();
  const curMo = now.getMonth(); // 0-11
  const lang  = SETTINGS.lang;
  const months = t('months');
  const locale = lang==='fr'?'fr-BE':lang==='en'?'en-GB':'nl-BE';

  // Jaar label
  const yearEl = document.getElementById('lbl-fullmoon-year');
  if(yearEl) yearEl.innerText = t('fullmoon_year')+' '+year;

  const list = document.getElementById('fullmoon-list');
  if(!list) return;
  list.innerHTML = '';

  const fullmoons = calcFullMoons(year);

  // Groepeer per kalendermaand (neem de eerste volle maan per maand)
  const byMonth = {};
  fullmoons.forEach(d => {
    const mo = d.getMonth();
    if(!byMonth[mo]) byMonth[mo] = d;
  });

  // Toon jan-dec
  for(let mo=0; mo<12; mo++){
    const fm    = byMonth[mo];
    const isCur = mo === curMo;
    const isPast= mo < curMo || (mo===curMo && fm && fm < now);

    const row = document.createElement('div');
    row.style.cssText =
      'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:2px;'+
      'background:'+(isCur?'rgba(255,255,255,0.06)':'var(--panel)')+';'+
      'border:1px solid '+(isCur?'rgba(255,255,255,0.25)':'var(--border)')+';'+
      'border-left:3px solid '+(isCur?'#fff':isPast?'#333':'#444')+';'+
      'opacity:'+(isPast&&!isCur?'0.4':'1')+';';

    // Maan-icoon
    const icon = document.createElement('div');
    icon.style.cssText = 'font-size:1.6rem;width:32px;text-align:center;flex-shrink:0;';
    icon.innerText = isCur ? '\uD83C\uDF15' : (isPast ? '\uD83C\uDF11' : '\uD83C\uDF15');

    // Maandnaam
    const left = document.createElement('div');
    left.style.cssText = 'flex:1;min-width:0;';
    const mnm = document.createElement('div');
    mnm.style.cssText =
      'font-size:0.72rem;font-weight:bold;font-family:\'Courier New\',monospace;'+
      'text-transform:uppercase;letter-spacing:1px;'+
      'color:'+(isCur?'#fff':isPast?'#555':'#aaa')+';';
    mnm.innerText = months[mo]||'';

    // Badge HUIDIG of VOORBIJ
    const badgeRow = document.createElement('div');
    badgeRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:1px;';
    badgeRow.appendChild(mnm);
    if(isCur){
      const badge = document.createElement('span');
      badge.style.cssText = 'font-size:0.46rem;background:#fff;color:#000;padding:1px 5px;border-radius:2px;font-weight:bold;font-family:\'Courier New\',monospace;';
      badge.innerText = lang==='fr'?'CE MOIS':lang==='en'?'THIS MONTH':'DEZE MAAND';
      badgeRow.appendChild(badge);
    }
    left.appendChild(badgeRow);

    // Datum volle maan
    const right = document.createElement('div');
    right.style.cssText = 'text-align:right;flex-shrink:0;';
    if(fm){
      const datStr = document.createElement('div');
      datStr.style.cssText =
        'font-size:'+(isCur?'1.1':'0.85')+'rem;font-weight:'+(isCur?'bold':'normal')+';'+
        'color:'+(isCur?'#fff':isPast?'#555':'#aaa')+';font-family:\'Courier New\',monospace;'+
        'font-variant-numeric:tabular-nums;';
      // Dag + dag van de week
      const dow = fm.toLocaleDateString(locale,{weekday:'short'});
      const dayN = fm.getUTCDate();
      datStr.innerText = dayN+' '+dow;

      // UTC tijd
      const timeStr = document.createElement('div');
      timeStr.style.cssText = 'font-size:0.54rem;color:'+(isCur?'#aaa':'#444')+';margin-top:1px;';
      const hh=String(fm.getUTCHours()).padStart(2,'0');
      const mm=String(fm.getUTCMinutes()).padStart(2,'0');
      timeStr.innerText = hh+':'+mm+' UTC';

      right.appendChild(datStr);
      right.appendChild(timeStr);
    } else {
      // Blauwe maan maand heeft 2 volle manen — geef beide aan
      const none = document.createElement('div');
      none.style.cssText = 'font-size:0.6rem;color:#444;';
      none.innerText = '--';
      right.appendChild(none);
    }

    row.appendChild(icon);row.appendChild(left);row.appendChild(right);
    list.appendChild(row);
  }

  // Controleer op blauwe maan (maand met 2 volle manen)
  const counts = {};
  fullmoons.forEach(d=>{ const mo=d.getMonth(); counts[mo]=(counts[mo]||0)+1; });
  Object.keys(counts).forEach(mo=>{
    if(counts[mo]>=2){
      const moIdx = parseInt(mo);
      // Voeg blauwe maan rij toe na die maand
      const blue = document.createElement('div');
      blue.style.cssText =
        'display:flex;align-items:center;gap:12px;padding:8px 12px;border-radius:2px;'+
        'background:rgba(68,136,255,0.08);border:1px solid var(--blue);border-left:3px solid var(--blue);';
      const bi = document.createElement('div');
      bi.style.cssText='font-size:1.4rem;width:32px;text-align:center;flex-shrink:0;';
      bi.innerText='\uD83C\uDF15';
      const bt = document.createElement('div');
      bt.style.cssText='flex:1;font-size:0.65rem;color:var(--blue);font-weight:bold;font-family:\'Courier New\',monospace;text-transform:uppercase;';
      bt.innerText=lang==='fr'?'Lune Bleue \u2014 '+(months[moIdx]||''):
                   lang==='en'?'Blue Moon \u2014 '+(months[moIdx]||''):
                                'Blauwe Maan \u2014 '+(months[moIdx]||'');
      // 2e volle maan datum
      const second = fullmoons.filter(d=>d.getMonth()===moIdx)[1];
      if(second){
        const bd = document.createElement('div');
        bd.style.cssText='font-size:0.8rem;color:var(--blue);font-weight:bold;font-family:\'Courier New\',monospace;';
        bd.innerText=second.getUTCDate()+' '+second.toLocaleDateString(locale,{weekday:'short'});
        const btime = document.createElement('div');
        btime.style.cssText='font-size:0.52rem;color:#4466aa;margin-top:1px;';
        btime.innerText=String(second.getUTCHours()).padStart(2,'0')+':'+String(second.getUTCMinutes()).padStart(2,'0')+' UTC';
        const bright = document.createElement('div');
        bright.style.cssText='text-align:right;flex-shrink:0;';
        bright.appendChild(bd);bright.appendChild(btime);
        blue.appendChild(bi);blue.appendChild(bt);blue.appendChild(bright);
      } else {
        blue.appendChild(bi);blue.appendChild(bt);
      }
      // Voeg toe na de maandrij
      const rows = list.children;
      if(rows[moIdx+1]) list.insertBefore(blue, rows[moIdx+1]);
      else list.appendChild(blue);
    }
  });

  // Scroll naar huidige maand
  setTimeout(()=>{
    const items = list.querySelectorAll('div');
    for(let el of items){
      if(el.style.borderLeftColor==='rgb(255, 255, 255)'){
        el.scrollIntoView({block:'center',behavior:'smooth'});
        break;
      }
    }
  }, 100);
}

// STERRENBEELDEN
const ZODIAC = [
  {sym:'♈',nl:'Ram',       en:'Aries',      fr:'Bélier',      m1:3, d1:21, m2:4,  d2:19, elem:'fire',  planet:{nl:'Mars',     en:'Mars',    fr:'Mars'},     color:'#ff4444'},
  {sym:'♉',nl:'Stier',     en:'Taurus',     fr:'Taureau',     m1:4, d1:20, m2:5,  d2:20, elem:'earth', planet:{nl:'Venus',    en:'Venus',   fr:'Vénus'},    color:'#44bb44'},
  {sym:'♊',nl:'Tweelingen',en:'Gemini',     fr:'Gémeaux',     m1:5, d1:21, m2:6,  d2:20, elem:'air',   planet:{nl:'Mercurius',en:'Mercury', fr:'Mercure'},  color:'#ffcc00'},
  {sym:'♋',nl:'Kreeft',    en:'Cancer',     fr:'Cancer',      m1:6, d1:21, m2:7,  d2:22, elem:'water', planet:{nl:'Maan',     en:'Moon',    fr:'Lune'},     color:'#4488ff'},
  {sym:'♌',nl:'Leeuw',     en:'Leo',        fr:'Lion',        m1:7, d1:23, m2:8,  d2:22, elem:'fire',  planet:{nl:'Zon',      en:'Sun',     fr:'Soleil'},   color:'#ff9d2f'},
  {sym:'♍',nl:'Maagd',     en:'Virgo',      fr:'Vierge',      m1:8, d1:23, m2:9,  d2:22, elem:'earth', planet:{nl:'Mercurius',en:'Mercury', fr:'Mercure'},  color:'#44bb44'},
  {sym:'♎',nl:'Weegschaal',en:'Libra',      fr:'Balance',     m1:9, d1:23, m2:10, d2:22, elem:'air',   planet:{nl:'Venus',    en:'Venus',   fr:'Vénus'},    color:'#ffcc00'},
  {sym:'♏',nl:'Schorpioen',en:'Scorpio',    fr:'Scorpion',    m1:10,d1:23, m2:11, d2:21, elem:'water', planet:{nl:'Pluto',    en:'Pluto',   fr:'Pluton'},   color:'#cc44cc'},
  {sym:'♐',nl:'Boogschutter',en:'Sagittarius',fr:'Sagittaire',m1:11,d1:22, m2:12, d2:21, elem:'fire',  planet:{nl:'Jupiter',  en:'Jupiter', fr:'Jupiter'},  color:'#ff4444'},
  {sym:'♑',nl:'Steenbok',  en:'Capricorn',  fr:'Capricorne',  m1:12,d1:22, m2:1,  d2:19, elem:'earth', planet:{nl:'Saturnus', en:'Saturn',  fr:'Saturne'},  color:'#44bb44'},
  {sym:'♒',nl:'Waterman',  en:'Aquarius',   fr:'Verseau',     m1:1, d1:20, m2:2,  d2:18, elem:'air',   planet:{nl:'Uranus',   en:'Uranus',  fr:'Uranus'},   color:'#ffcc00'},
  {sym:'♓',nl:'Vissen',    en:'Pisces',     fr:'Poissons',    m1:2, d1:19, m2:3,  d2:20, elem:'water', planet:{nl:'Neptunus', en:'Neptune', fr:'Neptune'},  color:'#4488ff'},
];

function getElemLabel(elem){
  const map={fire:'elem_fire',earth:'elem_earth',air:'elem_air',water:'elem_water'};
  return t(map[elem]||elem);
}

function getElemIcon(elem){
  return {fire:'🔥',earth:'🌍',air:'💨',water:'💧'}[elem]||'';
}

function getZodiacForDate(mo, day){
  return ZODIAC.find(z=>{
    if(z.m1 < z.m2){
      return (mo===z.m1&&day>=z.d1)||(mo===z.m2&&day<=z.d2);
    } else {
      // Steenbok: dec 22 - jan 19 (overschrijdt jaargrens)
      return (mo===z.m1&&day>=z.d1)||(mo===z.m2&&day<=z.d2);
    }
  });
}

function zodiacDateStr(z){
  const lang = SETTINGS.lang;
  const mnl=['','jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const men=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mfr=['','jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  const mn = lang==='fr'?mfr:lang==='en'?men:mnl;
  return z.d1+' '+mn[z.m1]+' – '+z.d2+' '+mn[z.m2];
}

function renderSterren(){
  const titleEl=document.getElementById('lbl-sterren-title');
  if(titleEl)titleEl.innerText=t('sterren_title');
  const todayEl=document.getElementById('lbl-sterren-today');
  if(todayEl)todayEl.innerText=t('sterren_today');

  const now=new Date(),mo=now.getMonth()+1,day=now.getDate();
  const current=getZodiacForDate(mo,day);
  const lang=SETTINGS.lang;
  const mono="'Courier New',monospace";

  // Banner huidig sterrenbeeld
  const banner=document.getElementById('sterren-current');
  if(banner&&current){
    const name=(current[lang]||current.nl).toUpperCase();
    const planet=current.planet[lang]||current.planet.nl;
    banner.style.borderLeftColor=current.color;
    banner.innerHTML='';
    const sym=document.createElement('div');
    sym.style.cssText='font-size:2.8rem;line-height:1;margin-bottom:6px;';
    sym.innerText=current.sym;
    const nm=document.createElement('div');
    nm.style.cssText='font-size:1.0rem;color:var(--gold);font-weight:bold;font-family:'+mono+';letter-spacing:2px;';
    nm.innerText=name;
    const dt=document.createElement('div');
    dt.style.cssText='font-size:0.62rem;color:#aaa;margin-top:4px;';
    dt.innerText=zodiacDateStr(current);
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:center;gap:16px;margin-top:8px;';
    const el=document.createElement('div');
    el.style.cssText='font-size:0.6rem;color:'+current.color+';';
    el.innerText=getElemIcon(current.elem)+' '+getElemLabel(current.elem);
    const pl=document.createElement('div');
    pl.style.cssText='font-size:0.6rem;color:var(--muted);';
    pl.innerText='\u2677 '+planet;
    row.appendChild(el);row.appendChild(pl);
    banner.appendChild(sym);banner.appendChild(nm);banner.appendChild(dt);banner.appendChild(row);
  }

  // Lijst alle 12
  const list=document.getElementById('sterren-list');
  if(!list)return;
  list.innerHTML='';

  ZODIAC.forEach(z=>{
    const isCurrent=(z===current);
    const name=z[lang]||z.nl;
    const planet=z.planet[lang]||z.planet.nl;
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:2px;'+
      'background:'+(isCurrent?'rgba(255,157,47,0.08)':'var(--panel)')+';'+
      'border:1px solid '+(isCurrent?'var(--gold)':'var(--border)')+';'+
      'border-left:3px solid '+z.color+';';

    // Symbool
    const symDiv=document.createElement('div');
    symDiv.style.cssText='font-size:1.6rem;width:32px;text-align:center;flex-shrink:0;';
    symDiv.innerText=z.sym;

    // Midden: naam + datum
    const mid=document.createElement('div');
    mid.style.cssText='flex:1;min-width:0;';

    const nameRow=document.createElement('div');
    nameRow.style.cssText='display:flex;align-items:center;gap:6px;';
    const nameEl=document.createElement('span');
    nameEl.style.cssText='font-size:0.72rem;color:'+(isCurrent?'var(--gold)':'#fff')+
      ';font-weight:bold;font-family:'+mono+';text-transform:uppercase;letter-spacing:1px;';
    nameEl.innerText=name;
    nameRow.appendChild(nameEl);
    if(isCurrent){
      const badge=document.createElement('span');
      badge.style.cssText='font-size:0.48rem;background:var(--gold);color:#000;padding:1px 5px;border-radius:2px;font-weight:bold;font-family:'+mono+';';
      badge.innerText='NU';
      nameRow.appendChild(badge);
    }
    const dateEl=document.createElement('div');
    dateEl.style.cssText='font-size:0.58rem;color:var(--muted);margin-top:2px;';
    dateEl.innerText=zodiacDateStr(z);
    mid.appendChild(nameRow);mid.appendChild(dateEl);

    // Rechts: element + planeet
    const right=document.createElement('div');
    right.style.cssText='text-align:right;flex-shrink:0;';
    const elemDiv=document.createElement('div');
    elemDiv.style.cssText='font-size:0.62rem;color:'+z.color+';';
    elemDiv.innerText=getElemIcon(z.elem)+' '+getElemLabel(z.elem);
    const planDiv=document.createElement('div');
    planDiv.style.cssText='font-size:0.56rem;color:var(--muted);margin-top:2px;';
    planDiv.innerText='\u2677 '+planet;
    right.appendChild(elemDiv);right.appendChild(planDiv);

    row.appendChild(symDiv);row.appendChild(mid);row.appendChild(right);
    list.appendChild(row);
  });
}

// SERVICE WORKER
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').then(r=>console.log('[SW]',r.scope)).catch(e=>console.warn('[SW]',e));});}

// INIT
window.addEventListener('DOMContentLoaded',()=>{
  arcCanvas=document.getElementById('arc-canvas');

  // Online/offline detectie
  function updateOnlineStatus(){
    const banner=document.getElementById('offline-banner');
    if(!banner) return;
    if(!navigator.onLine){
      banner.style.display='block';
      banner.innerText='⚠ '+t('offline').toUpperCase();
    } else {
      banner.style.display='none';
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  arcCtx=arcCanvas.getContext('2d');
  loadSettings();applyI18n();rebuildFavBar();rebuildLauncher();resizeArc();update();
  if(!navigator.geolocation){document.getElementById('coords-display').innerText=t('gps_unavailable');}
  else{navigator.geolocation.watchPosition(onGpsSuccess,onGpsError,GPS_OPTS);}
  setTimeout(()=>{syncSegBtn('timeFormat',SETTINGS.timeFormat);syncSegBtn('coordFormat',SETTINGS.coordFormat);syncSegBtn('tempUnit',SETTINGS.tempUnit);syncVoiceBtn(SETTINGS.voice);syncLangBtn(SETTINGS.lang);},100);
  const ro=new ResizeObserver(()=>{resizeArc();if(currentPage==='home')drawArc();});
  const arcWrapEl=document.getElementById('arc-wrap');if(arcWrapEl)ro.observe(arcWrapEl);
  setInterval(update,1000);
});
