export default {
  initialStepId: '0DAbNl7NhbiNrN7LAkYJ',
  steps: [
    {
      stepId: '0DAbNl7NhbiNrN7LAkYJ',
      title: 'ご契約者様の情報',
      desc: '駐車場をお申込みされる契約名義人の情報を入力してください',
      parts: [
        {
          type: 'full-name',
        },
        {
          type: 'location-info',
        },
        { type: 'contact-info' },
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
