import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/leona/Desktop/leitura da planilha/ph-demo",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "src/components/RegistrarDespesa.tsx",
    "mapFileRelPath": "src/components/RegistrarDespesa.tsx",
    "presetName": "react",
    "workspaceFolderName": "ph-demo"
};
export const preview = () => render(getMod);
const getMod = () => import("../../src/components/RegistrarDespesa.tsx");