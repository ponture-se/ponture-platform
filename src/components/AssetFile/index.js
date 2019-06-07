import React from 'react'
import { languageManager } from '../../services'
const currentLang = languageManager.getCurrentLanguage().name

const AssetFile = props => {
  const imgs = ['jpg', 'jpeg', 'gif', 'bmp', 'png']
  const videos = ['mp4', '3gp', 'ogg', 'wmv', 'flv', 'avi']
  const audios = ['wav', 'mp3', 'ogg']
  const ext = props.file.name.split('.')[1]
  const cls = 'unkownFileType ' + props.class

  if (!ext) {
    return (
      <div className={cls}>
        <i className='icon-folder un-icon' />
        <span className='un-text'>uknown</span>
      </div>
    )
  } else {
    if (imgs.indexOf(ext.toLowerCase()) !== -1) {
      return (
        <img
          src={
            props.file.url[currentLang]
              ? props.file.url[currentLang]
              : props.file.url
          }
          alt=''
        />
      )
    } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
      return <i className='icon-video' />
    } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
      return <i className='icon-audio' />
    } else {
      return (
        <div className={cls}>
          <i className='icon-file-text un-icon' />
          <span className='un-text'>{props.file.name}</span>
        </div>
      )
    }
  }
}

export default AssetFile
