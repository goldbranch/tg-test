import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

/** @type {string} */
export const TG_API_KEY = process.env.TG_API_KEY;

/** @type {string} */
export const TG_CHANNEL_ID = process.env.TG_CHANNEL_ID;

/** @type {string} */
export const TG_CHANNEL_NAME = process.env.TG_CHANNEL_NAME;

/** @type {string} */
export const TG_INVITE_LINK = process.env.TG_INVITE_LINK;
