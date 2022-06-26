export enum FetchType {
    InitialLoad,
    LoadingMore,
    Refreshing,
}

export enum LoadingStatus {
    NotInitialized,
    Initializing,
    Fetched,
    Failed,
    FetchingMore,
    Refreshing,
}

export const MIN_PASSWORD_LENGTH = 8;

export const ROLE_ADMINISTRATOR = 'Administrator';
export const ROLE_CUSTOMER = 'Customer';

export const PRICE_BASE = 300;
