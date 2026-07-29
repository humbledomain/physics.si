// physics.si — Anthropic API proxy (Vercel Edge Function, streaming)
export const config = { runtime: 'edge' };

const FIELD_PROMPTS = {
  // toddler tier
  k_space: 'space, stars, planets, rockets, and the moon, for a very young child',
  k_light: 'light, colors, shadows, and rainbows, for a very young child',
  k_move: 'pushes, pulls, and why things move and stop, for a very young child',
  k_sound: 'sound, music, and why things make noise, for a very young child',
  k_magnet: 'magnets and their invisible pulls, for a very young child',
  k_water: 'water, ice, melting, freezing, and floating, for a very young child',
  k_zap: 'electricity, lightning, batteries, and sparks, for a very young child',
  k_hot: 'hot and cold, fire, ice, and temperature, for a very young child',
  // elementary tier
  e_motion: 'forces and motion: gravity, friction, and speed, at elementary school level',
  e_energy: 'energy: where it comes from and where it goes, at elementary school level',
  e_light: 'light and color: mirrors, lenses, and rainbows, at elementary school level',
  e_elec: 'electricity and magnets: circuits, compasses, and motors, at elementary school level',
  e_sound: 'sound: vibrations, echoes, and loudness, at elementary school level',
  e_space: 'space and planets: the solar system, stars, and gravity in space, at elementary school level',
  e_matter: 'matter and materials: solids, liquids, gases, and atoms, at elementary school level',
  e_heat: 'heat: temperature, melting, and insulation, at elementary school level',
  e_machines: 'simple machines: levers, pulleys, and ramps, at elementary school level',
  e_weather: 'weather and the sky: clouds, wind, and why the sky is blue, at elementary school level',
  // high school tier
  h_mech: 'mechanics: kinematics, Newton’s laws, and projectile motion, at high school level',
  h_energy: 'energy and momentum: conservation laws, collisions, and work, at high school level',
  h_em: 'electricity and magnetism: fields, forces, and induction, at high school level',
  h_waves: 'waves and sound: interference, resonance, and the Doppler effect, at high school level',
  h_modern: 'modern physics: relativity, quanta, and the photoelectric effect, at high school level',
  h_optics: 'optics: lenses, mirrors, and diffraction, at high school level',
  h_circuits: 'circuits: Ohm’s law, series and parallel circuits, and power, at high school level',
  h_thermo: 'thermal physics: heat, gas laws, and entropy, at high school level',
  h_fluids: 'fluids: pressure, buoyancy, and flow, at high school level',
  h_grav: 'gravity and orbits: Kepler’s laws, satellites, and tides, at high school level',
  h_nuclear: 'nuclear and particle physics: radioactivity, fission, and the standard model, at high school level',
  h_astro: 'astronomy: stars, galaxies, and the big bang, at high school level',
  // undergraduate tier
  u_cm: 'classical mechanics: Lagrangian and Hamiltonian formalism, rigid bodies (undergraduate)',
  u_em: 'electromagnetism: Maxwell’s equations, radiation, waves (undergraduate)',
  u_qm: 'quantum mechanics: Schrödinger equation, spin, perturbation theory (undergraduate)',
  u_stat: 'thermal and statistical physics: ensembles, partition functions, phase transitions (undergraduate)',
  u_waves: 'waves and optics: Fourier analysis, interference, lasers (undergraduate)',
  u_sr: 'special relativity and introductory general relativity (undergraduate)',
  u_solid: 'solid state physics: crystals, band structure, semiconductors (undergraduate)',
  u_astro: 'astrophysics: stellar structure, galaxies, introductory cosmology (undergraduate)',
  u_nuc: 'nuclear and particle physics: decay, scattering, the standard model (undergraduate)',
  u_math: 'mathematical methods: complex analysis, PDEs, group theory (undergraduate)',
  u_comp: 'computational physics: ODE solvers, Monte Carlo, simulation (undergraduate)',
  u_exp: 'experimental methods: error analysis, instrumentation, data analysis (undergraduate)',
  // research tier
  qm: 'quantum mechanics and quantum foundations (decoherence, measurement theory, Bell inequalities, interpretations, weak measurement)',
  qft: 'quantum field theory (renormalization, gauge theory, path integrals, anomalies, effective field theory)',
  gr: 'general relativity and gravitation (black holes, gravitational waves, numerical relativity, singularity theorems)',
  cosmo: 'cosmology (inflation, CMB physics, dark energy, large-scale structure, baryogenesis)',
  particle: 'particle physics (Standard Model, BSM phenomenology, neutrinos, collider physics, lattice QCD)',
  cm: 'condensed matter physics (topological phases, superconductivity, strongly correlated systems, moiré materials)',
  statmech: 'statistical mechanics (phase transitions, critical phenomena, non-equilibrium dynamics, stochastic thermodynamics)',
  astro: 'astrophysics (compact objects, stellar evolution, accretion physics, high-energy astrophysics, exoplanets)',
  nuclear: 'nuclear physics (nuclear structure, reactions, dense-matter equation of state, fusion, nucleosynthesis)',
  amo: 'atomic, molecular, and optical physics (ultracold atoms, cavity QED, precision measurement, attosecond physics)',
  qi: 'quantum information and computing (error correction, entanglement theory, quantum algorithms, hardware platforms)',
  plasma: 'plasma physics (MHD, kinetic theory, magnetic confinement, astrophysical and laser plasmas)',
  fluids: 'fluid dynamics and nonlinear physics (turbulence, chaos, pattern formation, solitons, geophysical flows)',
  bio: 'biophysics (molecular motors, membrane physics, neural dynamics, active matter, single-molecule techniques)',
  mathphys: 'mathematical physics (operator algebras, integrable systems, geometry and topology in physics, TQFT)',
  strings: 'string theory and quantum gravity (AdS/CFT, holography, loop quantum gravity, scattering amplitudes, swampland)',
};

