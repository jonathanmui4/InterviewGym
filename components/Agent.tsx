"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { AgentProps } from "@/types";
import { CallStatus, SavedMessage } from "./Enums";
import { initialState, AgentReducer } from "./states/AgentReducer";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

const Agent = ({
    userName,
    userId,
    userImage,
    type,
    interviewId,
    questions,
}: AgentProps) => {
    const router = useRouter();
    const [state, dispatch] = useReducer(AgentReducer, initialState);
    const { isSpeaking, callStatus, messages } = state;

    useEffect(() => {
        const onCallStart = () => dispatch({ type: "CALL_STARTED" });
        const onCallEnd = () => dispatch({ type: "CALL_ENDED" });

        const onMessage = (message: Message) => {
            if (
                message.type === "transcript" &&
                message.transcriptType === "final"
            ) {
                const newMessage = {
                    role: message.role,
                    content: message.transcript,
                };

                dispatch({
                    type: "MESSAGE_RECEIVED",
                    payload: newMessage,
                });
            }
        };

        const onSpeechStart = () => dispatch({ type: "SPEECH_STARTED" });
        const onSpeechEnd = () => dispatch({ type: "SPEECH_ENDED" });

        const onError = (e: Error) => console.log("Error: ", e);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log("Generate Feedback here");

        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        });

        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`);
        } else {
            console.log("Error saving feedback");
            router.push("/");
        }
    };

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId]);

    const handleCall = async () => {
        dispatch({ type: "CALL_CONNECTING" });

        if (type === "generate") {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    userName: userName,
                    userid: userId,
                },
            });
        } else {
            let formattedQuestions = "";

            if (questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                },
            });
        }
    };

    const handleDisconnect = async () => {
        dispatch({ type: "CALL_ENDED" });

        vapi.stop();
    };

    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactvieOrFinished =
        callStatus === CallStatus.INACTIVE ||
        callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="vapi"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src={userImage ? userImage : "/user-avatar.png"}
                            alt="user avatar"
                            width={540}
                            height={540}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p
                            key={latestMessage}
                            className={cn(
                                "transition-opacity duration-500 opacity-0",
                                "animate-fadeIn opacity-100"
                            )}
                        >
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== "CONNECTING" && "hidden"
                            )}
                        />
                        <span className="relative">
                            {isCallInactvieOrFinished ? "Call" : ". . . "}
                        </span>
                    </button>
                ) : (
                    <button
                        className="btn-disconnect"
                        onClick={handleDisconnect}
                    >
                        End
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;
