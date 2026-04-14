"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react'

const registerFormSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters.").max(20, "Username must be at most 20 characters.").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    email: z.email("Please enter a valid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function RegisterClient() {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: RegisterFormSchema) => {
        setIsLoading(true)
        console.log(data)
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
    }

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

            {/* Background elements (matching marketing page) */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute inset-0 bg-background mask-[radial-gradient(circle_at_center,transparent_0%,black_80%)]"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] opacity-60 pointer-events-none mix-blend-screen dark:mix-blend-color-dodge"></div>

            {/* Content Container */}
            <section className="relative z-10 w-full max-w-md px-4 py-8 mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

                {/* Logo / Brand Header */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-4">
                    <div>
                        <h2 className="font-black text-3xl tracking-tight mt-2 text-foreground">Create an Account</h2>
                        <p className="text-muted-foreground text-sm mt-1">Start your journey today</p>
                    </div>
                </div>

                <Card className="w-full bg-background/60 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-2xl">
                    <CardHeader className="space-y-1 pb-4 text-center">
                        <CardTitle className="text-2xl">Register</CardTitle>
                        <CardDescription>
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name='username'
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel className="text-foreground/80">Full Name</FieldLabel>
                                            <div className="relative mt-2">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20 focus:border-primary transition-all"
                                                    type="text"
                                                    placeholder="RichKid"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                            {
                                                fieldState.invalid && (
                                                    <FieldDescription className="text-destructive font-medium text-xs mt-1">
                                                        {fieldState.error?.message}
                                                    </FieldDescription>
                                                )
                                            }
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name='email'
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="mt-4">
                                            <FieldLabel className="text-foreground/80">Email Address</FieldLabel>
                                            <div className="relative mt-2">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20 focus:border-primary transition-all"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                            {
                                                fieldState.invalid && (
                                                    <FieldDescription className="text-destructive font-medium text-xs mt-1">
                                                        {fieldState.error?.message}
                                                    </FieldDescription>
                                                )
                                            }
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name='password'
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="mt-4">
                                            <FieldLabel className="text-foreground/80">Password</FieldLabel>
                                            <div className="relative mt-2">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                                                <PasswordInput
                                                    className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20 focus:border-primary transition-all"
                                                    placeholder="Enter your password"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                            {
                                                fieldState.invalid && (
                                                    <FieldDescription className="text-destructive font-medium text-xs mt-1">
                                                        {fieldState.error?.message}
                                                    </FieldDescription>
                                                )
                                            }
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name='confirmPassword'
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="mt-4">
                                            <FieldLabel className="text-foreground/80">Confirm Password</FieldLabel>
                                            <div className="relative mt-2">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                                                <PasswordInput
                                                    className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20 focus:border-primary transition-all"
                                                    placeholder="Enter your password"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                            {
                                                fieldState.invalid && (
                                                    <FieldDescription className="text-destructive font-medium text-xs mt-1">
                                                        {fieldState.error?.message}
                                                    </FieldDescription>
                                                )
                                            }
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button
                                type="submit"
                                className="w-full h-12 mt-2 text-base font-medium group relative overflow-hidden"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 flex items-center justify-center">
                                            Sign Up
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </>
                                )}
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link href="/login" className="font-semibold hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
