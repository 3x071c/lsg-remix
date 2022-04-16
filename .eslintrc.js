/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
const config = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"airbnb",
		"airbnb/hooks",
		"plugin:prettier/recommended",
	],
	ignorePatterns: ["package-lock.json", ".*ignore", "db/migrations"],
	overrides: [
		{
			excludedFiles: ["*.js", "*.jsx"],
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"airbnb-typescript",
				"plugin:prettier/recommended",
			],
			files: ["*.{tsx,ts}"],
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
			plugins: ["@typescript-eslint"],
			rules: {
				"@typescript-eslint/no-non-null-assertion":
					"off" /* Required as TypeScript doesn't recognize complex type assertions */,
				"@typescript-eslint/no-throw-literal":
					"off" /* Remix encourages throwing methods to escape execution */,
			},
		},
	],
	parserOptions: {
		ecmaFeatures: {
			impliedStrict: true,
			jsx: true,
		},
		sourceType: "module",
	},
	plugins: ["react", "import"],
	root: true,
	rules: {
		/* Shared Rules for both JS and TS */
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
		"import/prefer-default-export": "off" /* This makes no sense */,
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
