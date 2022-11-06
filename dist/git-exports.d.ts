export declare function getExports(): Promise<{
    name: string;
    filepath: string;
    line: string;
}[]>;
export declare function getPackages(): Promise<string[]>;
export declare function computeExports(): Promise<{
    exports: {
        [k: string]: string;
    };
    filepath: string;
    dirname: string;
    path: string;
}[]>;
export declare function updateExports(packages?: string[] | null): Promise<void>;
export declare function DependencyExports(dependencies: string[] | '*', watch?: boolean): void;
