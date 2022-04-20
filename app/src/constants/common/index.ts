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

export const MIN_PASSWORD_LENGTH = 8
