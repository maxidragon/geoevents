import { QualificationResult } from "./interfaces";
import { backendRequest } from "./request";

export const defaultResult: QualificationResult = {
    id: "",
    score: 0,
    maxScore: 0,
    totalTime: 0,
    registrationId: "",
    registration: null,
};

export const enterOrUpdateResult = async (
    eventId: string,
    data: QualificationResult
) => {
    const response = await backendRequest(
        `qualification/${eventId}/result`,
        "POST",
        true,
        data
    );
    return response.status;
};
