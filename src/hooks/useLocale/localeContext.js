import React, { useState } from 'react'
import sv from './locales/sv'
const LocaleContext = React.createContext([{}, () => {}])
const LocaleProvider = props => {
  const [state, setState] = useState({ direction: 'ltr', appLocale: sv })
  return (
    <LocaleContext.Provider value={[state, setState]}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export { LocaleContext, LocaleProvider }
