export default function FancySpinner({ className = '', progress }: { className?: string; progress: number }) {
  return (
    <div className={`${className} relative h-52 w-52 `}>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-7xl font-medium">{progress <= 99 ? progress : 99}</h1>
        <p className="absolute left-full top-2 text-3xl text-gray-30">%</p>
      </div>
      <svg className="animate-spin text-gray-5" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentcolor" strokeWidth="4" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="rgb(0,102,255)"
          strokeWidth="4"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