const TOOL_PROMPTS = {
  derive: 'You are in Derivation Engine mode: produce complete step-by-step derivations. State every assumption, justify every approximation, show intermediate algebra, and note alternative derivation routes where they exist.',
  solve: 'You are in Problem Solver mode: solve physics problems with full pedagogical reasoning. Set up the physics before the math, explain each step, sanity-check the result (limits, units, orders of magnitude).',
  decode: 'You are in Paper Decoder mode: the user pastes text from a physics paper. Unpack the physics, translate jargon, explain the significance and context within the field, and flag hidden assumptions.',
  explain: 'You are in Concept Cartographer mode: explain concepts at the requested depth and map their connections to neighboring ideas. Build from intuition to formalism.',
  research: 'You are in Research Copilot mode: brainstorm rigorously about open problems. Stress-test ideas, identify the weakest link in arguments, suggest concrete calculational or experimental approaches, and cite the relevant literature by author and year where you are confident.',
  course: 'You are in Course Architect mode: produce teaching materials — syllabi, problem sets with full solutions, exams, lecture outlines — calibrated precisely to the requested course level. Format for direct classroom use.',
  latex: 'You are in LaTeX Forge mode: convert the user’s notes, derivations, or requests into clean, publication-ready LaTeX. Output compilable LaTeX in code blocks; prefer amsmath/physics-package conventions.',
  fermi: 'You are in Fermi Estimator mode: produce order-of-magnitude estimates. Show the decomposition, the scaling arguments, dimensional analysis, and the plausible range, not just the central value.',
};

