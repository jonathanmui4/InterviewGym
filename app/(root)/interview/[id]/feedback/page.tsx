import React from "react";
import { RouteParams } from "@/types";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewsById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id || "",
    });

    console.log("feedback", feedback);
    return <div>Page</div>;
};

export default Page;
