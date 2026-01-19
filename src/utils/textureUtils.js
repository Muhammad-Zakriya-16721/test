import * as THREE from 'three'

export const generateBrushedMetalTexture = () => {
    const width = 512
    const height = 512
    
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, width, height)
    
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const length = 50 + Math.random() * 200
        const opacity = 0.05 + Math.random() * 0.1
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fillRect(x, y, length, 1)
        
        if (i % 2 === 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
            ctx.fillRect(x, y, length, 1)
        }
    }
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10
        data[i] += noise
        data[i + 1] += noise
        data[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
}

export const generateConcreteTexture = () => {
    const width = 512
    const height = 512
    
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(0, 0, width, height)
    
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = 20 + Math.random() * 60
        const opacity = 0.02 + Math.random() * 0.04
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        const greyVal = Math.random() > 0.5 ? 255 : 0
        gradient.addColorStop(0, `rgba(${greyVal}, ${greyVal}, ${greyVal}, ${opacity})`)
        gradient.addColorStop(1, `rgba(${greyVal}, ${greyVal}, ${greyVal}, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15
        data[i] += noise
        data[i + 1] += noise
        data[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
}

export const generatePaperTexture = () => {
    const width = 512
    const height = 512
    
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#fdfdfd'
    ctx.fillRect(0, 0, width, height)
    
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = 5 + Math.random() * 15
        const opacity = 0.01 + Math.random() * 0.02
        
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 210, ${opacity})`
        ctx.fill()
    }
    
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const length = 2 + Math.random() * 4
        const angle = Math.random() * Math.PI * 2
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
        ctx.strokeStyle = `rgba(180, 180, 170, 0.05)`
        ctx.lineWidth = 0.5
        ctx.stroke()
    }
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 5
        data[i] += noise
        data[i + 1] += noise
        data[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
}

export const generateFilmTexture = () => {
    const width = 512
    const height = 512
    
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.clearRect(0, 0, width, height)
    
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const length = 20 + Math.random() * 60
        const angle = Math.random() * Math.PI * 2
        const opacity = 0.05 + Math.random() * 0.15
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        const cpX = x + Math.cos(angle) * (length / 2) + (Math.random() - 0.5) * 10
        const cpY = y + Math.sin(angle) * (length / 2) + (Math.random() - 0.5) * 10
        const endX = x + Math.cos(angle) * length
        const endY = y + Math.sin(angle) * length
        
        ctx.quadraticCurveTo(cpX, cpY, endX, endY)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 0.5 + Math.random() * 1
        ctx.stroke()
    }
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = 30 + Math.random() * 100
        const opacity = 0.01 + Math.random() * 0.03
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
}
