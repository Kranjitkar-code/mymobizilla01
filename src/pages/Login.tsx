import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { user, loading, isGuest, signInWithGoogle, continueAsGuest } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (user || isGuest) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Helmet>
        <title>Login — Mobizilla</title>
        <meta
          name="description"
          content="Sign in to your Mobizilla account to access repair services, buy products, and more."
        />
      </Helmet>

      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Mobizilla</h1>
          <p className="text-muted-foreground">
            Please sign in to access all features or continue as guest to browse.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={signInWithGoogle}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={continueAsGuest}
          >
            Continue as Guest
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
