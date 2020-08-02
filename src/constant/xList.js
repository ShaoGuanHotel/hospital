const imgBaseUrl = 'static/imgs'

// 根据levelId匹配图标
export const iconMap = {
  '1': `${imgBaseUrl}/icon_san.png`,
  '2': `${imgBaseUrl}/icon_san.png`,
  '3': `${imgBaseUrl}/icon_san.png`,
  '4': `${imgBaseUrl}/icon_si.png`,
  'missed': `${imgBaseUrl}/icon_guo.png`,
  'review': `${imgBaseUrl}/icon_fu.png`,
}

export const labelMap = {
  soldier: '军人及家属',
  emergency3: '急诊三级',
  emergency4: '急诊四级',
  noEmergency: '非急诊',
  referral: '复诊患者',
  missed: '过号患者',
}

// 分割线颜色
export const splitColors = ['rgb(0, 193, 140)', 'rgb(254, 198, 41)', 'rgb(1, 177, 227)', 'rgb(136, 132, 214)']
