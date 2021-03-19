export default {
  initialStepId: '0DAbNl7NhbiNrN7LAkYJ',
  steps: [
    {
      stepId: '0DAbNl7NhbiNrN7LAkYJ',
      title: 'ご契約者様の情報',
      parts: [
        {
          type: 'full-name',
        },
        {
          type: 'location-info',
        },
        { type: 'landline-mobile-numbers' },
        { type: 'fax-number' },
      ],
      postProcess: {
        defaultDestination: 'AD0bNl7N349NrN7LAkYJ',
        conditionalDestinations: [
          {
            conditionType: 'AND',
            destination: 'BccbNl7N349NrN7LAkYJ',
            conditions: [
              {
                stepId: '0DAbNl7NhbiNrN7LAkYJ',
                partIndex: 0,
                field: 'firstName',
                operator: '==',
                value: 'Bob',
              },
            ],
          },
        ],
      },
    },
    {
      stepId: 'AD0bNl7N349NrN7LAkYJ',
      title: '緊急連絡先',
      parts: [{ type: 'full-name' }],
    },
    {
      stepId: 'BccbNl7N349NrN7LAkYJ',
      title: '住所',
      parts: [
        {
          type: 'location-info',
        },
      ],
    },
  ],
}
