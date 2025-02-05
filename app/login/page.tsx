import LoginForm from '../ui/login/login-form';

export default function Page() {
    return (
        <div>
            <LoginForm postUrl={ '/api/login' } />
        </div>
    );
}
