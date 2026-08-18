import { ProfileForm } from "@/components/member/ProfileForm";

export default function AccountProfilePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Profile</h1>
      <p className="mt-1 text-sm text-text-muted">Keep your contact details up to date.</p>
      <div className="mt-6 max-w-lg">
        <ProfileForm />
      </div>
    </div>
  );
}
