import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Heart, Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react'

interface BreathingExerciseProps {
  onClose: () => void
  technique?: '4-7-8' | 'box' | 'triangle' | 'simple'
}

const breathingTechniques = {
  '4-7-8': {
    name: '4-7-8 Technique',
    description: 'Inhale for 4, hold for 7, exhale for 8. Great for anxiety and sleep.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
      { name: 'Hold', duration: 7, instruction: 'Hold your breath gently' },
      { name: 'Exhale', duration: 8, instruction: 'Exhale slowly through your mouth' }
    ],
    cycles: 4,
    benefits: ['Reduces anxiety', 'Improves sleep', 'Activates relaxation response']
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equal 4-count breathing pattern. Used by Navy SEALs for focus.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly and deeply' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath comfortably' },
      { name: 'Exhale', duration: 4, instruction: 'Exhale slowly and completely' },
      { name: 'Hold', duration: 4, instruction: 'Hold empty lungs briefly' }
    ],
    cycles: 4,
    benefits: ['Improves focus', 'Reduces stress', 'Enhances mental clarity']
  },
  'triangle': {
    name: 'Triangle Breathing',
    description: 'Simple 3-phase breathing for quick stress relief.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { name: 'Hold', duration: 4, instruction: 'Hold gently' },
      { name: 'Exhale', duration: 4, instruction: 'Breathe out through your mouth' }
    ],
    cycles: 6,
    benefits: ['Quick stress relief', 'Easy to remember', 'Calms nervous system']
  },
  'simple': {
    name: 'Simple Deep Breathing',
    description: 'Basic deep breathing for beginners.',
    phases: [
      { name: 'Inhale', duration: 3, instruction: 'Breathe in deeply' },
      { name: 'Exhale', duration: 5, instruction: 'Breathe out slowly' }
    ],
    cycles: 8,
    benefits: ['Perfect for beginners', 'Immediate relaxation', 'Increases oxygen']
  }
}

