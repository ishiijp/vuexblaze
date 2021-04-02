export default {
  initialStepId: '0DAbNl7NhbiNrN7LAkYJ',
  steps: [
    {
      stepId: '0DAbNl7NhbiNrN7LAkYJ',
      title: 'ご契約者様の情報',
      message: '駐車場をお申込みされる契約名義人の情報を入力してください',
      parts: [
        {
          partId: '1DAbN333hbiNrN7LAkYJ',
          type: 'general-select',
          options: {
            selectOptions: [
              {
                value: 1,
                label: '既に車をお持ちの方',
              },
              {
                value: 0,
                label: '新規購入等の理由で車をまだお持ちでない方',
              },
            ],
          },
        },
      ],
      postProcess: {
        defaultDestination: 'AD0bNl7N349NrN7LAkYJ',
      },
    },
    {
      stepId: 'AD0bNl7N349NrN7LAkYJ',
      title: '緊急連絡先',
      parts: [
        {
          partId: '9DAbNl7NhbiNrN7LAkYJ',
          type: 'full-name',
          messages: {},
        },
        {
          partId: '2DAbNl7NhbiNrN7LAkYJ',
          type: 'location-info',
          messages: {
            _main: '最後まで正しく入力してください',
            zip: '半角数字ハイフンなし',
          },
        },
        {
          partId: '3DAbNl7NhbiNrN7LAkYJ',
          type: 'contact-info',
          messages: {
            _main: '固定電話と携帯番号のどちらかは必須です',
            landlineNumber: '半角数字ハイフンなし',
            mobileNumber: '半角数字ハイフンなし',
          },
        },
        {
          partId: '1DAbeeeNhbiNrN7LAkYJ',
          type: 'job-info',
          messages: {},
        },
        {
          partId: '2DAbNl7NhbiNrN7LAkYJ',
          type: 'location-info',
          messages: {
            _main: '最後まで正しく入力してください',
            zip: '半角数字ハイフンなし',
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
                partId: '1DAbNl7NhbiNrN7LAkYJ',
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
      stepId: 'BccbNl7N349NrN7LAkYJ',
      title: '住所',
      parts: [
        {
          partId: '10AbNl7Nhb234N7LAkYJ',
          type: 'location-info',
          messages: {
            _main: '最後まで正しく入力してください',
            zip: '半角数字ハイフンなし',
          },
        },
      ],
    },
  ],
}
