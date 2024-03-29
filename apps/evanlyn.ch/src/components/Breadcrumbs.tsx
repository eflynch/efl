import { Trunk } from '../mainstate'

const strip = (html: string) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

type BreadcrumbsProps = {
  ancestors: Trunk[]
  setHead: (head: Trunk | undefined) => void
}

function ellipsize(s: string): string {
  const stripped = strip(s)
  if (stripped.length > 20) {
    return stripped.substring(0, 20) + '...'
  }
  return stripped
}

function Breadcrumbs(props: BreadcrumbsProps): JSX.Element {
  const breadcrumbs = (props.ancestors as [Trunk]).map((parent: Trunk) => {
    const onClick = () => {
      props.setHead(parent)
    }
    const text = parent.value?.title ? ellipsize(parent.value.title) : '...'

    return (
      <span key={parent.serial}>
        <span className="breadcrumb-text" onClick={onClick}>
          {text}
        </span>
        <span className="breadcrumb-sym">‣</span>
      </span>
    )
  })

  return <div className="breadcrumb-wrapper">{breadcrumbs}</div>
}

export default Breadcrumbs
