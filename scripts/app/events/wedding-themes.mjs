export function createEucalyptusWeddingTheme(partner1, partner2, date) {
  const coupleNames = [partner1, partner2].filter(Boolean).join(" & ");
  const assetBase = "/assets/themes/eucalyptus-wedding/";
  return {
    name: coupleNames ? `${coupleNames} Wedding` : "Eucalyptus Garden Wedding",
    eventTypes: ["wedding"],
    fontPairingStyle: "wedding",
    accent: "#55715e",
    accent2: "#e4d2a8",
    fontHeading: "'Great Vibes', cursive",
    fontBody: "'Lora', serif",
    bannerText: coupleNames,
    captureLabel: "Take Photo",
    backgrounds: [
      `${assetBase}eucalyptus-wedding-background-portrait.webp`,
      `${assetBase}eucalyptus-wedding-background-landscape.webp`,
    ],
    idleScreens: [
      {
        src: `${assetBase}eucalyptus-wedding-idle-portrait.webp`,
        name: "Eucalyptus Wedding welcome portrait",
        role: "idle",
        orientation: "portrait",
        buttonZones: { start: { x: 50, y: 82, width: 58, height: 20 } },
      },
      {
        src: `${assetBase}eucalyptus-wedding-idle-landscape.webp`,
        name: "Eucalyptus Wedding welcome landscape",
        role: "idle",
        orientation: "landscape",
        buttonZones: { start: { x: 50, y: 82, width: 42, height: 20 } },
      },
      {
        src: `${assetBase}eucalyptus-wedding-photo-choice-portrait.webp`,
        name: "Eucalyptus Wedding photo choice portrait",
        role: "photo-choice",
        orientation: "portrait",
        buttonZones: {
          singlePhoto: { x: 33, y: 51, width: 36, height: 34 },
          photoStrip: { x: 67, y: 51, width: 36, height: 34 },
        },
      },
      {
        src: `${assetBase}eucalyptus-wedding-photo-choice-landscape.webp`,
        name: "Eucalyptus Wedding photo choice landscape",
        role: "photo-choice",
        orientation: "landscape",
        buttonZones: {
          singlePhoto: { x: 31, y: 52, width: 36, height: 42 },
          photoStrip: { x: 69, y: 52, width: 36, height: 42 },
        },
      },
    ],
    thankYouScreens: [
      {
        src: `${assetBase}eucalyptus-wedding-thank-you-portrait.webp`,
        name: "Eucalyptus Wedding Thank You portrait",
        orientation: "portrait",
      },
      {
        src: `${assetBase}eucalyptus-wedding-thank-you-landscape.webp`,
        name: "Eucalyptus Wedding Thank You landscape",
        orientation: "landscape",
      },
    ],
    overlays: [
      {
        id: "eucalyptus-wedding-portrait",
        name: "Eucalyptus Wedding Portrait",
        src: `${assetBase}eucalyptus-wedding-overlay-portrait.png`,
        type: "overlay",
        category: "wedding",
        orientation: "portrait",
        aspectRatio: "2:3",
        foreground: { type: "image", src: `${assetBase}eucalyptus-wedding-overlay-portrait.png` },
        photoSlots: [{ x: 0.112, y: 0.072, width: 0.777, height: 0.777, objectFit: "cover" }],
        textFields: [
          { key: "couple_names", xPct: 0.16, yPct: 0.858, wPct: 0.68, hPct: 0.035, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 48, minFontSize: 24, color: "#405745", align: "center" },
          { key: "event_date", xPct: 0.2, yPct: 0.908, wPct: 0.6, hPct: 0.026, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 25, minFontSize: 15, color: "#6e755f", align: "center" },
        ],
      },
      {
        id: "eucalyptus-wedding-landscape",
        name: "Eucalyptus Wedding Landscape",
        src: `${assetBase}eucalyptus-wedding-overlay-landscape.png`,
        type: "overlay",
        category: "wedding",
        orientation: "landscape",
        aspectRatio: "3:2",
        foreground: { type: "image", src: `${assetBase}eucalyptus-wedding-overlay-landscape.png` },
        photoSlots: [{ x: 0.05, y: 0.10, width: 0.90, height: 0.80, objectFit: "cover" }],
        textFields: [
          { key: "couple_names", xPct: 0.2, yPct: 0.905, wPct: 0.6, hPct: 0.032, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 43, minFontSize: 22, color: "#405745", align: "center" },
          { key: "event_date", xPct: 0.25, yPct: 0.949, wPct: 0.5, hPct: 0.023, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 22, minFontSize: 14, color: "#6e755f", align: "center" },
        ],
      },
    ],
    templates: [
      {
        src: `${assetBase}eucalyptus-wedding-three-photo-strip.png`,
        name: "Eucalyptus Wedding Three-Photo Strip",
        layout: "photo_strip_3",
        photoSlots: [
          { x: 0.125, y: 0.083, width: 0.75, height: 0.24, sourceIndex: 0 },
          { x: 0.125, y: 0.354, width: 0.75, height: 0.248, sourceIndex: 1 },
          { x: 0.125, y: 0.636, width: 0.75, height: 0.237, sourceIndex: 2 },
        ],
        textFields: [
          { key: "couple_names", xPct: 0.17, yPct: 0.902, wPct: 0.66, hPct: 0.03, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 38, minFontSize: 20, color: "#405745", align: "center" },
          { key: "event_date", xPct: 0.25, yPct: 0.94, wPct: 0.5, hPct: 0.02, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 21, minFontSize: 14, color: "#6e755f", align: "center" },
        ],
      },
    ],
    welcome: {
      title: coupleNames || "Wedding Celebration",
      prompt: "Touch to start",
    },
    eventDate: date,
    vibeSummary: "Eucalyptus greenery, ivory, and warm gold",
  };
}

