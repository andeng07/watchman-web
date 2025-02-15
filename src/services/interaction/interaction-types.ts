export interface AddLogRequest {
    logReaderId: string;
    cardId: string;
    dateTime: string;
}

export interface AddLogResponse {
    sessionLogId: string;
    logReaderId: string;
    logUserId?: string;
    cardId: string;
    dateTime: string;
    interactionType: string;
}