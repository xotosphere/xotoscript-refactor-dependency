export const settings = {
    packageJsonGlob: "./mock/packages/*/package.json",
    globCodeFilesToParse: ["./src/**/*.ts"],
    importMatchRegex: /import.*"(?!@my-org|\.|@\/)(.*)"/g
}