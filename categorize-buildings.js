const fs = require('fs');

const inputPath = './anno1800/v2.0.1/buildings_linked.json'; 
const outputPath = './anno1800/v2.0.1/buildings_final.json';

const buildings = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
console.log(`Loaded ${buildings.length} items. Applying Categories...`);

// --- 1. KEYWORDS ---
const KEYWORDS = {
    // LOGISTICS
    "Warehouse": "logistics", "Depot": "logistics", "Pier": "logistics", "Wharf": "logistics", "Harbour": "logistics", "Trading Post": "logistics",
    "Power": "utility", "Heater": "utility", "Pump": "utility", "Ranger": "utility",
    "Cannon": "military", "Turret": "military", "Flak": "military", "Defense": "military", "Monitor": "military",
    "Railway": "infrastructure", "Bridge": "infrastructure", "Paving": "infrastructure", "Construction": "infrastructure", "Quay": "infrastructure",

    // PUBLIC (Services, Admin, Culture)
    "Town Hall": "administration", "Trade Union": "administration", "Harbourmaster": "administration", "Palace": "administration",
    "Zoo": "culture", "Museum": "culture", "World's Fair": "culture", "Garden": "culture", "Research": "culture", "Exhibition": "culture",
    // Note: Standard services (Market, Pub) usually fall into 'service' category by default, but we can catch stragglers:
    "Market": "service", "School": "service", "Church": "service", "University": "service", "Bank": "service",

    // DECORATIVE
    "Tree": "ornament", "Statue": "ornament", "Fence": "ornament", "Park": "ornament", "Pavilion": "ornament", 
    "Hedge": "ornament", "Fountain": "ornament", "Sign": "ornament", "Billboard": "ornament"
};

// --- 2. UI GROUPS ---
const UI_GROUPS = {
    // Production
    "cultivation_field": "production",
    "cultivation_module": "production",
    "factory": "production",

    // Logistics
    "logistics": "logistics",
    "utility": "logistics",
    "military": "logistics",
    "infrastructure": "logistics", 

    // Public (Renamed from Services)
    "administration": "public",
    "culture": "public",
    "service": "public",

    // Decorative
    "ornament": "decorative",
    
    // Default fallback
    "building": "decorative" 
};

// --- 3. APPLY ---
let stats = {};

buildings.forEach(item => {
    
    // A. Sub-Category Tagging
    if (!item.sub_category) {
        let foundSub = null;
        for (const [key, value] of Object.entries(KEYWORDS)) {
            if (item.name && item.name.includes(key)) {
                foundSub = value;
                break;
            }
        }
        if (foundSub) {
            item.sub_category = foundSub;
            if (["ornament", "infrastructure", "utility"].includes(foundSub)) {
                item.category = "building"; 
            }
        }
    }

    // B. UI Grouping
    const subCat = item.sub_category || item.category || "building";
    
    if (UI_GROUPS[subCat]) {
        item.ui_group = UI_GROUPS[subCat];
    } else {
        if (item.category === "production") item.ui_group = "production";
        else if (item.category === "residence") item.ui_group = "residences";
        else if (item.category === "service") item.ui_group = "public"; // Catch-all for existing service items
        else item.ui_group = "decorative"; 
    }

    // Track stats
    const groupName = item.ui_group;
    stats[groupName] = (stats[groupName] || 0) + 1;
});

// --- SAVE ---
fs.writeFileSync(outputPath, JSON.stringify(buildings, null, 2));

console.log(`---------------------------------------------`);
console.log(`UI Mapping Complete.`);
console.table(stats);
console.log(`Saved to: ${outputPath}`);
