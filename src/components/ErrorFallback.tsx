import { AlertTriangle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
};

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <pre className="max-h-32 w-full overflow-auto rounded-md bg-muted p-2 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>

          {resetErrorBoundary && (
            <Button
              variant="outline"
              onClick={resetErrorBoundary}
              className="mt-2 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
