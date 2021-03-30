export default {
  initialStepId: '0DAbNl7NhbiNrN7LAkYJ',
  steps: [
    {
      stepId: '0DAbNl7NhbiNrN7LAkYJ',
      title: 'ご契約者様の情報',
      message: '駐車場をお申込みされる契約名義人の情報を入力してください',
      parts: [
        {
          type: 'full-name',
        },
        {
          type: 'location-info',
          messages: {
            _main: '最後まで正しく入力してください',
            zip: '半角数字ハイフンなし',
          },
        },
        {
          type: 'contact-info',
          messages: {
            _main: '固定電話と携帯番号のどちらかは必須です',
            landlineNumber: '半角数字ハイフンなし',
            mobileNumber: '半角数字ハイフンなし',
          },
        },
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
