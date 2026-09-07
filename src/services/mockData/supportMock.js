export const MOCK_SUPPORT_TICKETS = [
  {
    id: 'tkt_01',
    ticketNumber: 'BC-SUP-48921',
    subject: 'Assistance required for Survey 619/C GIS Polygon verification',
    category: 'LAND_VERIFICATION',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAgent: 'Aditi Deshmukh (Land Officer)',
    createdAt: '2026-08-05T14:30:00Z',
    messages: [
      {
        sender: 'user',
        name: 'Ramesh Patel',
        text: 'The revenue boundary on the eastern canal boundary needs slight realignment. Uploaded revised survey sketch.',
        timestamp: '05 Aug 2026, 02:30 PM',
      },
      {
        sender: 'support',
        name: 'Aditi Deshmukh',
        text: 'Thank you Mr. Patel. Our GIS team has received your revised sketch and will update the polygon boundaries within 24 hours.',
        timestamp: '06 Aug 2026, 10:15 AM',
      },
    ],
  },
  {
    id: 'tkt_02',
    ticketNumber: 'BC-SUP-31204',
    subject: 'Query regarding Soil Sample collection slot reschedule',
    category: 'SOIL_TESTING',
    priority: 'NORMAL',
    status: 'RESOLVED',
    assignedAgent: 'Karan Dave',
    createdAt: '2026-06-12T09:00:00Z',
    messages: [
      {
        sender: 'user',
        name: 'Ramesh Patel',
        text: 'Can we reschedule the soil sample pickup to morning 11 AM due to canal watering?',
        timestamp: '12 Jun 2026, 09:00 AM',
      },
      {
        sender: 'support',
        name: 'Karan Dave',
        text: 'Your pickup has been successfully rescheduled to 14 June, 11:30 AM. Partner field agent Devang will call before arrival.',
        timestamp: '12 Jun 2026, 11:00 AM',
      },
    ],
  },
];
