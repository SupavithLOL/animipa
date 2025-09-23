// src/components/ui/LoadingSkeleton.js
export default function LoadingSkeleton({ type = "anime-grid", count = 12 }) {
  if (type === "anime-grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 rounded-lg aspect-[3/4] mb-3"></div>
            <div className="bg-gray-700 rounded h-4 mb-2"></div>
            <div className="bg-gray-700 rounded h-3 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "genres") {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 rounded-full h-8 w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded-lg h-64"></div>
    </div>
  );
}
