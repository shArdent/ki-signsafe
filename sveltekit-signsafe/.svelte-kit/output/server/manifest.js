export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.Cg-bkIJE.js",app:"_app/immutable/entry/app.D5pIjngc.js",imports:["_app/immutable/entry/start.Cg-bkIJE.js","_app/immutable/chunks/DoHTRtBx.js","_app/immutable/chunks/MYc6eXHu.js","_app/immutable/chunks/DiJJycSe.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/entry/app.D5pIjngc.js","_app/immutable/chunks/MYc6eXHu.js","_app/immutable/chunks/Vyx9v3T8.js","_app/immutable/chunks/D5yI2wqk.js","_app/immutable/chunks/DiJJycSe.js","_app/immutable/chunks/DWZY7GPS.js","_app/immutable/chunks/H_26ShkY.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/auth",
				pattern: /^\/auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/jwt",
				pattern: /^\/auth\/jwt\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/jwt",
				pattern: /^\/jwt\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
