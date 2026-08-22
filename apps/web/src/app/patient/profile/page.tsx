import PatientProfileForm from "@/components/shared/PatientProfileForm";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("My Profile", "/patient/profile");

const ProfilePage = () => {
  return (
    <section className="section space-y-16">
      <div>
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Patient profile</h1>
        <p className="text-muted-foreground mt-2">
          Keep your emergency contact and health profile current so booking and
          follow-up stay smooth.
        </p>
      </div>

      <PatientProfileForm />
    </section>
  );
};

export default ProfilePage;
