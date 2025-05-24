import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.CEgUrIve.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/chunks/BVR6nl7Y.js","_app/immutable/chunks/MYc6eXHu.js","_app/immutable/chunks/Vyx9v3T8.js","_app/immutable/chunks/D5yI2wqk.js","_app/immutable/chunks/Bv7EZ9Xw.js","_app/immutable/chunks/BumpSI4p.js","_app/immutable/chunks/H_26ShkY.js","_app/immutable/chunks/DiJJycSe.js","_app/immutable/chunks/DWZY7GPS.js","_app/immutable/chunks/BS3JrhoZ.js","_app/immutable/chunks/Cs3FoMXa.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.BeB-ITtk.css"];
export const fonts = [];
