import { useRef } from 'react'

type ContentIFrameProps = {
  src: string
  onEscape: () => void
  bootstrap?: object
}

function ContentIFrame(props: ContentIFrameProps): JSX.Element {
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const onLoad = () => {
    const iFrame = iFrameRef.current
    if (iFrame) {
      iFrame.contentWindow?.focus()
      iFrame.contentWindow?.focus()
    }
    if (iFrame?.contentWindow?.document.body) {
      iFrame.contentWindow.document.body.onkeydown = (e) => {
        if (e.key === 'Escape') {
          props.onEscape()
        }
      }
    }
    if (props.bootstrap && iFrame?.contentWindow) {
      ;(iFrame.contentWindow as unknown as { bootstrap: object }).bootstrap =
        props.bootstrap
    }
  }

  return (
    <iframe title={props.src} ref={iFrameRef} onLoad={onLoad} src={props.src} />
  )
}

export default ContentIFrame
