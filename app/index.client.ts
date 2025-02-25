'use client';

export function authorize()
{
    const token = localStorage.getItem('token');
    if (!token)
    {
        window.location.href = '/login';
        return false;
    }
    fetch(`/api/login?token=${ token }`)
        .then((response) =>
            {
                if (!response.ok)
                {
                    window.location.href = '/login';
                }
            }
        )
        .catch((error) =>
            {
                window.location.href = '/login';
            }
        );

    return true;
}