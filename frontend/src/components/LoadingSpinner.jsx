export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-transparent border-t-blue-500 border-r-purple-500 animate-spin`}
        ></div>

        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4"} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse`}
          ></div>
        </div>
      </div>

      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