export function BreathingExercise({ onClose, technique = '4-7-8' }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedTechnique, setSelectedTechnique] = useState(technique)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showPreparation, setShowPreparation] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentTechnique = breathingTechniques[selectedTechnique] || breathingTechniques['4-7-8']
  const totalPhases = currentTechnique?.phases?.length || 0
  const totalCycles = currentTechnique?.cycles || 4

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const playBreathingSound = (phase: string) => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      if (phase === 'Inhale') {
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5)
      } else if (phase === 'Exhale') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.5)
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('Audio playback failed')
    }
  }

  const moveToNextPhase = () => {
    setCurrentPhase(prevPhase => {
      const nextPhase = (prevPhase + 1) % totalPhases
      
      if (nextPhase === 0) {
        // Completed a full cycle
        setCurrentCycle(prevCycle => {
          const nextCycle = prevCycle + 1
          if (nextCycle >= totalCycles) {
            // Exercise completed
            setIsCompleted(true)
            setIsActive(false)
            return prevCycle
          }
          return nextCycle
        })
      }
      
      if (!isCompleted) {
        const newPhaseDuration = currentTechnique?.phases?.[nextPhase]?.duration || 4
        setTimeLeft(newPhaseDuration)
        playBreathingSound(currentTechnique?.phases?.[nextPhase]?.name || 'Breathe')
      }
      
      return nextPhase
    })
  }

  const startExercise = () => {
    if (!currentTechnique?.phases?.length) return
    
    setShowPreparation(false)
    setIsActive(true)
    setCurrentPhase(0)
    setCurrentCycle(0)
    setTimeLeft(currentTechnique.phases[0]?.duration || 4)
    setIsCompleted(false)
    
    playBreathingSound(currentTechnique.phases[0]?.name || 'Inhale')
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          moveToNextPhase()
          return prev
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseExercise = () => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resumeExercise = () => {
    setIsActive(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          moveToNextPhase()
          return prev
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentPhase(0)
    setCurrentCycle(0)
    setTimeLeft(0)
    setIsCompleted(false)
    setShowPreparation(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const currentPhaseData = currentTechnique?.phases?.[currentPhase] || { 
    name: 'Breathe', 
    duration: 4, 
    instruction: 'Focus on your breath' 
  }
  
  const progress = isActive && timeLeft > 0 ? 
    ((currentPhaseData.duration - timeLeft) / currentPhaseData.duration) * 100 : 0
  
  const overallProgress = totalPhases > 0 ? 
    ((currentCycle * totalPhases + currentPhase) / (totalCycles * totalPhases)) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>Breathing Exercise</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Find your calm through guided breathing
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {showPreparation && (
            <>
              {/* Technique Selection */}
              <div className="space-y-3">
                <h3 className="font-medium">Choose Your Technique</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(breathingTechniques).map(([key, tech]) => (
                    <Button
                      key={key}
                      variant={selectedTechnique === key ? "default" : "outline"}
                      className="text-left h-auto p-3 w-full"
                      onClick={() => setSelectedTechnique(key as keyof typeof breathingTechniques)}
                    >
                      <div className="w-full">
                        <div className="font-medium text-sm break-words">{tech?.name || 'Breathing Exercise'}</div>
                        <div className="text-xs sm:text-sm text-gray-600 break-words overflow-hidden whitespace-normal leading-tight">{tech?.description || 'Guided breathing'}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {(currentTechnique?.benefits || []).map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Preparation:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Find a comfortable position, sitting or lying down</li>
                  <li>• Close your eyes or soften your gaze</li>
                  <li>• Place one hand on your chest, one on your belly</li>
                  <li>• Breathe naturally to begin</li>
                </ul>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm text-gray-600">
                    Sound {soundEnabled ? 'on' : 'off'}
                  </span>
                </div>
                <Button onClick={startExercise} className="px-6">
                  <Play className="h-4 w-4 mr-2" />
                  Start Exercise
                </Button>
              </div>
            </>
          )}

          {!showPreparation && (
            <>
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cycle {currentCycle + 1} of {totalCycles}</span>
                  <span>{Math.round(overallProgress)}% Complete</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              {/* Breathing Visualization */}
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-48 h-48">
                  {/* Breathing Circle */}
                  <div 
                    className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                      currentPhaseData.name === 'Inhale' 
                        ? 'border-blue-400 bg-blue-100 scale-110' 
                        : currentPhaseData.name === 'Exhale'
                        ? 'border-green-400 bg-green-100 scale-90'
                        : 'border-purple-400 bg-purple-100 scale-100'
                    }`}
                    style={{
                      transform: isActive 
                        ? currentPhaseData.name === 'Inhale' 
                          ? `scale(${1 + progress / 200})` 
                          : currentPhaseData.name === 'Exhale'
                          ? `scale(${1.1 - progress / 200})`
                          : 'scale(1)'
                        : 'scale(1)'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{timeLeft}</div>
                        <div className={`text-lg font-medium ${
                          currentPhaseData.name === 'Inhale' ? 'text-blue-600' :
                          currentPhaseData.name === 'Exhale' ? 'text-green-600' : 'text-purple-600'
                        }`}>
                          {currentPhaseData.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {currentPhaseData.instruction}
                  </p>
                  <Progress 
                    value={progress} 
                    className={`h-3 ${
                      currentPhaseData.name === 'Inhale' ? 'bg-blue-100' :
                      currentPhaseData.name === 'Exhale' ? 'bg-green-100' : 'bg-purple-100'
                    }`}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-2">
                {isActive ? (
                  <Button onClick={pauseExercise} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : !isCompleted ? (
                  <Button onClick={resumeExercise}>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : null}
                
                <Button onClick={resetExercise} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              {/* Completion Message */}
              {isCompleted && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                  <div className="text-green-800 font-medium mb-2">
                    🎉 Exercise Complete!
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    Great job! You've completed {totalCycles} cycles of {currentTechnique?.name || 'breathing exercise'}. 
                    Take a moment to notice how you feel.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={resetExercise} size="sm">
                      Practice Again
                    </Button>
                    <Button onClick={onClose} variant="outline" size="sm">
                      Finish Session
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}