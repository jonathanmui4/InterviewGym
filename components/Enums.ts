export enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

export interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}