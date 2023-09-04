const RESOURCE_STATUS_MAP = {
  published: 'Published',
  draft: 'Draft',
};

const RESOURCE_STATUS_LABELS = [
  { label: RESOURCE_STATUS_MAP.published, value: true },
  { label: RESOURCE_STATUS_MAP.draft, value: false },
];

const USER_STATUS_LABELS = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

export { RESOURCE_STATUS_MAP, RESOURCE_STATUS_LABELS, USER_STATUS_LABELS };
