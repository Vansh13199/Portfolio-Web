export function validateName(name: string): string | null {
    const trimmed = name.trim();
    if (!trimmed) return "Name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
    return null;
}

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return null;
}

export function validateMessage(message: string): string | null {
    const trimmed = message.trim();
    if (!trimmed) return "Message is required.";
    if (trimmed.length < 10) return "Message must be at least 10 characters.";
    return null;
}

export function sanitize(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}
