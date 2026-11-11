/* =========================================================
   CAMPUS MAP DATA
   ---------------------------------------------------------
   ⚠️  DEMO LAYOUT. Positions, paths and buildings below are
   MADE UP to test the route-finder. They are NOT the real
   Garissa University campus. Replace them with surveyed data
   (see map/README.md), then set demo: false.

   Units: metres. x grows east (right), y grows south (down).
   The map is size.w × size.h metres.

   nodes  : every point a route can pass through.
            kind "place"    → selectable in the dropdowns (needs a name)
            kind "junction" → path crossing, not selectable
   edges  : walkable paths between two node ids (both directions).
            Length is computed from the coordinates.
   blocks : buildings/areas drawn on the map (decoration only). Leave label
            empty when a place dot already names it, to avoid duplicates.
   ========================================================= */

window.CAMPUS = {
  demo: true,
  size: { w: 400, h: 300 },

  nodes: [
    { id: "gate-a",     kind: "place", name: "Gate A (Main Gate)", x: 200, y: 290 },
    { id: "gate-b",     kind: "place", name: "Gate B",             x: 15,  y: 170 },
    { id: "admissions", kind: "place", name: "Admissions Office",  x: 255, y: 240 },
    { id: "library",    kind: "place", name: "Library",            x: 345, y: 170 },
    { id: "lecture",    kind: "place", name: "Lecture Hall Block", x: 200, y: 35  },
    { id: "cafeteria",  kind: "place", name: "Cafeteria",          x: 100, y: 225 },
    { id: "hostels",    kind: "place", name: "Hostels",            x: 55,  y: 60  },
    { id: "sports",     kind: "place", name: "Sports Ground",      x: 345, y: 60  },

    { id: "j1", kind: "junction", x: 200, y: 240 },
    { id: "j2", kind: "junction", x: 200, y: 170 },
    { id: "j3", kind: "junction", x: 100, y: 170 },
    { id: "j4", kind: "junction", x: 300, y: 170 },
    { id: "j5", kind: "junction", x: 200, y: 95  },
    { id: "j6", kind: "junction", x: 100, y: 95  },
    { id: "j7", kind: "junction", x: 300, y: 95  }
  ],

  edges: [
    ["gate-a", "j1"], ["j1", "admissions"], ["j1", "j2"],
    ["j2", "j3"], ["j2", "j4"], ["j2", "j5"],
    ["j3", "cafeteria"], ["j3", "gate-b"], ["j3", "j6"],
    ["j4", "library"], ["j4", "j7"],
    ["j5", "lecture"], ["j5", "j6"], ["j5", "j7"],
    ["j6", "hostels"], ["j7", "sports"]
  ],

  blocks: [
    { label: "Admin Block",   x: 235, y: 210, w: 60,  h: 22 },
    { label: "", x: 320, y: 120, w: 55,  h: 38 },
    { label: "", x: 150, y: 8,   w: 100, h: 20 },
    { label: "", x: 70,  y: 238, w: 60,  h: 26 },
    { label: "", x: 20,  y: 15,  w: 70,  h: 34 },
    { label: "", x: 315, y: 10,  w: 70,  h: 40 }
  ]
};
