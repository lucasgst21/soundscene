import { useAudioEngine } from '../hooks/useAudioEngine'

export function AudioPlayer() {
    const { initAudio, loadAndPlay, setVolume, stopAll, initialized } = useAudioEngine()

    const startAudio = () => {
        initAudio()
        loadAndPlay('rain', '/sounds/rain.mp3')
        loadAndPlay('keyboard', '/sounds/keyboard.mp3')
        loadAndPlay('wind', '/sounds/wind.mp3')
    }

    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4">SoundScene</h1>
            <p className="text-muted">Ambientes sonoros personalizados para foco e relaxamento</p>

            {!initialized ? (
                <button className="btn btn-primary" onClick={startAudio}>
                    Iniciar Áudio
                </button>
            ) : (
                <>
                    <button className="btn btn-danger mb-4" onClick={stopAll}>
                        Parar Tudo
                    </button>
                    <div className="d-flex flex-column align-items-center gap-3">
                        <div>
                            <label className="form-label">Chuva</label>
                            <input type="range" min={0} max={1} step={0.01} onChange={e => setVolume('rain', parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <label className="form-label">Teclado</label>
                            <input type="range" min={0} max={1} step={0.01} onChange={e => setVolume('keyboard', parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <label className="form-label">Vento</label>
                            <input type="range" min={0} max={1} step={0.01} onChange={e => setVolume('wind', parseFloat(e.target.value))} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
