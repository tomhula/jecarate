'use client';

export function authorize()
{
    const token = localStorage.getItem('token');
    if (!token)
    {
        window.location.href = '/login';
        return false;
    }
    const response = fetch(`/api/login?token=${ token }`)
    .then((response) =>
        {
            return response;
        }
    ).catch((error) =>
        {
            return error;
        }
    );
}