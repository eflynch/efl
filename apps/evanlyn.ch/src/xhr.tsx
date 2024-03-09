export function getJSON(
  url: string,
  successHandler: (data: any) => void,
  errorHandler: (data: any) => void
) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', url, true)
  xhr.withCredentials = true
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // `DONE`
      let status = xhr.status
      if (status === 200) {
        let data = JSON.parse(xhr.responseText)
        successHandler && successHandler(data)
      } else {
        errorHandler && errorHandler(status)
      }
    }
  }
  xhr.send()
}

export function putJSON(url: string, data: object) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.withCredentials = true
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const status = xhr.status

        if (status === 200) {
          resolve()
        } else {
          reject()
        }
      }
    }
  })
}
