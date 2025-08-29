
interface ProgressBarProps {
  progress: number;
  isDarkMode: boolean;
}

export function ProgressBar({ progress, isDarkMode }: ProgressBarProps) {
  return (
    <div className={`h-1 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
    }`}>
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}