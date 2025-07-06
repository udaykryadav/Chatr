
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              // This component displays a pattern of squares with alternating colors
              className={`aspect-square rounded-2xl ${
              i % 2 === 0
                ? "animate-pulse bg-primary/30 dark:bg-primary/60"
                : "bg-primary/10 dark:bg-primary/30"
            }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;