import { config } from './config';

const NAME = process.env.npm_package_name;
const VERSION = process.env.npm_package_version;
const DESCRIPTION = config.full_name;

export const appName = () => NAME;
export const appVersion = () => VERSION;
export const appDescription = () => DESCRIPTION;
