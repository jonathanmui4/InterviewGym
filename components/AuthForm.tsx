"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

import { auth, googleProvider, githubProvider } from "@/firebase/client";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const isSignIn = type === "sign-in";
    const router = useRouter();
    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email: email,
                    password: password,
                    photoUrl: userCredentials.user.photoURL,
                    providerId: userCredentials.providerId,
                });

                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.push("/sign-in");
            } else {
                const { email, password } = values;
                const isSocial = false;
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed");
                    return;
                }

                await signIn({
                    email,
                    idToken,
                    isSocial,
                });

                toast.success("Sign in successfully.");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const handleSocialSignIn = async (
        provider: GoogleAuthProvider | GithubAuthProvider
    ) => {
        try {
            const isSocial = true;
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const email = result.user.email;
            const name = result.user.displayName;
            const photoUrl = result.user.photoURL;
            const providerId = result.providerId;

            if (!idToken || !email) {
                toast.error("Authentication failed");
                return;
            }

            // Send ID token to backend for verification & session handling
            await signIn({ email, idToken, isSocial, name, photoUrl, providerId });

            toast.success(
                `${isSignIn ? "Signed in" : "Signed up"} successfully.`
            );
            router.push("/");
        } catch (error) {
            console.error("Error with social sign-in:", error);
            toast.error("Account with same email address exists");
        }
    };

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">Interview Gym</h2>
                </div>
                <h3>Practice job interview with AI</h3>

                {/* For 3rd party auth */}
                <Button
                    className="btn-social btn-google"
                    onClick={() => handleSocialSignIn(googleProvider)}
                >
                    <Image
                        src="/google-logo.svg"
                        alt="Google Logo"
                        height={20}
                        width={20}
                    />
                    {isSignIn ? "Sign In" : "Sign Up"} with Google
                </Button>
                <Button
                    className="btn-social btn-github"
                    onClick={() => handleSocialSignIn(githubProvider)}
                >
                    <Image
                        src="/github-logo.svg"
                        alt="Github Logo"
                        height={20}
                        width={20}
                    />
                    {isSignIn ? "Sign In" : "Sign Up"} with GitHub
                </Button>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email Address"
                            type="email"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        <Button className="btn" type="submit">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
