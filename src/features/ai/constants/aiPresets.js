export const ROLE_AI_CONTEXTS = {
  FARMER: {
    title: 'Farmer Intelligence Assistant',
    greeting: 'Namaste Kisan Bandhu! I am Bhumitra AI, your personal agricultural advisor. How can I help you with your lands, trees, soil, or subsidies today?',
    tagline: 'Land • Insurance • Soil • Schemes • Carbon',
    suggestedQuestions: [
      'How do I register a new land parcel with GIS mapping?',
      'What is the premium for insuring 50 Teak & Sandalwood trees?',
      'How to request on-farm soil sample collection?',
      'Am I eligible for PM Kisan Samman Nidhi scheme?',
      'How to track my recent soil laboratory report?',
      'How can I earn rewards through agroforestry carbon credits?',
    ],
    quickActions: [
      {
        title: 'Register Land',
        description: 'Start step-by-step GIS polygon mapping',
        path: '/farmer/lands',
        icon: 'MapPin',
        badge: 'Land Desk',
      },
      {
        title: 'Insure Trees',
        description: 'Get single/multi tree coverage quotes',
        path: '/farmer/insurance',
        icon: 'ShieldAlert',
        badge: 'Insurance',
      },
      {
        title: 'Book Soil Test',
        description: 'Schedule accredited lab sample pickup',
        path: '/farmer/soil',
        icon: 'FlaskConical',
        badge: 'Soil Lab',
      },
      {
        title: 'View Govt Schemes',
        description: 'Explore state & central farmer subsidies',
        path: '/schemes',
        icon: 'Landmark',
        badge: 'Subsidies',
      },
    ],
  },
  GOVERNMENT: {
    title: 'Institutional Governance Assistant',
    greeting: 'Welcome Officer! Bhumitra AI is ready to assist with jurisdiction boundaries, public green assets, and farmer campaign mobilization.',
    tagline: 'Public Assets • Campaigns • Jurisdictions • Schemes',
    suggestedQuestions: [
      'How to record and geotag public parks and avenue trees?',
      'How do I initiate an on-demand farmer soil testing campaign?',
      'What are the active projects within my administrative jurisdiction?',
      'How to coordinate local farmer enrollment assistance?',
      'Generate summary of permitted farmers in Anand district.',
    ],
    quickActions: [
      {
        title: 'Launch Campaign',
        description: 'Create on-demand farmer drive',
        path: '/government/campaigns',
        icon: 'Landmark',
        badge: 'Campaigns',
      },
      {
        title: 'Add Public Asset',
        description: 'Register municipal parks & trees',
        path: '/government/assets',
        icon: 'MapPin',
        badge: 'Assets',
      },
      {
        title: 'Farmers in Area',
        description: 'View permitted jurisdiction list',
        path: '/government/farmers',
        icon: 'Users',
        badge: 'Jurisdiction',
      },
      {
        title: 'Area Projects',
        description: 'Monitor ongoing civic agricultural works',
        path: '/government/projects',
        icon: 'FolderKanban',
        badge: 'Projects',
      },
    ],
  },
  PARTNER: {
    title: 'Partner Operations Assistant',
    greeting: 'Hello Partner Team! Bhumitra AI is active for field tasks, lab sample workflows, GPS visits, and inspection evidence management.',
    tagline: 'Field Tasks • Visits • Lab Queue • Evidence',
    suggestedQuestions: [
      'How do I complete a geotagged tree insurance inspection?',
      'What are the pending soil samples in the lab intake queue?',
      'How to submit photographic evidence with GPS timestamps?',
      'How to generate and download an official soil laboratory report?',
      'Where can I track submitted invoice approval statuses?',
    ],
    quickActions: [
      {
        title: 'Task Queue',
        description: 'View assigned field & lab assignments',
        path: '/partner/tasks',
        icon: 'FolderKanban',
        badge: 'Tasks',
      },
      {
        title: 'Schedule Visit',
        description: 'Plan GPS verified on-site inspection',
        path: '/partner/visits',
        icon: 'MapPin',
        badge: 'Field Visits',
      },
      {
        title: 'Lab Queue',
        description: 'Manage N-P-K testing workflow',
        path: '/partner/lab',
        icon: 'FlaskConical',
        badge: 'Testing',
      },
      {
        title: 'Submit Report',
        description: 'Upload inspection & analysis sheets',
        path: '/partner/reports',
        icon: 'FileText',
        badge: 'Reports',
      },
    ],
  },
  SUPER_ADMIN: {
    title: 'Super Admin Governance Assistant',
    greeting: 'Welcome Super Administrator. Bhumitra AI provides system oversight, approval queue analysis, and RBAC governance lookup.',
    tagline: 'Approvals • Verification • RBAC • Audit Logs',
    suggestedQuestions: [
      'Show pending farmer, government and partner onboarding queues.',
      'How do I approve or raise a query on a land GIS boundary submission?',
      'What are the recent security and financial audit log entries?',
      'How to verify an insurance claim and assign a field inspection partner?',
      'Check system integration health and database latency metrics.',
    ],
    quickActions: [
      {
        title: 'Approval Center',
        description: 'Review pending onboarding submissions',
        path: '/admin/approvals',
        icon: 'Users',
        badge: 'Queues',
      },
      {
        title: 'Land & GIS Desk',
        description: 'Verify survey boundaries & GeoJSON polygons',
        path: '/admin/lands',
        icon: 'MapPin',
        badge: 'GIS Review',
      },
      {
        title: 'Tree Insurance & Claims',
        description: 'Underwrite policies & assign inspectors',
        path: '/admin/insurance',
        icon: 'ShieldAlert',
        badge: 'Underwriting',
      },
      {
        title: 'Security Audit Logs',
        description: 'Inspect immutable actor mutation logs',
        path: '/admin/audit',
        icon: 'FileText',
        badge: 'Audits',
      },
    ],
  },
};

