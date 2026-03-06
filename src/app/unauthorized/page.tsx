import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function UnauthorizedPage() {
    return (
        <ErrorDisplay
            title="Access Denied"
            message="It looks like you don't have permission to access this page."
            actionText="Return to safety"
            actionHref="/"
        />
    );
}
