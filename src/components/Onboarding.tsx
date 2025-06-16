
import React, { useState } from 'react';
import { MapPin, Zap, Volume2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    city: '',
    skillLevel: '',
    musicVibe: ''
  });

  const cities = ['Brooklyn', 'Manhattan', 'Bronx', 'Queens', 'Other'];
  const skillLevels = [
    { level: 'Rookie', desc: 'Learning the basics', color: 'bg-green-500' },
    { level: 'Pro', desc: 'Solid fundamentals', color: 'bg-orange-500' },
    { level: 'Elite', desc: 'Streetball legend', color: 'bg-red-500' }
  ];
  const musicVibes = [
    { vibe: 'Hip-Hop', icon: '🎤', desc: 'Classic street vibes' },
    { vibe: 'R&B', icon: '🎵', desc: 'Smooth and soulful' },
    { vibe: 'Pop', icon: '⚡', desc: 'High energy beats' },
    { vibe: 'Jazz', icon: '🎷', desc: 'Smooth and classic' }
  ];

  const steps = [
    {
      title: "Where do you ball?",
      subtitle: "Select your city to find nearby courts",
      icon: <MapPin className="w-8 h-8 text-brand-magenta" />,
      content: (
        <div className="grid grid-cols-1 gap-3">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selections.city === city ? "default" : "outline"}
              className={`p-4 h-auto ${selections.city === city ? 'brand-gradient text-white' : ''}`}
              onClick={() => setSelections({...selections, city})}
            >
              {city}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: "What's your skill level?",
      subtitle: "Help us match you with the right games",
      icon: <Zap className="w-8 h-8 text-brand-orange" />,
      content: (
        <div className="space-y-3">
          {skillLevels.map((skill) => (
            <Button
              key={skill.level}
              variant="outline"
              className={`w-full p-4 h-auto flex items-center gap-4 ${
                selections.skillLevel === skill.level ? 'ring-2 ring-brand-magenta' : ''
              }`}
              onClick={() => setSelections({...selections, skillLevel: skill.level})}
            >
              <div className={`w-4 h-4 rounded-full ${skill.color}`}></div>
              <div className="text-left flex-1">
                <div className="font-semibold">{skill.level}</div>
                <div className="text-sm text-muted-foreground">{skill.desc}</div>
              </div>
              {selections.skillLevel === skill.level && (
                <CheckCircle className="w-5 h-5 text-brand-magenta" />
              )}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: "What's your vibe?",
      subtitle: "Choose your preferred game atmosphere",
      icon: <Volume2 className="w-8 h-8 text-brand-yellow" />,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {musicVibes.map((music) => (
            <Button
              key={music.vibe}
              variant="outline"
              className={`p-4 h-auto flex flex-col gap-2 ${
                selections.musicVibe === music.vibe ? 'ring-2 ring-brand-magenta' : ''
              }`}
              onClick={() => setSelections({...selections, musicVibe: music.vibe})}
            >
              <div className="text-2xl">{music.icon}</div>
              <div className="font-semibold">{music.vibe}</div>
              <div className="text-xs text-muted-foreground text-center">{music.desc}</div>
              {selections.musicVibe === music.vibe && (
                <CheckCircle className="w-4 h-4 text-brand-magenta" />
              )}
            </Button>
          ))}
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const canProceed = step === 0 ? selections.city : 
                     step === 1 ? selections.skillLevel : 
                     selections.musicVibe;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen brand-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-fade-in">
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index <= step ? 'bg-brand-magenta' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="mb-4">{currentStep.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-muted-foreground">{currentStep.subtitle}</p>
        </div>

        <div className="mb-8">
          {currentStep.content}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex-1 brand-gradient text-white font-bold ${
              canProceed ? 'hover:scale-105' : 'opacity-50'
            } transition-transform`}
          >
            {step === steps.length - 1 ? "Let's Ball!" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