export const MOCK_AI_RESPONSES = [
  {
    keywords: ['land', 'register', 'khasra', 'survey', 'gis', 'polygon'],
    response: `To register your land on BHUMICRED:
1. Navigate to **My Lands** and select **"Add Land"**.
2. Choose beneficiary type (**Myself** or **Someone Else**).
3. Enter Survey Number, Khasra Number, and Land Area details.
4. Upload title deed / ownership supporting documents.
5. In the **GIS Mapping** step, draw your exact polygon boundary coordinates.
6. Submit for BHUMICRED administrative verification. Once approved, the land becomes active for Tree Insurance and Soil Testing!`,
    suggestedAction: { label: 'Open Add Land Screen', path: '/farmer/lands' },
  },
  {
    keywords: ['insurance', 'tree', 'premium', 'policy', 'sandalwood', 'teak', 'plantation'],
    response: `BHUMICRED Tree & Plantation Insurance provides coverage against fire, cyclonic storms, flood damage, pest outbreaks, and drought.
- **Single Tree Option**: Insure specific high-value species like Sandalwood, Teak, or Mahogany.
- **Multi-Tree / Farm**: Insure entire orchards or commercial plantations.
- **Underwriting Flow**: Select your registered land parcel, enter tree counts and age, view transparent premium quotes, and submit. An inspection partner may verify GPS photos before activation.`,
    suggestedAction: { label: 'Explore Insurance Catalog', path: '/farmer/insurance' },
  },
  {
    keywords: ['soil', 'test', 'sample', 'lab', 'npk', 'carbon'],
    response: `Soil health testing on BHUMICRED connects your farm directly to certified laboratory grids:
1. Request a test package (Standard 5-parameter or Advanced 12-parameter micronutrient).
2. An authorized field partner collects geo-tagged soil cores at your land.
3. Track progress: **Requested → Sample Collected → In Lab → Testing → Report Ready**.
4. Download your official tamper-proof PDF lab certificate detailing pH, Nitrogen (N), Phosphorus (P), Potassium (K), and Organic Carbon.`,
    suggestedAction: { label: 'Request Soil Test', path: '/farmer/soil' },
  },
  {
    keywords: ['scheme', 'pm kisan', 'subsidy', 'government', 'kisan'],
    response: `Available Sovereign Government Schemes include:
- **PM Kisan Samman Nidhi**: ₹6,000 annually in three direct installments.
- **Paramparagat Krishi Vikas Yojana (PKVY)**: Financial assistance for organic farming certification and bio-inputs.
- **State Agroforestry Nursery Subsidy**: Free saplings and fencing assistance for eligible farmers.
You can view detailed eligibility rules and request digital application assistance in the Government Schemes section.`,
    suggestedAction: { label: 'Browse Government Schemes', path: '/schemes' },
  },
  {
    keywords: ['campaign', 'panchayat', 'public asset', 'nagar'],
    response: `Government bodies can organize targeted field campaigns:
- **On-Demand Drives**: Soil testing drives, tree plantation awareness, or land digitization camps.
- **Target Metrics**: Set target farmer count, scheduled timeline, and requested services.
- **Partner Dispatch**: BHUMICRED Super Admin approves and assigns certified field partners to carry out the campaign in your jurisdiction.`,
    suggestedAction: { label: 'Manage Campaigns', path: '/government/campaigns' },
  },
  {
    keywords: ['task', 'visit', 'inspection', 'lab queue', 'evidence'],
    response: `Partner Operational Workflow:
1. Review assigned tasks and instructions in your **Task Queue**.
2. Schedule and execute on-site field visits with **GPS coordinates and timestamp capture**.
3. Complete standardized inspection checklists and upload high-resolution photographic evidence.
4. Submit reports for independent administrative review.`,
    suggestedAction: { label: 'Open Assigned Tasks', path: '/partner/tasks' },
  },
  {
    keywords: ['approval', 'queue', 'audit', 'rbac', 'super admin', 'verify'],
    response: `Super Admin Operations:
- **Approval Queues**: Review onboarding dossiers (Farmer, Government, Partner) with one-click Approve, Query (with mandatory remarks), or Reject actions.
- **GIS Land Review**: Inspect boundary polygons against revenue records.
- **Audit Trails**: Every mutation is cryptographically timestamped with Actor ID, previous state, new state, and reason.`,
    suggestedAction: { label: 'Open Admin Approval Center', path: '/admin/approvals' },
  },
  {
    keywords: ['carbon', 'credit', 'green', 'wallet', 'rewards'],
    response: `BHUMICRED Carbon & Green Opportunities:
- Farmers practicing agroforestry or regenerative soil techniques can submit requests for carbon credit baseline assessments.
- All credits and financial rewards are server-authoritative and credited directly to your double-entry **BHUMICRED Wallet** for bank withdrawal.`,
    suggestedAction: { label: 'View Carbon Opportunities', path: '/carbon' },
  },
];
