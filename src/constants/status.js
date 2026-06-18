// The selectable pipeline statuses + how each maps to a Badge variant.
// "Archived" is handled separately as a flag (we never delete), so it's
// not in this list.
export const STATUSES = [
  'Applied',
  'Interview',
  'Offer',
  'Accepted',
  'Rejected',
];

export const STATUS_BADGE = {
  Applied: 'blue',
  Interview: 'amber',
  Offer: 'green',
  Accepted: 'green',
  Rejected: 'red',
  Archived: 'neutral',
};
