import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function NotFound() {
    return (
        <ErrorDisplay
            title="404 - Page Not Found"
            message="Uh oh! The page you are looking for doesn't exist or has been moved."
            actionText="Take me home"
            actionHref="/"
        />
    );
}
