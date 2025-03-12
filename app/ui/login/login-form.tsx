'use client'

import InputField from "@/app/ui/util/input-field";
import Image from "next/image";
import {showAlertBubble} from "@/app/ui/util/util";

interface LoginFormProps
{
    postUrl: string;
}

export default function LoginForm({postUrl}: LoginFormProps)
{

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await authenticate(postUrl);
    };
    return (
        <div className={`flex min-h-screen items-center justify-center px-6 bg-gray-100`}>
            {/* Blur Overlay */}
            <form  className="w-full max-w-lg rounded-xl bg-white p-16 shadow-1xl" onSubmit={handleSubmit}>
                {/* Title */}
                <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
                    Přihlášení
                </h1>
                <div className="space-y-8">
                    {/* Email Input */}
                    <div>
                        <InputField type="text" placeholder="Uživatelské jméno" required minLength={0} name="text"/>
                    </div>

                    {/* Password Input */}
                    <div>
                        <InputField type="password" placeholder="Heslo" required minLength={6}
                                    name="password"/>
                    </div>

                    {/* Sign In Button */}
                    <button
                        className="w-full rounded-xl bg-blue-500 py-4 text-xl font-bold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        type="submit"
                        onClick={() => authenticate(postUrl)}
                    >
                        PŘIHLÁSIT
                    </button>
                </div>
            </form>
        </div>
    );
}

async function authenticate(postUrl: string)
{
    const username = (document.querySelector('input[name="text"]') as HTMLInputElement).value
    const password = (document.querySelector('input[name="password"]') as HTMLInputElement).value

    const bubble = showAlertBubble("info", "Přihlašování...")
    const response = await fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        }
    )

    bubble.onClose()

    if (!response.ok)
    {
        showAlertBubble("error", "Nesprávný email nebo heslo")
        return
    }

    showAlertBubble("success", "Úspěšně přihlášen")

    const {token} = await response.json()
    localStorage.setItem('token', token)
    window.location.href = '/dashboard'
}
