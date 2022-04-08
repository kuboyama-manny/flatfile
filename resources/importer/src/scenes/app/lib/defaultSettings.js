const defaultSettings =
  {
    fields: [{
      label: 'Robot Name',
      key: 'name'
    }, {
      label: 'Shield Color',
      key: 'shield-color',
      validator: /^[a-zA-Z]+$/
    }, {
      label: 'Robot Helmet Style',
      key: 'helmet-style'
    }, {
      label: 'Call Sign',
      key: 'sign',
      alternates: ['nickname', 'wave'],
      validator: /^\w{4}$/
    }],
    type: 'Robot',
    allowCustom: true
  }

export default defaultSettings
