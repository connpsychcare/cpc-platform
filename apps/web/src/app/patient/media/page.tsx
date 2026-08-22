import MediaLibrary from "@workspace/ui/media/library";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("My Media", "/patient/media");

export default function PatientMediaPage() {
  return (
    <section className="section space-y-8">
      <div>
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">My media</h1>
        <p className="mt-2 text-muted-foreground">
          Upload and manage the files you use across your patient account and
          profile.
        </p>
      </div>

      <MediaLibrary />
    </section>
  );
}
