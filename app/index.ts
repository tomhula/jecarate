'use client';

export function authorize()
{
    if (typeof window === "undefined") return;

    const token = localStorage.getItem('token');
    if (!token)
    {
        window.location.href = '/login';
        return false;
    }
    fetch(`/api/login?token=${ token }`)
        .then((response) =>
            {
                return response;
            }
        )
        .catch((error) =>
            {
                return error;
            }
        );
}