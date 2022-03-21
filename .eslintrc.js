const config = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"@remix-run/eslint-config",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"airbnb",
		"airbnb/hooks",
		"airbnb-typescript",
		"plugin:prettier/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			impliedStrict: true,
			jsx: true,
		},
		project: ["./tsconfig.json"],
		sourceType: "module",
		tsconfigRootDir:
			__dirname /* This line is the only reason why the entire file is JS :vomiting_face: */,
		warnOnUnsupportedTypeScriptVersion: true,
	},
	plugins: ["@typescript-eslint", "react"],
	root: true,
	rules: {
		"@typescript-eslint/no-non-null-assertion":
			"off" /* Required as TypeScript doesn't recognize complex type assertions */,
		"@typescript-eslint/no-throw-literal":
			"off" /* Remix encourages throwing methods to escape execution */,
		"@typescript-eslint/prefer-readonly-parameter-types":
			"off" /* While functional, it doesn't play well with framework conventions (which often encourage the modification of parameters, or provide incompatible typings) */,
		"import/no-cycle":
			"off" /* False positives :*( A litte too conservative with ES6 modules */,
		"import/order": [
			"warn",
			{
				alphabetize: {
					order: "asc",
				},
				groups: [
					"type",
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"unknown",
				],
				pathGroups: [
					{
						group: "internal",
						pattern: "~**",
						position: "before",
					},
				],
			},
		] /* Custom settings */,
		"no-dupe-else-if": "warn" /* airbnb: not enabled yet */,
		"no-empty": [
			"error",
			{ allowEmptyCatch: true },
		] /* airbnb: added allowEmptyCatch option */,
		"no-import-assign": "warn" /* airbnb: not enabled yet */,
		"no-void": [
			"error",
			{ allowAsStatement: true },
		] /* airbnb: allowAsStatement not enabled */,
		"react/jsx-props-no-spreading":
			"off" /* Prevents elegant pass-through of props to children */,
		"react/react-in-jsx-scope":
			"off" /* Framework provides React in the global scope already */,
		"react/require-default-props":
			"off" /* Better: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props/ */,
		"require-await": "error" /* Prevent unnecessary async functions */,
		"sort-keys": "warn" /* sort object keys */,
		"sort-vars": "warn" /* sort variable declarations */,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
module.exports = config;
