import PublicPageLayout from '../components/public/PublicPageLayout';

export default function About() {
  return (
    <PublicPageLayout
      title="About Applie"
      subtitle="Applie is a job application tracker that keeps your applications, tasks, resumes, and follow-ups in one place."
    >
      <div className="space-y-6 text-sm leading-6 text-secondary">
        <section>
          <h2 className="text-base font-semibold text-primary">What it does</h2>
          <p className="mt-2">
            Applie helps job seekers track applications, save resumes, set reminders,
            and capture job postings with a Chrome extension. It is designed to keep the
            search process organized without making you manage a lot of different tools.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">What the extension does</h2>
          <p className="mt-2">
            The extension reads the job page you choose to save and sends the job details
            to your Applie account. It uses the page text only when you trigger it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">What data is stored</h2>
          <p className="mt-2">
            Applie stores the information you add: applications, tasks, resumes, profile
            details, and notification preferences. Uploaded resumes stay in your account
            storage and are tied to your user profile.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-primary">Design direction</h2>
          <p className="mt-2">
            The product is built to feel calm and focused, with a simple workflow first.
            More polished visual work comes later, after the core job-search flow is solid.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}
