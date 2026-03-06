import React from 'react';
import Link from 'next/link';
import { ErrorFace } from './ErrorFace';

interface ErrorDisplayProps {
    title: string;
    message: string;
    actionText?: string;
    actionHref?: string;
    className?: string;
}

export const ErrorDisplay = ({
    title,
    message,
    actionText = "Return Home",
    actionHref = "/",
    className = ""
}: ErrorDisplayProps) => {
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-[#fcfaf7] dark:bg-slate-950 p-6 ${className}`}>
            <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-md relative z-10 mb-8 lg:mb-12">
                {/* A subtle glowing blur behind the face to add more "realism" and depth */}
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10 animate-pulse transition-all duration-3000"></div>
                <ErrorFace />
            </div>

            <div className="text-center space-y-5 max-w-lg z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
                    {message}
                </p>

                <div className="pt-6">
                    <Link
                        href={actionHref}
                        className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 dark:bg-slate-200 text-[#fcfaf7] dark:text-slate-900 font-bold text-lg rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-800/20 dark:shadow-slate-200/10 hover:shadow-2xl hover:shadow-slate-800/30 dark:hover:shadow-slate-200/20"
                    >
                        {actionText}
                    </Link>
                </div>
            </div>
        </div>
    );
};
