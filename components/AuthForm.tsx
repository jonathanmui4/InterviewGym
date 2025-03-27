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

import { auth } from "@/firebase/client";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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
                console.log("Sign up user credentials: ", userCredentials);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email: email,
                    password: password,
                });
                console.log("Sign up result: ", result);
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.push("/sign-in");
            } else {
                const { email, password } = values;
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
                });

                toast.success("Sign in successfully.");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === "sign-in";

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
                    onClick={() => console.log("Sign in google")}
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
                    onClick={() => console.log("Sign in github")}
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
