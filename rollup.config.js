import babel  from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const extensions = [".ts", ".js"];

const preventThreeShakingPlugin = () => {
	return {
		name: 'no-threeshaking',
		resolveId(id, importer) {
			if (!importer) {
				// let's not treeshake entry points, as we're not exporting anything in Apps Script files
				return {id, moduleSideEffects: "no-treeshake" }
			}
			return null;
		}
	}
}

export default {
	input: "./src/index.ts",
	output: {
		dir: "build",
		format: "esm",
	},
	plugins: [
		preventThreeShakingPlugin(),
		resolve({
			extensions,
		}),
		commonjs(),
		babel({ extensions, babelHelpers: "runtime" }),
	],
};
