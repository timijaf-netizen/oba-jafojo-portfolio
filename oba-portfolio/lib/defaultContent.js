/**
 * Default / placeholder content.
 *
 * This is what the site shows before any real content is saved through the
 * admin panel (and even before Supabase or Cloudinary are configured). It lets
 * the portfolio go live immediately, then Oba can log in and replace each
 * piece with his own photos, reel, bio, and credits.
 *
 * The shape of this object is the single source of truth for the whole site.
 * The admin panel edits a copy of it and stores it in Supabase; the public
 * site reads it back and falls back to this file if anything is missing.
 */
export const defaultContent = {
  hero: {
    name: "Oba Jafojo",
    tagline: "Actor · Performer · Storyteller",
    // A wide, cinematic placeholder. Replaced by a real production still later.
    backgroundImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    location: "Atlanta, Georgia",
  },

  about: {
    heading: "About",
    bio: "Oba Jafojo is an actor and performer based in Georgia whose work moves easily between grounded, character-driven film and the immediacy of the stage. He brings a calm intensity and a storyteller's instinct to every role, drawing audiences into the small, true moments that make a character feel real. Trained across scene study, voice, and movement, Oba is drawn to stories about identity, family, and the space between who we are and who we are becoming. He is currently based in the Atlanta area and available for film, television, commercial, and theatre work.",
    headshot:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    specs: [
      { label: "Height", value: "6'1\"" },
      { label: "Voice Type", value: "Baritone" },
      { label: "Hair", value: "Black" },
      { label: "Eyes", value: "Brown" },
      { label: "Location", value: "Atlanta, GA" },
      { label: "Union Status", value: "Non-Union" },
    ],
  },

  photos: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — natural light",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — studio",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — dramatic",
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — smiling",
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — outdoor",
    },
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80",
      alt: "Headshot — profile",
    },
    {
      id: "p7",
      url: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80",
      alt: "Character look — warm",
    },
    {
      id: "p8",
      url: "https://images.unsplash.com/photo-1500529178650-4bab8d1f2f79?auto=format&fit=crop&w=800&q=80",
      alt: "Character look — editorial",
    },
  ],

  reel: {
    heading: "Demo Reel",
    // A short, freely usable placeholder clip. Replaced with Oba's real reel
    // (an .mp4 uploaded to Cloudinary, or a YouTube/Vimeo link).
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1690000000/samples/elephants.mp4",
    // If videoUrl is a YouTube/Vimeo watch URL, the player embeds it instead.
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80",
    caption: "2024 Acting Reel · Selected scenes",
  },

  resume: {
    heading: "Resume",
    resumeFileUrl: "", // optional PDF link (e.g. a Cloudinary or Drive URL)
    credits: [
      {
        id: "c1",
        category: "Film",
        title: "The Long Way Home",
        role: "Lead — Malik",
        company: "Peachtree Independent Films",
        year: "2024",
      },
      {
        id: "c2",
        category: "Film",
        title: "Static",
        role: "Supporting — Deacon",
        company: "SCAD Student Films",
        year: "2023",
      },
      {
        id: "c3",
        category: "Television",
        title: "Precinct 9",
        role: "Co-Star — Officer Reyes",
        company: "Regional Network Pilot",
        year: "2023",
      },
      {
        id: "c4",
        category: "Theatre",
        title: "Fences",
        role: "Cory",
        company: "Alliance Theatre Workshop",
        year: "2022",
      },
      {
        id: "c5",
        category: "Theatre",
        title: "A Raisin in the Sun",
        role: "Walter Lee Younger",
        company: "Georgia State Main Stage",
        year: "2022",
      },
      {
        id: "c6",
        category: "Commercial",
        title: "Regional & national spots",
        role: "Principal / Featured",
        company: "Conflicts available upon request",
        year: "2023–2024",
      },
    ],
    training: [
      {
        id: "t1",
        program: "Meisner Technique — Scene Study",
        institution: "Atlanta Actor's Studio",
        detail: "Two-year conservatory track",
      },
      {
        id: "t2",
        program: "Voice & Speech",
        institution: "Private coaching",
        detail: "Dialects, projection, breath support",
      },
      {
        id: "t3",
        program: "On-Camera Technique",
        institution: "Drama Inc. Workshop",
        detail: "Audition and self-tape intensive",
      },
    ],
    skills: [
      "Stage combat (basic)",
      "Improvisation",
      "Standard American & Southern dialects",
      "Baritone vocals",
      "Basketball",
      "Valid driver's license",
      "Motorcycle (licensed)",
      "Guitar (intermediate)",
    ],
  },

  contact: {
    heading: "Contact",
    intro:
      "For representation inquiries, auditions, and booking, reach out directly. I read every message.",
    email: "oba.jafojo@example.com",
    phone: "",
    actorsAccessUrl: "https://resumes.actorsaccess.com/",
    socials: [
      { id: "s1", label: "Instagram", url: "https://instagram.com/" },
      { id: "s2", label: "IMDb", url: "https://www.imdb.com/" },
      { id: "s3", label: "Actors Access", url: "https://resumes.actorsaccess.com/" },
    ],
  },

  footer: {
    text: "Oba Jafojo",
  },
};

/**
 * Deep-merge saved content over the defaults so a partially-filled record
 * still renders every section. Arrays are replaced wholesale when present.
 */
export function mergeContent(saved) {
  if (!saved || typeof saved !== "object") return defaultContent;
  const out = structuredClone(defaultContent);
  for (const key of Object.keys(defaultContent)) {
    const s = saved[key];
    if (s == null) continue;
    if (Array.isArray(s)) {
      out[key] = s;
    } else if (typeof s === "object") {
      out[key] = { ...out[key], ...s };
    } else {
      out[key] = s;
    }
  }
  return out;
}
