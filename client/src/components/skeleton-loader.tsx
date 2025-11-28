import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonAnalysisResults() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <div className="h-6 shimmer-loading rounded w-3/4 mb-2"></div>
              <div className="h-4 shimmer-loading rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 shimmer-loading rounded"></div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-lg bg-card border border-card-border">
                    <div className="h-4 w-4 shimmer-loading rounded mb-2"></div>
                    <div className="h-6 shimmer-loading rounded w-8 mb-2"></div>
                    <div className="h-3 shimmer-loading rounded w-12"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <div className="h-6 shimmer-loading rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 shimmer-loading rounded w-1/4"></div>
                  <div className="h-3 shimmer-loading rounded"></div>
                  <div className="h-3 shimmer-loading rounded w-5/6"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
