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
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/prefer-readonly-parameter-types": "off",
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
						pattern: "$**",
						position: "before",
					},
				],
			},
		] /* Custom settings */,
		"import/prefer-default-export": "off",
		"no-dupe-else-if": "warn" /* airbnb: not enabled yet */,
		"no-empty": [
			"error",
			{ allowEmptyCatch: true },
		] /* airbnb: added allowEmptyCatch option */,
		"no-import-assign": "warn" /* airbnb: not enabled yet */,
		"no-void": [
			"error",
			{ allowAsStatement: true },
		] /* allowAsStatement not enabled */,
		"react/jsx-props-no-spreading": "off",
		"react/react-in-jsx-scope": "off" /* Global */,
		"react/require-default-props":
			"off" /* Better: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props/ */,
		"require-await": "error",
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
