import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

let setNotif = (title, type) => [title, type]
export const useNotification = () => {
  const [showNotif, setShowNotif] = useState(false)
  const [information, setInformation] = useState({
    title: '',
    type: 'alert'
  })

  useEffect(() => {
    if (showNotif) setTimeout(() => setShowNotif(false), 3000)
  })

  setNotif = (title, type = 'alert') => {
    setShowNotif(true)
    setInformation({
      title,
      type
    })
  }

  let notifInfo = {
    enable: showNotif,
    ...information
  }

  return [notifInfo, setNotif]
}
export { setNotif }

const NotificationBar = ({ title, enable, type }) => {
  useEffect(
    () => {
      if (enable) {
        switch (type) {
          case 'alert':
            //            setBackground('#ff0250')
            break
          case 'warning':
            //          setBackground('#ffab23')
            break
          case 'info':
            //        setBackground('#0054fe')
            break
          default:
            break
        }
      }
    },
    [enable]
  )

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        background: 'red',
        color: 'white'
      }}
    >
      <span>{title}</span>
    </div>
  )
}

NotificationBar.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['alert', 'success', 'info']),
  enable: PropTypes.bool
}
NotificationBar.defaultProps = {
  type: 'alert',
  enable: false
}

export { NotificationBar }
