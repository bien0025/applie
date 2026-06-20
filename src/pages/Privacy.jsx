import PublicPageLayout from '../components/public/PublicPageLayout';

export default function Privacy() {
  return (
    <PublicPageLayout
      title="Privacy Policy"
      subtitle="Applie keeps your job search organized. This page explains what information the app and extension access, how it is used, and how it is stored."
    >
      <div className="space-y-6 text-sm leading-6 text-secondary">
        <section>
          <h2 className="text-base font-semibold text-primary">What we collect</h2>
          <p className="mt-2">
            Applie stores the information you save to your account, including your profile
            details, applications, tasks, resumes, and settings. If you use the Chrome
            extension, it reads the text on the job page you choose to save so it can
            auto-fill job details.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">How we use it</h2>
          <p className="mt-2">
            We use your information to power the app: show your dashboard, save your
            applications and resumes, send reminder emails, and help the extension capture
            job listings. We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">Storage and processors</h2>
          <p className="mt-2">
            Your data is stored in Supabase, which provides authentication, database,
            storage, and serverless functions. Reminder emails are sent through Resend. AI
            features use SiliconFlow to help parse job posts or tailor resume text.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">Extension permissions</h2>
          <p className="mt-2">
            The Chrome extension uses the active tab so it can read job posting text only
            when you click to save it. It does not run continuously in the background on
            every site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">Your control</h2>
          <p className="mt-2">
            You can update or delete your saved information inside Applie. You can also
            uninstall the extension at any time. If you no longer want your account data,
            you can remove it from the app once delete tools are available.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">Updates</h2>
          <p className="mt-2">
            This policy may change as Applie grows. The date at the bottom shows the latest
            update.
          </p>
        </section>

        <p className="pt-2 text-xs uppercase tracking-[0.2em] text-subtle">
          Last updated: June 20, 2026
        </p>
      </div>
    </PublicPageLayout>
  );
}
