"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const EXPIRY_TIME = 60 * 60 * 24 * 7 * 1000; // 1 week

export async function signUp(params: SignUpParams) {
    const { uid, name, email, photoUrl, providerId } = params;

    try {
        // Trying to fetch user by entering collection, getting document of uid
        const userRecord = await db.collection("users").doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in instead.",
            };
        }

        await db
            .collection("users")
            .doc(uid)
            .set({
                name: name,
                email: email,
                photoURL: photoUrl || "",
                provider: providerId || "unknown",
                createdAt: new Date(),
            });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (e: any) {
        console.error("Error creating a user", e);

        if (e.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create an account",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken, isSocial, name, photoUrl, providerId } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (isSocial) {
            // Trying to fetch user by entering collection, getting document of uid
            const userRecordDb = await db
                .collection("users")
                .doc(userRecord.uid)
                .get();

            if (!userRecordDb.exists) {
                await db
                    .collection("users")
                    .doc(userRecord.uid)
                    .set({
                        name: name,
                        email: email,
                        photoUrl: photoUrl || "",
                        provider: providerId || "unknown",
                        createdAt: new Date(),
                    });
            }
        }

        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account instead.",
            };
        }

        await setSessionCookie(idToken);
        return { success: true, message: "Signed in successfully" };
    } catch (e: any) {
        console.log("Error Signing In", e);

        return {
            success: false,
            message: "Failed to log into an account.",
        };
    }
}

/**
 * Function takes a Firebase ID token and converts it into a longer-lived session cookie
 * that will be stored in the user's browser.
 * @param idToken Firebase ID token
 */
export async function setSessionCookie(idToken: string) {
    // Retrieve application's cookie management interface
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: EXPIRY_TIME,
    });

    // Converts short-lived ID token into longer duration session cookie using Firebase Auth API
    cookieStore.set("session", sessionCookie, {
        maxAge: EXPIRY_TIME,
        httpOnly: true, // Prevent Javascript from accessing cookie, protecting against XSS attacks
        secure: process.env.NODE_ENV === "production", // Only sends cookie over HTTPS in production
        path: "/", // Cookie available across entire site
        sameSite: "lax", // Provides some CSRF protection while allowing the cookie to be sent when navigating to the site from external links
    });
}

export async function getCurrentUser(): Promise<User | null> {
    // Retrieve application's cookie management interface
    const cookieStore = await cookies();

    // Get specific session cookie
    const sessionCookie = cookieStore.get("session")?.value;

    // Return null if unable to get session cookie
    if (!sessionCookie) return null;

    // If cookie does exist
    try {
        // Decode session to see if there is valid user
        const decodedClaims = await auth.verifySessionCookie(
            sessionCookie,
            true
        );

        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e: any) {
        console.log("Error retrieving current user: ", e);

        // Invalid or expired session
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    // If obj contains user data, return true, else false
    return !!user;
}