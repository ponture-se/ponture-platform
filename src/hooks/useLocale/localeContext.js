import React, { useState } from 'react'

const LocaleContext = React.createContext([{}, () => {}])
const LocaleProvider = props => {
  const [state, setState] = useState({ direction: 'ltr' })
  return (
    <LocaleContext.Provider value={[state, setState]}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export { LocaleContext, LocaleProvider }
