// SassPlugin type definitions

export interface SassPluginOptions {
	resolveDir?: string;
	loadPaths?: string[];
	transform?: (source: string) => string;
	quietDeps: boolean;
	// Add other possible options
}