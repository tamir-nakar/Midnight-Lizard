import { ColorScheme } from "./ColorScheme";

export interface SettingsFile
{
    description: "Midnight Chameleon Color Scheme File";
    version: string | undefined;
    timestamp: Date | string | undefined;
    colorSchemes: ColorScheme[] | undefined;
}