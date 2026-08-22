import { emailTheme } from "./theme";

interface NumericCodeProps {
  code: string;
}

export const NumericCode = ({ code }: NumericCodeProps) => (
  <div className="my-6 text-center">
    {code.split("").map((digit, i) => (
      <span
        key={i}
        className="mx-0.75 inline-block min-w-10 rounded-xl py-3 text-xl font-mono font-bold"
        style={{
          backgroundColor: emailTheme.codeBg,
          border: `1.5px solid ${emailTheme.border}`,
          color: emailTheme.primary,
        }}
      >
        {digit}
      </span>
    ))}
  </div>
);
