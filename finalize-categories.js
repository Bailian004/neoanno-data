const fs = require('fs');

// ADJUST PATHS AS NEEDED
const inputPath = './anno1800/v2.0.1/buildings.json'; 
const outputPath = './anno1800/v2.0.1/buildings.json';

const buildings = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
console.log(`Loaded ${buildings.length} items. Finalising Categories...`);

const KEYWORDS = {
    // --- LOGISTICS (Harbour, Transport, Power, Utility) ---
    "Warehouse": "logistics", "Depot": "logistics", "Pier": "logistics", "Wharf": "logistics", "Harbour": "logistics", "Trading Post": "logistics",
    "Power": "utility", "Heater": "utility", "Pump": "utility", "Ranger": "utility", "Purifier": "utility", "Dam": "utility",
    "Railway": "infrastructure", "Bridge": "infrastructure", "Paving": "infrastructure", "Construction": "infrastructure", "Quay": "infrastructure", "Canal": "infrastructure",
    "Repair Crane": "logistics", "Oil Store": "logistics", "Fuel": "logistics",
    // Transport & Airships
    "Shipyard": "logistics", "Hangar": "logistics", "Station": "logistics", "Commuter": "logistics", "Airship": "logistics", "Landing": "logistics",
    "Bus": "logistics", "Mooring": "logistics", "Platform": "logistics", // Old Nate's platforms are crafting stations

    // --- MILITARY ---
    "Cannon": "military", "Turret": "military", "Flak": "military", "Defense": "military", "Monitor": "military", "Gun": "military", "Betty": "military",

    // --- PRODUCTION (Factories, Resources, Scavenging) ---
    "Mine": "resource", "Deposit": "resource", "Well": "resource", "Pit": "resource", "Slot": "resource", "Spring": "resource", "Quarry": "resource",
    "Junk": "resource", // Junk Piles
    "Fishery": "factory", "Works": "factory", "Plant": "factory", "Refinery": "factory", 
    "Farm": "cultivation_field", "Hunting": "cultivation_radius", "Forester": "cultivation_radius", "Aquafarm": "cultivation_module",
    "Workshop": "factory", // Artisan workshops / Old Nate

    // --- PUBLIC (Services, Admin, Culture) ---
    "Town Hall": "administration", "Trade Union": "administration", "Harbourmaster": "administration", "Palace": "administration", "Department": "administration",
    "Zoo": "culture", "Museum": "culture", "World's Fair": "culture", "Garden": "culture", "Research": "culture", "Exhibition": "culture",
    "Market": "service", "School": "service", "Church": "service", "University": "service", "Bank": "service", "Hospital": "service", "Chapel": "service",
    "Pub": "service", "Theatre": "service", "Club": "service", "Cinema": "service", "Restaurant": "service", "Bar": "service", "Cafe": "service", "Café": "service",

    // --- DECORATIVE (Specific overrides) ---
    "Tree": "ornament", "Statue": "ornament", "Fence": "ornament", "Park": "ornament", "Pavilion": "ornament", 
    "Hedge": "ornament", "Fountain": "ornament", "Sign": "ornament", "Billboard": "ornament", "Wall": "ornament", "Gate": "ornament",
    "Column": "ornament", "Bench": "ornament", "Stall": "ornament", "Table": "ornament", "Chair": "ornament", "Parasol": "ornament",
    "Spotlight": "ornament", "Poster": "ornament", "Banner": "ornament", "Flag": "ornament", "Vase": "ornament", "Clock": "ornament"
};

const UI_GROUPS = {
    // Mapping sub-categories to the 5 App Tabs
    "cultivation_field": "production",
    "cultivation_module": "production",
    "cultivation_radius": "production",
    "factory": "production",
    "resource": "production",

    "logistics": "logistics",
    "utility": "logistics",
    "military": "logistics",
    "infrastructure": "logistics", 

    "administration": "public",
    "culture": "public",
    "service": "public",

    "ornament": "decorative",
    "building": "decorative" 
};

buildings.forEach(item => {
    
    item.ui_group = null; // Reset to force re-evaluation

    // 1. HARD OVERRIDES (Modules & Residences)
    // These must NEVER be decorative
    if (item.type === "module" || item.category === "module") {
        item.ui_group = "production";
        if (!item.sub_category) item.sub_category = "cultivation_module";
        return; 
    }
    if (item.type === "residence" || item.category === "residence") {
        item.ui_group = "residences";
        item.sub_category = "residence";
        return;
    }

    // 2. HACIENDA SPECIAL LOGIC
    if (item.name.includes("Hacienda")) {
        if (item.name.includes("Quarters") || item.name.includes("Residence")) {
            item.ui_group = "residences"; item.sub_category = "residence";
        } else if (item.name.includes("Farm") || item.name.includes("Works") || item.name.includes("Brewery") || item.name.includes("Press")) {
            item.ui_group = "production"; item.sub_category = "factory";
        } else if (item.name.includes("Storage") || item.name.includes("Warehouse")) {
            item.ui_group = "logistics"; item.sub_category = "logistics";
        } else if (item.name.includes("Paving") || item.name.includes("Pathway")) {
            item.ui_group = "logistics"; item.sub_category = "infrastructure";
        } else if (item.name === "Hacienda" || item.name === "The Hacienda") {
            item.ui_group = "public"; item.sub_category = "administration";
        } else {
            item.ui_group = "decorative"; item.sub_category = "ornament";
        }
        return;
    }

    // 3. KEYWORD MATCHING
    let foundSub = null;
    for (const [key, value] of Object.entries(KEYWORDS)) {
        if (item.name.includes(key)) {
            foundSub = value;
            break;
        }
    }

    if (foundSub) {
        item.sub_category = foundSub;
        item.ui_group = UI_GROUPS[foundSub];
        return;
    }

    // 4. TYPE FALLBACKS
    if (item.type === "factory" || item.category === "production") {
        item.ui_group = "production";
        if (!item.sub_category) item.sub_category = "factory";
    } else if (item.type === "service" || item.category === "service") {
        item.ui_group = "public";
        if (!item.sub_category) item.sub_category = "service";
    } else {
        item.ui_group = "decorative";
        item.sub_category = "ornament";
    }
});

fs.writeFileSync(outputPath, JSON.stringify(buildings, null, 2));
console.log(`Saved corrected data to: ${outputPath}`);
