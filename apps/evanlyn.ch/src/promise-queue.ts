export default class Queue {
  static queue: {
    promise: Promise<void>
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
  }[] = []
  static pendingPromise = false
  static workingOnPromise = false

  static enqueue(promise: Promise<void>) {
    return new Promise((resolve, reject) => {
      this.queue.length = 0
      this.queue.push({
        promise,
        resolve,
        reject,
      })
      this.dequeue()
    })
  }

  static dequeue() {
    if (this.workingOnPromise) {
      return false
    }
    const item = this.queue.shift()
    if (!item) {
      return false
    }
    try {
      this.workingOnPromise = true
      item.promise
        .then((value) => {
          this.workingOnPromise = false
          item.resolve(value)
          this.dequeue()
        })
        .catch((err) => {
          this.workingOnPromise = false
          item.reject(err)
          this.dequeue()
        })
    } catch (err) {
      this.workingOnPromise = false
      item.reject(err)
      this.dequeue()
    }
    return true
  }
}
