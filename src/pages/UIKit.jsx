import { useState } from 'react';
import { Upload, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Input,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  Switch,
  Tag,
  Textarea,
} from '../components/ui';

// A living reference of every design system component.
// Reachable at /kit — not part of the main app navigation.
function Section({ title, children }) {
  return (
    <section className="mb-11">
      <h2 className="mb-4 border-b border-border pb-2 font-ui text-xs font-bold uppercase tracking-wider text-subtle">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function UIKit() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <>
      <PageHeader title="UI Kit" subtitle="Every component, straight from the design system." />

      <Section title="Typography">
        <div className="space-y-1.5">
          <p className="text-3xl font-semibold tracking-tight">The quick fox</p>
          <p className="text-xl font-medium">Section heading</p>
          <p className="text-md font-normal leading-normal text-secondary">
            Lead paragraph — a little larger for introductory text.
          </p>
          <p className="text-base font-light leading-normal text-secondary">
            Body text — lightweight Fraunces at 15px reads beautifully at length.
          </p>
          <p className="text-sm text-subtle">Caption / label text at 13px</p>
          <p className="font-ui text-xs font-semibold uppercase tracking-wider text-accent">
            Eyebrow / badge text
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
          <Button variant="primary">Get started</Button>
          <Button variant="secondary">Learn more</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
          <Button size="sm">Small</Button>
          <Button size="md">Default</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button disabled>Disabled</Button>
          <Button>
            <Upload size={15} /> Upload
          </Button>
          <Button variant="secondary">
            <SettingsIcon size={15} /> Settings
          </Button>
          <Button variant="ghost">
            <ArrowLeft size={15} /> Back
          </Button>
        </div>
      </Section>

      <Section title="Badges & Tags">
        <div className="mb-2.5 flex flex-wrap gap-2.5">
          <Badge variant="amber">Active</Badge>
          <Badge variant="green">Published</Badge>
          <Badge variant="red">Error</Badge>
          <Badge variant="blue">Info</Badge>
          <Badge variant="neutral">Draft</Badge>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Tag active>Design</Tag>
          <Tag>Branding</Tag>
          <Tag>UI/UX</Tag>
          <Tag>Mobile</Tag>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="flex max-w-md flex-col gap-3">
          <Input label="Full name" placeholder="Jane Smith" />
          <Input
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            hint="We'll never share your email."
          />
          <Input label="Username" defaultValue="jane@" error="Username can't contain special characters." />
          <Select
            label="Role"
            options={[
              { value: 'designer', label: 'Designer' },
              { value: 'developer', label: 'Developer' },
              { value: 'pm', label: 'Product Manager' },
            ]}
          />
          <Textarea label="Bio" placeholder="Tell us about yourself…" />
        </div>
      </Section>

      <Section title="Toggles & Progress">
        <div className="mb-4 flex flex-col gap-3">
          <Switch checked={emailNotif} onChange={setEmailNotif} label="Email notifications" />
          <Switch checked={autoSave} onChange={setAutoSave} label="Auto-save drafts" />
        </div>
        <div className="flex max-w-md flex-col gap-3">
          <ProgressBar label="Profile complete" value={72} />
          <ProgressBar label="Storage used" value={38} />
        </div>
      </Section>

      <Section title="Alerts">
        <div className="flex max-w-xl flex-col gap-2.5">
          <Alert variant="success" title="Changes saved">
            Your profile has been updated successfully.
          </Alert>
          <Alert variant="error" title="Upload failed">
            File exceeds the 10MB size limit.
          </Alert>
          <Alert variant="warning" title="Subscription expiring">
            Your plan renews in 3 days.
          </Alert>
          <Alert variant="info" title="New feature available">
            Try the redesigned dashboard.
          </Alert>
        </div>
      </Section>

      <Section title="Avatars">
        <div className="flex flex-wrap items-center gap-2.5">
          <Avatar initials="JD" size="sm" />
          <Avatar initials="JD" size="md" />
          <Avatar initials="JD" size="lg" />
          <Avatar initials="MK" size="sm" color="stone" />
          <Avatar initials="MK" size="md" color="stone" />
          <Avatar initials="MK" size="lg" color="stone" />
        </div>
      </Section>

      <Section title="Cards">
        <div className="mb-2.5 grid grid-cols-2 gap-2.5">
          <StatCard label="Applications" value="42" change="↑ 12% this month" />
          <StatCard label="Interviews" value="8" change="↓ 3% this week" trend="down" />
        </div>
        <Card>
          <div className="mb-2.5 flex items-start justify-between">
            <Badge variant="amber">Active</Badge>
            <span className="font-ui text-xs text-subtle">2h ago</span>
          </div>
          <h3 className="mb-1.5 text-md font-medium tracking-tight">
            Senior Product Designer
          </h3>
          <p className="mb-4 text-sm font-light leading-normal text-secondary">
            Figma · Remote — tracking this application through the interview stage.
          </p>
          <div className="flex items-center justify-between border-t border-border pt-3.5">
            <div className="flex gap-1.5">
              <Avatar initials="JS" size="sm" />
              <Avatar initials="MK" size="sm" color="stone" />
            </div>
            <Button variant="secondary" size="sm">
              Open →
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Dividers">
        <p className="mb-3 text-sm text-secondary">Content above</p>
        <Divider className="my-5" />
        <p className="mb-3 text-sm text-secondary">Content below</p>
        <Divider label="or continue with" className="my-5" />
        <Button variant="secondary" className="w-full">
          Continue with Google
        </Button>
      </Section>
    </>
  );
}
