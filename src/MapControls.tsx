import React from "react"
import { getStepDisplayMs, MapSteps } from "./mapReducer"

export interface MapControlsProps {
  handleReInit: () => void
  handleDirectStep: (newStep: number) => void
  handleNext: () => void
  steps: MapSteps
  step: number
}

const DEFAULT_PLAY_DELAY = 500; // Fallback pause when there's no prior step to read
const duration = 1000; // Duration in milliseconds (1 second)

export default function MapControls(props: MapControlsProps) {
  const { handleNext, steps, step } = props

  const playTimerRef = React.useRef<number>();
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showSteps, setShowSteps] = React.useState(import.meta.env.DEV)

  function handlePlayToggle() {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (step >= steps.length) return
    handleNext()
    setIsPlaying(true)
  }

  function handleReInit() {
    setIsPlaying(false)
    props.handleReInit()
  }

  function handleDirectStep(newStep: number) {
    setIsPlaying(false)
    props.handleDirectStep(newStep)
  }

  React.useEffect(() => {
    if (!isPlaying) return

    if (step >= steps.length) {
      setIsPlaying(false)
      return
    }

    const justRanStep = steps[step - 1]
    const displayMs = justRanStep ? getStepDisplayMs(justRanStep) : DEFAULT_PLAY_DELAY
    playTimerRef.current = window.setTimeout(handleNext, duration + displayMs)
    return () => window.clearTimeout(playTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, step])

  return (
    <div className='controls'>
      <div className='controlsBar'>
        <button className='iconButton' onClick={handleReInit} title="Restart" aria-label="Restart">⟲</button>
        <button
          className='iconButton playButton'
          onClick={handlePlayToggle}
          disabled={!isPlaying && step >= steps.length}
          title={isPlaying ? 'Stop' : 'Play'}
          aria-label={isPlaying ? 'Stop' : 'Play'}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
        <button
          className='iconButton'
          onClick={handleNext}
          disabled={step >= steps.length}
          title="Next step"
          aria-label="Next step"
        >
          {'⏭'}
        </button>
        <button
          className={`iconButton stepsToggle ${showSteps ? 'active' : ''}`}
          onClick={() => setShowSteps(show => !show)}
          title="Toggle step picker"
          aria-label="Toggle step picker"
        >
          {'•••'}
        </button>
      </div>
      {showSteps && (
        <div className='stepPicker'>
          {steps.map((_t, index) => (
            <button
              onClick={() => handleDirectStep(index)}
              className={index === step - 1 ? 'current' : ''}
              key={`step${index}`}
            >
              {index}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}