export function createMinimalWeddingTheme(partner1, partner2, date) {
  const theme = createEucalyptusWeddingTheme(partner1, partner2, date);
  const assetBase = "/assets/themes/minimal-wedding/";
  const coupleNames = [partner1, partner2].filter(Boolean).join(" & ");
  theme.name = coupleNames ? `${coupleNames} Wedding` : "Minimal Botanical Wedding";
  theme.accent = "#252525";
  theme.accent2 = "#efede8";
  theme.fontHeading = "'Lora', serif";
  theme.fontBody = "'Lora', serif";
  theme.vibeSummary = "Monochrome keepsake prints with delicate botanical details";
  theme.overlays = [
    {
      id: "minimal-wedding-portrait",
      name: "Minimal Wedding Portrait",
      src: `${assetBase}minimal-wedding-overlay-portrait.png`,
      type: "overlay",
      category: "wedding",
      orientation: "portrait",
      aspectRatio: "2:3",
      foreground: { type: "image", src: `${assetBase}minimal-wedding-overlay-portrait.png` },
      photoSlots: [{ x: 0.154, y: 0.117, width: 0.692, height: 0.669, objectFit: "cover" }],
      textFields: [
        { key: "couple_names", xPct: 0.16, yPct: 0.816, wPct: 0.68, hPct: 0.035, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 48, minFontSize: 24, color: "#262626", align: "center" },
        { key: "event_date", xPct: 0.2, yPct: 0.866, wPct: 0.6, hPct: 0.026, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 25, minFontSize: 15, color: "#555555", align: "center" },
      ],
    },
    {
      id: "minimal-wedding-landscape",
      name: "Minimal Wedding Landscape",
      src: `${assetBase}minimal-wedding-overlay-landscape.png`,
      type: "overlay",
      category: "wedding",
      orientation: "landscape",
      aspectRatio: "3:2",
      foreground: { type: "image", src: `${assetBase}minimal-wedding-overlay-landscape.png` },
      photoSlots: [{ x: 0.052, y: 0.103, width: 0.898, height: 0.776, objectFit: "cover" }],
      textFields: [
        { key: "couple_names", xPct: 0.2, yPct: 0.905, wPct: 0.6, hPct: 0.032, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 43, minFontSize: 22, color: "#262626", align: "center" },
        { key: "event_date", xPct: 0.25, yPct: 0.949, wPct: 0.5, hPct: 0.023, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 22, minFontSize: 14, color: "#555555", align: "center" },
      ],
    },
  ];
  theme.templates = [
    {
      src: `${assetBase}minimal-wedding-three-photo-strip.png`,
      name: "Minimal Wedding Three-Photo Strip",
      layout: "photo_strip_3",
      photoSlots: [
        { x: 0.099, y: 0.086, width: 0.356, height: 0.226, sourceIndex: 0 },
        { x: 0.099, y: 0.335, width: 0.356, height: 0.226, sourceIndex: 1 },
        { x: 0.099, y: 0.585, width: 0.356, height: 0.235, sourceIndex: 2 },
        { x: 0.545, y: 0.086, width: 0.352, height: 0.226, sourceIndex: 0 },
        { x: 0.545, y: 0.335, width: 0.352, height: 0.226, sourceIndex: 1 },
        { x: 0.545, y: 0.585, width: 0.352, height: 0.235, sourceIndex: 2 },
      ],
      textFields: [
        { key: "couple_names", xPct: 0.07, yPct: 0.845, wPct: 0.4, hPct: 0.03, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 38, minFontSize: 20, color: "#262626", align: "center" },
        { key: "event_date", xPct: 0.07, yPct: 0.89, wPct: 0.4, hPct: 0.03, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 30, minFontSize: 26, color: "#333333", align: "center" },
        { key: "couple_names", xPct: 0.53, yPct: 0.845, wPct: 0.4, hPct: 0.03, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontSize: 38, minFontSize: 20, color: "#262626", align: "center" },
        { key: "event_date", xPct: 0.53, yPct: 0.89, wPct: 0.4, hPct: 0.03, fontFamily: "'Lora', serif", fontWeight: "400", fontSize: 30, minFontSize: 26, color: "#333333", align: "center" },
      ],
    },
  ];
  theme.backgrounds = [
    `${assetBase}minimal-wedding-background-portrait.webp`,
    `${assetBase}minimal-wedding-background-landscape.webp`,
  ];
  theme.idleScreens = [
    {
      src: `${assetBase}minimal-wedding-idle-portrait.webp`,
      name: "Minimal Wedding welcome portrait",
      role: "idle",
      orientation: "portrait",
      buttonZones: { start: { x: 50, y: 52, width: 74, height: 17 } },
    },
    {
      src: `${assetBase}minimal-wedding-idle-landscape.webp`,
      name: "Minimal Wedding welcome landscape",
      role: "idle",
      orientation: "landscape",
      buttonZones: { start: { x: 50, y: 61, width: 48, height: 20 } },
    },
    {
      src: `${assetBase}minimal-wedding-photo-choice-portrait.webp`,
      name: "Minimal Wedding photo choice portrait",
      role: "photo-choice",
      orientation: "portrait",
      buttonZones: {
        singlePhoto: { x: 50, y: 43, width: 72, height: 27 },
        photoStrip: { x: 50, y: 71, width: 72, height: 27 },
      },
    },
    {
      src: `${assetBase}minimal-wedding-photo-choice-landscape.webp`,
      name: "Minimal Wedding photo choice landscape",
      role: "photo-choice",
      orientation: "landscape",
      buttonZones: {
        singlePhoto: { x: 31, y: 55, width: 38, height: 49 },
        photoStrip: { x: 70, y: 55, width: 38, height: 49 },
      },
    },
  ];
  theme.thankYouScreens = [
    {
      src: `${assetBase}minimal-wedding-thank-you-portrait.webp`,
      name: "Minimal Wedding thank you portrait",
      orientation: "portrait",
    },
    {
      src: `${assetBase}minimal-wedding-thank-you-landscape.webp`,
      name: "Minimal Wedding thank you landscape",
      orientation: "landscape",
    },
  ];
  theme.welcome = { title: coupleNames || "Wedding Celebration", prompt: "Touch to start" };
  return theme;
}

export function createWeddingTheme(style = "eucalyptus", partner1 = "", partner2 = "", date = "") {
  return style === "minimal"
    ? createMinimalWeddingTheme(partner1, partner2, date)
    : createEucalyptusWeddingTheme(partner1, partner2, date);
}
