import { Timestamp } from "firebase/firestore";

interface Feedback {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}

interface Interview {
    id: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
    userId: string;
    type: string;
    finalized: boolean;
}

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface User {
    name: string;
    email: string;
    photoUrl: string;
    provider: string;
    createdAt: Timestamp;
    id: string;
}

interface InterviewCardProps {
    id?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
}

interface AgentProps {
    userName: string;
    userId?: string;
    userImage?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}

interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

interface SignInParams {
    email: string;
    idToken: string;
    isSocial: boolean;
    name?: string | null;
    photoUrl?: string | null;
    providerId?: string | null;
}

interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
    photoUrl: string | null;
    providerId: string | null;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
    interviewId: string;
    role: string;
    level: string;
    type: string;
    techstack: string[];
    amount: number;
}

interface TechIconProps {
    techStack: string[];
}
