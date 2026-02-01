import { homedir } from "os";
import { join } from "path";

// App metadata
export const APP_NAME = "solaris";
export const APP_VERSION = "1.0.0";

// Paths
export const SOLARIS_DIR = join(homedir(), ".solaris");
export const DB_PATH = join(SOLARIS_DIR, "diary.db");
export const TOKEN_PATH = join(SOLARIS_DIR, "token.json");

// API endpoints
export const API_BASE_URL = "https://solaris-project.com";
export const AUTH_URL = `${API_BASE_URL}/oauth/device`;
export const TOKEN_URL = `${API_BASE_URL}/oauth/token`;
export const MEMO_API_URL = `${API_BASE_URL}/api/v1/memo`;
