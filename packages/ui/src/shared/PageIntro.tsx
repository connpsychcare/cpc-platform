interface PageIntroProps {
  title: string;
  description?: string;
  /** Small-caps label above the title, matching the public page headers. */
  eyebrow?: string;
}

const PageIntro = ({ title, description, eyebrow }: PageIntroProps) => {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageIntro;
