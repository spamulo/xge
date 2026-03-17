import { V2 } from "./v2"

// async
export function loadImageToBlob(url: any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url)
    xhr.responseType = "blob"
    xhr.onload = () => {
      resolve(xhr.response)
    }
    xhr.onerror = reject
    xhr.send()
  })
}

// async
export function blobToByteArray(blob: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      if (e.target) {
        const c: any = e.target.result
        const arr = new Uint8Array(c)
        resolve(arr)
      } else {
        reject()
      }
    })
    reader.readAsArrayBuffer(blob);
  })
}

export function molestByteArray(arr: any, amount: any) { // mutates arr
  for (let i = 0; i < amount; i ++) {
    const j = Math.floor(Math.random() * arr.length)
    arr[j] = Math.floor(Math.random() * 256)
  }
  return arr
}

export function byteArrayToBlob(arr: any) {
  return new Blob([arr])
}

export function blobToImage(blob: any) { // async
  return new Promise((resolve, reject) => {
    const img = new Image()
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob)
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject()
    }
    img.src = imageUrl
  })
}

export function getImageData(img: any) {
  // an intermediate "buffer" 2D context is necessary
  const [canvas, ctx] = createTemporaryContext2D([img.width, img.height]);
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, img.width, img.height);
}

export function isReasonableImageData(imageData: any) {
  return imageData[0] != 0 || imageData[1] != 0 || imageData[2] != 0
}

export function createTemporaryContext2D(size: V2): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas")
  canvas.width = size[0]
  canvas.height = size[1]
  const context = canvas.getContext("2d", { "alpha": true })
  if (!context) {
    throw new Error('failed to acquire context')
  }
  return [canvas, context]
}