const LEVEL_PROMPTS = {
  Toddler: 'You are talking with a very young child (roughly ages 3–6). Override any earlier instruction about LaTeX: use NO equations, NO LaTeX, NO jargon. Use very simple words, short sentences, playful comparisons to everyday things, and a warm, delighted tone. One idea at a time. Keep answers short. Always be accurate — simple, never wrong.',
  Elementary: 'You are talking with an elementary school student (roughly ages 6–11). Override any earlier instruction about LaTeX: no equations beyond simple arithmetic, no LaTeX. Use vivid everyday examples and simple experiments they could try safely. Encourage curiosity. Simple, never wrong.',
  'High School': 'Pitch at high school level: algebra-based physics. Intuition first, then light use of equations (in LaTeX). Define every term on first use. Connect to things they have seen in daily life.',
  Undergrad: 'Pitch explanations at advanced undergraduate level: build intuition first, keep formalism accessible, define terms.',
  Graduate: 'Pitch explanations at graduate-course level: full formalism expected, standard graduate texts assumed known.',
  PhD: 'Pitch explanations at PhD/postdoc level: assume fluency with the field’s core formalism and literature.',
  Frontier: 'Operate at the research frontier, beyond typical PhD level: engage with current open problems, recent literature, competing research programs, and technical subtleties experts debate. Do not simplify.',
};

function buildSystem(field, tool, level) {
  let s = 'You are physics.si, a physics superintelligence serving professors, researchers, and students. You have deep expertise across all of physics at and beyond PhD level. '
    + 'Always: use LaTeX for all mathematics ($...$ inline, $$...$$ display); be rigorous about assumptions and regimes of validity; distinguish established results from conjecture and active debate; admit uncertainty rather than guess; sanity-check results against limits and units. '
    + 'Cite canonical references (author, year) when confident; never fabricate citations.';
  if (field && FIELD_PROMPTS[field]) s += ' The current session is focused on ' + FIELD_PROMPTS[field] + '.';
  if (tool && TOOL_PROMPTS[tool]) s += ' ' + TOOL_PROMPTS[tool];
  s += ' ' + (LEVEL_PROMPTS[level] || LEVEL_PROMPTS.PhD);
  return s;
}

// ── Rate limiting (per-IP, in-memory per edge isolate) ──
const RL_WINDOW = 60 * 60 * 1000; // 1 hour
const RL_MAX = Number(process.env.RATE_LIMIT_PER_HOUR) || 30;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const arr = (hits.get(ip) || []).filter(t => now - t < RL_WINDOW);
  if (arr.length >= RL_MAX) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr); return false;
}

// ── Model routing by depth ──
function pickModel(level) {
  if (process.env.ANTHROPIC_MODEL) return process.env.ANTHROPIC_MODEL; // global override
  const low  = process.env.ANTHROPIC_MODEL_LOW  || 'claude-haiku-4-5';
  const mid  = process.env.ANTHROPIC_MODEL_MID  || 'claude-sonnet-5';
  const high = process.env.ANTHROPIC_MODEL_HIGH || 'claude-opus-5';
  if (level === 'Toddler' || level === 'Elementary') return low;
  if (level === 'High School' || level === 'Undergrad' || level === 'Graduate') return mid;
  return high; // PhD, Frontier
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Server missing ANTHROPIC_API_KEY', { status: 401 });
  }
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return new Response('Rate limit reached (' + RL_MAX + ' messages/hour). Please try again later.', { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { messages, field, tool, level } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('messages required', { status: 400 });
  }
  // Sanitize: only role/content strings, cap history length
  const clean = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-40)
    .map(m => ({ role: m.role, content: m.content.slice(0, 120000) }));
  if (clean.length === 0) return new Response('no valid messages', { status: 400 });

  const frontier = level === 'Frontier';
  const payload = {
    model: pickModel(level),
    max_tokens: frontier ? 20000 : 8000,
    stream: true,
    system: buildSystem(field, tool, level),
    messages: clean,
  };
  if (frontier) payload.thinking = { type: 'enabled', budget_tokens: 8000 };

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response('Upstream error: ' + err, { status: upstream.status });
  }

  // Pass the SSE stream straight through
  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  });
}
