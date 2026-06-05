export interface PosStatusResponse {
  isConnected: boolean;
  importMenu: boolean;
  syncStops: boolean;
  lastSyncAt?: string | Date | null;
  maskedApiKey?: string | null;
}

export interface ConnectPosPayload {
  apiKey: string;
}

export interface UpdatePosSettingsPayload {
  importMenu?: boolean;
  syncStops?: boolean;
}

export interface SyncMenuResponse {
  success: boolean;
  categoriesCreated: number;
  dishesCreated: number;
}