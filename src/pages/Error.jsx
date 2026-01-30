import React from "react";

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Oops!</h1>
                <p className="text-slate-600">Sorry, an unexpected error has occurred.</p>
                <a href="/" className="mt-4 inline-block text-[#d4a017] hover:underline">Go back home</a>
            </div>
        </div>
    );
};

export default ErrorPage;
