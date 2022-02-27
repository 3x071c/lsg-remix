/* eslint-disable sort-keys */
const dev = {
	"postcss-import": {},
	"postcss-flexbugs-fixes": {},
	"postcss-preset-env": {
		autoprefixer: false,
		stage: 2,
	},
};

const prod =
	process.env.NODE_ENV !== "development"
		? {
				autoprefixer: {},
				cssnano: {
					preset: "advanced",
				},
				"postcss-fail-on-warn": {},
		  }
		: {};

module.exports = {
	plugins: {
		...dev,
		...prod,
	},
};
