import { Button } from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom"; // shadcn Button

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="p-10 flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
            <div className="space-y-8 text-center">
                {/* 404 Text with Icon */}
                <div className="relative">
                    <h1 className="text-9xl font-bold text-primary">404</h1>

                </div>

                {/* Message */}
                <p className="text-2xl font-medium text-foreground sm:text-3xl">
                    Oops! Page Not Found
                </p>
                <p className="mx-auto max-w-md text-muted-foreground sm:text-lg">
                    The page you’re looking for doesn’t exist or has been moved. Let’s get
                    you back on track!
                </p>

                {/* Back to Home Button */}
                <Button
                    onClick={() => {navigate("/dashboard")}}
                    className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Go Back Home
                </Button>
            </div>
        </div>
    );
}