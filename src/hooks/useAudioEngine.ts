import { useEffect, useRef, useState } from 'react'

export function useAudioEngine() {
    const contextRef = useRef<AudioContext | null>(null)
    const [sources, setSources] = useState<Record<string, GainNode>>({})
    const [initialized, setInitialized] = useState(false)

    // Inicializa o contexto de áudio após interação do usuário
    const initAudio = () => {
        if (!contextRef.current) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
            contextRef.current = new AudioCtx()
            setInitialized(true)
        }
    }

    // Carrega e toca um som em loop
    const loadAndPlay = async (id: string, url: string) => {
        if (!contextRef.current) return

        const response = await fetch(url)
        const buffer = await response.arrayBuffer()
        const audioBuffer = await contextRef.current.decodeAudioData(buffer)

        const source = contextRef.current.createBufferSource()
        source.buffer = audioBuffer

        const gainNode = contextRef.current.createGain()
        source.connect(gainNode).connect(contextRef.current.destination)
        source.loop = true
        source.start(0)

        setSources(prev => ({ ...prev, [id]: gainNode }))
    }

    // Ajusta o volume de um som específico
    const setVolume = (id: string, volume: number) => {
        if (sources[id] && contextRef.current) {
            sources[id].gain.setValueAtTime(volume, contextRef.current.currentTime)
        }
    }

    // Para e desconecta todos os sons
    const stopAll = () => {
        Object.values(sources).forEach(node => node.disconnect())
        setSources({})
    }

    // Fecha o contexto quando o hook desmontar
    useEffect(() => {
        return () => {
            contextRef.current?.close()
        }
    }, [])

    return { initAudio, loadAndPlay, setVolume, stopAll, initialized }
}
